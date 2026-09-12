import express from 'express';
import path from 'path';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import { createServer as createViteServer } from 'vite';
import {
  getDbData,
  getPublicData,
  createRoute,
  updateRoute,
  deleteRoute,
  createService,
  updateService,
  deleteService,
  addChildContent,
  updateChildContent,
  deleteChildContent,
  updateSeoSettings,
  updateBrandAndHero,
  importCmsData,
  getSystemStatus,
} from './server/storage';
import {
  createSession,
  isValidSession,
  destroySession,
  verifyAdminPassword,
  extractToken,
  requireAdminAuth,
} from './server/auth';

const app = express();
const PORT = 3000;
const isProd = process.env.NODE_ENV === 'production';

// Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Trust proxy for secure cookies behind reverse proxy (like Cloud Run / Nginx)
app.set('trust proxy', 1);

// Helper to determine base URL
function getBaseUrl(req: express.Request): string {
  if (process.env.APP_URL && process.env.APP_URL.startsWith('http')) {
    return process.env.APP_URL.replace(/\/$/, '');
  }
  const host = req.get('host') || 'localhost:3000';
  const proto = req.get('x-forwarded-proto') || req.protocol || 'https';
  return `${proto}://${host}`;
}

// ----------------------------------------------------
// 1. AUTHENTICATION APIS
// ----------------------------------------------------
app.post('/api/auth/login', (req, res) => {
  const { password } = req.body;
  if (!password || !verifyAdminPassword(password)) {
    res.status(401).json({
      success: false,
      message: '密碼錯誤，請重新輸入',
    });
    return;
  }

  const token = createSession();
  res.cookie('admin_session', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,
    path: '/',
  });

  res.json({
    success: true,
    token,
    message: '登入成功',
  });
});

app.get('/api/auth/verify', (req, res) => {
  const token = extractToken(req);
  const authenticated = isValidSession(token);
  res.json({ authenticated });
});

app.post('/api/auth/logout', (req, res) => {
  const token = extractToken(req);
  destroySession(token);
  res.clearCookie('admin_session', { path: '/' });
  res.json({ success: true, message: '已安全登出' });
});

// ----------------------------------------------------
// 2. PUBLIC CMS APIS
// ----------------------------------------------------
app.get('/api/cms/public', async (req, res) => {
  try {
    const data = await getPublicData();
    res.setHeader('Cache-Control', 'public, max-age=10, stale-while-revalidate=30');
    res.json(data);
  } catch (err: any) {
    console.error('[API] Error in getPublicData:', err);
    res.status(500).json({ error: '無法讀取公開資料' });
  }
});

// ----------------------------------------------------
// 3. ADMIN PROTECTED CMS APIS
// ----------------------------------------------------
app.get('/api/admin/data', requireAdminAuth, async (req, res) => {
  try {
    const data = await getDbData();
    res.json(data);
  } catch (err: any) {
    console.error('[API Admin] Error in getDbData:', err);
    res.status(500).json({ error: '讀取後台資料失敗' });
  }
});

app.put('/api/admin/settings', requireAdminAuth, async (req, res) => {
  try {
    const { brand, hero } = req.body;
    const result = await updateBrandAndHero(brand, hero);
    res.json({ success: true, ...result });
  } catch (err: any) {
    console.error('[API Admin] Error updateBrandAndHero:', err);
    res.status(400).json({ error: err.message || '更新失敗' });
  }
});

app.post('/api/admin/routes', requireAdminAuth, async (req, res) => {
  try {
    const { name, tag, description, enabled, sort, quoteUrl } = req.body;
    if (!name) {
      res.status(400).json({ error: '路線名稱為必填' });
      return;
    }
    const created = await createRoute({
      name,
      tag: tag || '⚡ 10秒即時算價',
      description: description || '',
      enabled: enabled !== false,
      sort: Number(sort) || 1,
      quoteUrl: quoteUrl || 'https://summit-route-advisor.lovable.app/',
    });
    res.json({ success: true, route: created });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/admin/routes/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await updateRoute(id, req.body);
    res.json({ success: true, route: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/routes/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await deleteRoute(id);
    res.json({ success: true, message: `已成功刪除路線 ID: ${id}` });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/admin/services', requireAdminAuth, async (req, res) => {
  try {
    const { name, description, enabled, sort, displayMode, url, contents } = req.body;
    if (!name) {
      res.status(400).json({ error: '服務名稱為必填' });
      return;
    }
    const created = await createService({
      name,
      description: description || '',
      enabled: enabled !== false,
      sort: Number(sort) || 1,
      displayMode: displayMode || 'standard',
      url: url || '',
      contents: contents || [],
    });
    res.json({ success: true, service: created });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/admin/services/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await updateService(id, req.body);
    res.json({ success: true, service: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/services/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await deleteService(id);
    res.json({ success: true, message: `已成功刪除服務 ID: ${id}` });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/admin/services/:id/content', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, phone, url, line, enabled, sort } = req.body;
    if (!name) {
      res.status(400).json({ error: '子項目名稱為必填' });
      return;
    }
    const child = await addChildContent(id, {
      name,
      description: description || '',
      phone: phone || '',
      url: url || '',
      line: line || '',
      enabled: enabled !== false,
      sort: Number(sort) || 1,
    });
    res.json({ success: true, child });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/admin/services/:id/content/:childId', requireAdminAuth, async (req, res) => {
  try {
    const { id, childId } = req.params;
    const updated = await updateChildContent(id, childId, req.body);
    res.json({ success: true, child: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/services/:id/content/:childId', requireAdminAuth, async (req, res) => {
  try {
    const { id, childId } = req.params;
    await deleteChildContent(id, childId);
    res.json({ success: true, message: `已成功刪除子項目 ID: ${childId}` });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/admin/seo', requireAdminAuth, async (req, res) => {
  try {
    const updated = await updateSeoSettings(req.body);
    res.json({ success: true, seo: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/admin/export', requireAdminAuth, async (req, res) => {
  try {
    const data = await getDbData();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="amazon-shuttle-backup-${Date.now()}.json"`);
    res.send(JSON.stringify(data, null, 2));
  } catch (err: any) {
    res.status(500).json({ error: '資料匯出失敗' });
  }
});

app.post('/api/admin/import', requireAdminAuth, async (req, res) => {
  try {
    const { payload, mode } = req.body;
    if (!payload) {
      res.status(400).json({ error: '缺少匯入內容' });
      return;
    }
    const result = await importCmsData(payload, mode || 'REPLACE');
    res.json({ success: true, message: '資料匯入成功，已同步更新至正式資料庫', version: result.version });
  } catch (err: any) {
    res.status(400).json({ error: err.message || '匯入驗證失敗' });
  }
});

app.get('/api/admin/status', requireAdminAuth, async (req, res) => {
  try {
    const status = await getSystemStatus();
    res.json(status);
  } catch (err: any) {
    res.status(500).json({ error: '無法讀取系統狀態' });
  }
});

// ----------------------------------------------------
// 4. SEO: ROBOTS.TXT & SITEMAP.XML
// ----------------------------------------------------
app.get('/robots.txt', (req, res) => {
  const baseUrl = getBaseUrl(req);
  const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml
`;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.send(robots);
});

app.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = getBaseUrl(req);
    const data = await getPublicData();
    const lastmod = new Date(data.lastUpdated || Date.now()).toISOString().split('T')[0];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.send(xml.trim());
  } catch (err) {
    res.status(500).send('Error generating sitemap');
  }
});

// ----------------------------------------------------
// 5. SERVER PRE-RENDERED HTML INJECTION FOR PUBLIC PAGES
// ----------------------------------------------------
async function renderHtmlWithSeo(req: express.Request, rawHtml: string): Promise<string> {
  try {
    const baseUrl = getBaseUrl(req);
    const data = await getPublicData();
    const seo = data.seo;
    const brand = data.brand;
    const hero = data.hero;

    const canonicalUrl = seo.canonical || `${baseUrl}/`;

    // Semantic HTML pre-rendered crawler content inside root
    const crawlerContent = `
      <div id="ssr-crawler-content" class="sr-only">
        <header>
          <h1>${hero.h1}</h1>
          <p>${hero.subtitle}</p>
          <a href="${hero.ctaUrl}">線上估價</a>
        </header>
        <main>
          <section>
            <h2>熱門接駁路線</h2>
            <ul>
              ${data.routes
                .map(
                  (r) => `
                <li>
                  <h3>${r.name}</h3>
                  <span>${r.tag}</span>
                  <p>${r.description}</p>
                  <a href="${r.quoteUrl}">試算此路線</a>
                </li>
              `
                )
                .join('')}
            </ul>
          </section>
          <section>
            <h2>加值服務</h2>
            <ul>
              ${data.services
                .map(
                  (s) => `
                <li>
                  <h3>${s.name}</h3>
                  <p>${s.description}</p>
                  ${
                    s.contents && s.contents.length > 0
                      ? `<ul>
                          ${s.contents
                            .map((c) => `<li><strong>${c.name}</strong> - ${c.description} (電話: ${c.phone})</li>`)
                            .join('')}
                        </ul>`
                      : ''
                  }
                </li>
              `
                )
                .join('')}
            </ul>
          </section>
          <section>
            <h2>預約流程</h2>
            <ol>
              ${data.bookingSteps.map((b) => `<li>第 ${b.step} 步: ${b.title} - ${b.description}</li>`).join('')}
            </ol>
          </section>
          <section>
            <h2>車隊 4 大專業優勢</h2>
            <ul>
              ${data.fleetAdvantages.map((a) => `<li><strong>${a.title}</strong>: ${a.description}</li>`).join('')}
            </ul>
          </section>
        </main>
        <footer>
          <p>聯絡電話: <a href="tel:${brand.phone}">${brand.phone}</a></p>
          <p>Email: <a href="mailto:${brand.email}">${brand.email}</a></p>
          <p>LINE 官方: <a href="${brand.lineUrl}">${brand.lineUrl}</a></p>
          <p>© ${brand.name}</p>
        </footer>
      </div>
    `;

    // Dynamic JSON-LD structured data
    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${baseUrl}/#website`,
          name: brand.name,
          url: `${baseUrl}/`,
          description: seo.metaDescription,
        },
        {
          '@type': 'Organization',
          '@id': `${baseUrl}/#organization`,
          name: brand.name,
          url: `${baseUrl}/`,
          telephone: `+886-${brand.phone.replace(/^0/, '')}`,
          email: brand.email,
          sameAs: [brand.lineUrl, brand.quoteUrl],
        },
        {
          '@type': 'TaxiService',
          '@id': `${baseUrl}/#service`,
          name: brand.name,
          serviceType: '高山登山口接駁與登山包車',
          provider: {
            '@id': `${baseUrl}/#organization`,
          },
          areaServed: 'Taiwan',
          description: seo.metaDescription,
          offers: {
            '@type': 'Offer',
            url: brand.quoteUrl,
            priceCurrency: 'TWD',
            description: '線上 10 秒即時算價',
          },
        },
      ],
    };

    let processed = rawHtml;

    // Replace title
    processed = processed.replace(/<title>.*?<\/title>/i, `<title>${seo.siteTitle}</title>`);

    // Inject canonical
    if (!processed.includes('<link rel="canonical"')) {
      processed = processed.replace(
        '</head>',
        `  <link rel="canonical" href="${canonicalUrl}" />\n</head>`
      );
    } else {
      processed = processed.replace(/<link rel="canonical"[^>]*>/i, `<link rel="canonical" href="${canonicalUrl}" />`);
    }

    // Replace meta description
    processed = processed.replace(
      /<meta name="description"[^>]*>/i,
      `<meta name="description" content="${seo.metaDescription}" />`
    );

    // Replace keywords
    processed = processed.replace(
      /<meta name="keywords"[^>]*>/i,
      `<meta name="keywords" content="${seo.keywords}" />`
    );

    // Replace og tags
    processed = processed.replace(
      /<meta property="og:title"[^>]*>/i,
      `<meta property="og:title" content="${seo.ogTitle}" />`
    );
    processed = processed.replace(
      /<meta property="og:description"[^>]*>/i,
      `<meta property="og:description" content="${seo.ogDescription}" />`
    );
    processed = processed.replace(
      /<meta property="og:url"[^>]*>/i,
      `<meta property="og:url" content="${canonicalUrl}" />`
    );

    // Replace structured data
    processed = processed.replace(
      /<script type="application\/ld\+json">[\s\S]*?<\/script>/i,
      `<script type="application/ld+json">\n${JSON.stringify(jsonLd, null, 2)}\n</script>`
    );

    // Inject crawler fallback into root
    processed = processed.replace('<div id="root"></div>', `<div id="root">${crawlerContent}</div>`);

    return processed;
  } catch (err) {
    console.error('[SSR Injection Error]:', err);
    return rawHtml;
  }
}

// ----------------------------------------------------
// 6. VITE MIDDLEWARE & STATIC SERVER
// ----------------------------------------------------
async function start() {
  let vite: any;

  if (!isProd) {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, { index: false }));
  }

  // HTML serving route
  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;

    // Ignore API routes
    if (url.startsWith('/api/')) {
      return next();
    }

    try {
      let template: string;
      if (!isProd && vite) {
        const indexPath = path.join(process.cwd(), 'index.html');
        template = await fs.promises.readFile(indexPath, 'utf-8');
        template = await vite.transformIndexHtml(url, template);
      } else {
        const distIndexPath = path.join(process.cwd(), 'dist', 'index.html');
        template = await fs.promises.readFile(distIndexPath, 'utf-8');
      }

      const finalHtml = await renderHtmlWithSeo(req, template);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(finalHtml);
    } catch (e: any) {
      if (!isProd && vite) {
        vite.ssrFixStacktrace(e);
      }
      next(e);
    }
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] 亞馬遜高山接駁伺服器運作中 http://0.0.0.0:${PORT}`);
  });
}

start();
