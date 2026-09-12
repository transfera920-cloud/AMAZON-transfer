import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type { CmsData, PublicCmsData, RouteItem, ServiceItem, ChildContent, SeoSettings, SystemStatus } from '../src/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'production-db.json');
const BACKUPS_DIR = path.join(DATA_DIR, 'backups');

const DEFAULT_DATA: CmsData = {
  brand: {
    name: '亞馬遜高山接駁',
    phone: '0972573495',
    email: 'yy661003@gmail.com',
    lineUrl: 'https://lin.ee/TO7bDic',
    quoteUrl: 'https://summit-route-advisor.lovable.app/',
  },
  hero: {
    h1: '亞馬遜高山接駁｜全國登山口專業包車與接駁服務',
    subtitle: '熟悉全台高山與林道路況，安全舒適、準時抵達，線上 10 秒即時算價！',
    ctaText: '線上估價',
    ctaUrl: 'https://summit-route-advisor.lovable.app/',
  },
  routes: [
    {
      id: 'route_hehuanshan',
      name: '合歡山・奇萊群峰接駁',
      tag: '⚡ 10秒即時算價',
      description: '合歡主東峰、北西峰、奇萊主北、奇萊南華，松雪樓與滑雪山莊出發',
      enabled: true,
      sort: 1,
      quoteUrl: 'https://summit-route-advisor.lovable.app/',
    },
    {
      id: 'route_xueshan',
      name: '雪山・武陵農場接駁',
      tag: '⚡ 10秒即時算價',
      description: '雪山主東峰、武陵四秀（品田/池有/桃山/喀拉業）、志佳陽大山專車接送',
      enabled: true,
      sort: 2,
      quoteUrl: 'https://summit-route-advisor.lovable.app/',
    },
    {
      id: 'route_yushan',
      name: '玉山・塔塔加接駁',
      tag: '⚡ 10秒即時算價',
      description: '玉山主西前峰、八通關古道西段，東埔山莊與排雲登山服務中心接駁',
      enabled: true,
      sort: 3,
      quoteUrl: 'https://summit-route-advisor.lovable.app/',
    },
    {
      id: 'route_jiaminghu',
      name: '嘉明湖・向陽接駁',
      tag: '⚡ 10秒即時算價',
      description: '向陽國家森林遊樂區、戒茂斯山登山口，南橫公路沿線專車接送',
      enabled: true,
      sort: 4,
      quoteUrl: 'https://summit-route-advisor.lovable.app/',
    },
    {
      id: 'route_nanhu',
      name: '南湖大山・中央尖山接駁',
      tag: '⚡ 10秒即時算價',
      description: '勝光登山口、思源埡口登山口專車包車，台7甲線沿線安全接送',
      enabled: true,
      sort: 5,
      quoteUrl: 'https://summit-route-advisor.lovable.app/',
    },
    {
      id: 'route_nenggao',
      name: '能高越嶺・屯原接駁',
      tag: '⚡ 10秒即時算價',
      description: '能高越嶺西段屯原登山口、廬山溫泉接駁，熟悉高山碎石林況',
      enabled: true,
      sort: 6,
      quoteUrl: 'https://summit-route-advisor.lovable.app/',
    },
    {
      id: 'route_dabajian',
      name: '大霸尖山・觀霧接駁',
      tag: '⚡ 10秒即時算價',
      description: '觀霧國家森林遊樂區、大鹿林道東段接駁，安全舒適專車',
      enabled: true,
      sort: 7,
      quoteUrl: 'https://summit-route-advisor.lovable.app/',
    },
    {
      id: 'route_xiakaluo',
      name: '霞喀羅古道・A進B出接駁',
      tag: '⚡ 10秒即時算價',
      description: '清泉五峰端 ↔ 養老尖石端雙向接送，縱走免折返',
      enabled: true,
      sort: 8,
      quoteUrl: 'https://summit-route-advisor.lovable.app/',
    },
  ],
  services: [
    {
      id: 'srv_d0_hostel',
      name: 'D0 合作民宿諮詢與代訂',
      description: '登百岳前一晚充足睡眠與整備是安全關鍵，提供登山口周邊優質友善民宿諮詢與代訂服務。',
      enabled: true,
      sort: 1,
      displayMode: 'list',
      url: 'https://lin.ee/TO7bDic',
      contents: [
        {
          id: 'child_d0_qingjing',
          name: '清境／霧社高山友善合作民宿',
          description: '合歡山、奇萊群峰及能高越嶺專屬前哨站，備有早起保溫熱水與裝備整理空間。',
          phone: '0972573495',
          url: 'https://lin.ee/TO7bDic',
          line: '@amazon_shuttle',
          enabled: true,
          sort: 1,
        },
        {
          id: 'child_d0_dongpu',
          name: '東埔／塔塔加周邊住宿代洽',
          description: '玉山群峰出發前一晚接續住宿，方便清晨第一時間前往排雲管理站。',
          phone: '0972573495',
          url: 'https://lin.ee/TO7bDic',
          line: '@amazon_shuttle',
          enabled: true,
          sort: 2,
        },
        {
          id: 'child_d0_wuling',
          name: '南山村／武陵環山部落民宿',
          description: '雪山與南湖大山登山口鄰近留宿點，省去當日長途車程奔波。',
          phone: '0972573495',
          url: 'https://lin.ee/TO7bDic',
          line: '@amazon_shuttle',
          enabled: true,
          sort: 3,
        },
      ],
    },
    {
      id: 'srv_luggage',
      name: '下山行李免費寄放',
      description: '行程期間多餘換洗衣物、下山用品可安心放置專屬接駁車輛或集散點，登山輕量化無負擔。',
      enabled: true,
      sort: 2,
      displayMode: 'standard',
      contents: [],
    },
    {
      id: 'srv_banquet_shower',
      name: '慶功宴與洗澡行程接送',
      description: '下山後由專車無縫接送至鄰近合法溫泉、洗澡淋浴點或在地慶功宴餐廳，洗淨疲憊舒適返程。',
      enabled: true,
      sort: 3,
      displayMode: 'standard',
      contents: [],
    },
    {
      id: 'srv_supplies',
      name: '濾水器及各項登山耗材代購',
      description: '行前可預約代備高山瓦斯罐、備用濾水耗材、急救毯等必備高山裝備，登山口交件省心齊全。',
      enabled: true,
      sort: 4,
      displayMode: 'standard',
      contents: [],
    },
  ],
  bookingSteps: [
    {
      step: 1,
      title: '線上估價',
      description: '透過線上即時試算系統，10 秒內快速確認專車費用與詳細路線。',
    },
    {
      step: 2,
      title: 'LINE 確認細節',
      description: '加入官方 LINE 提供預計搭車日期、上下車地點、人數及裝備數量。',
    },
    {
      step: 3,
      title: '支付訂金預約',
      description: '確認派車調度與報價無誤後，支付訂金立即保留專屬專車時段。',
    },
    {
      step: 4,
      title: '安心出發',
      description: '出發前一日主動提供司機電話與車牌號碼，專業準時到點接送。',
    },
  ],
  fleetAdvantages: [
    {
      id: 'adv_driver',
      title: '專業高山司機',
      description: '長期行駛各大高山林道與管制路段，熟悉路況氣候變化，駕車沉穩安全。',
      iconName: 'Users',
    },
    {
      id: 'adv_luggage',
      title: '大容量行李與裝備空間',
      description: '配置多款長軸大容量商務車型，全員重裝大背包、登山杖輕鬆安放不擠壓。',
      iconName: 'Luggage',
    },
    {
      id: 'adv_insurance',
      title: '全車高額乘客險',
      description: '每位乘客皆享有合法足額乘客險與責任險保障，長途山路搭乘倍感安心。',
      iconName: 'ShieldCheck',
    },
    {
      id: 'adv_price',
      title: '價格透明不亂加價',
      description: '全程線上即時算價，報價明定不隨意坐地起價，公道誠信值得信賴。',
      iconName: 'BadgeDollarSign',
    },
  ],
  seo: {
    siteTitle: '亞馬遜高山接駁｜全國登山口專業包車與接駁服務',
    metaDescription: '亞馬遜高山接駁提供全台百岳及登山口專業包車接駁服務。熟悉全台高山與林道路況，安全舒適、準時抵達，線上 10 秒即時算價！',
    keywords: '高山接駁, 登山口接駁, 登山包車, 百岳接駁, 登山口包車, 登山接駁車, D0住宿接駁, A進B出接駁, 亞馬遜高山接駁',
    canonical: '',
    ogTitle: '亞馬遜高山接駁｜全國登山口專業包車與接駁服務',
    ogDescription: '熟悉全台高山與林道路況，安全舒適、準時抵達，線上 10 秒即時算價！',
    ogImage: '',
    robots: 'index, follow',
  },
  lastUpdated: new Date().toISOString(),
  version: 1,
};

let cachedData: CmsData | null = null;
const startTime = Date.now();

function ensureDirectories() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(BACKUPS_DIR)) {
    fs.mkdirSync(BACKUPS_DIR, { recursive: true });
  }
}

/**
 * Initializes and loads authoritative data.
 * CRITICAL: If data file exists, NEVER overwrite it!
 */
export async function getDbData(): Promise<CmsData> {
  if (cachedData) {
    return cachedData;
  }

  ensureDirectories();

  if (!fs.existsSync(DB_FILE)) {
    console.log('[Storage] Initializing production database with default data.');
    await saveDbData(DEFAULT_DATA, false);
    cachedData = DEFAULT_DATA;
    return cachedData;
  }

  try {
    const raw = await fs.promises.readFile(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as CmsData;
    cachedData = parsed;
    return cachedData;
  } catch (err) {
    console.error('[Storage] Error reading db file, attempting recovery from backup', err);
    throw new Error('Could not load authoritative database.');
  }
}

/**
 * Atomically writes data to disk to guarantee no corruption.
 */
export async function saveDbData(data: CmsData, createBackup = true): Promise<void> {
  ensureDirectories();

  if (createBackup && fs.existsSync(DB_FILE)) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(BACKUPS_DIR, `db-backup-${timestamp}.json`);
    try {
      await fs.promises.copyFile(DB_FILE, backupFile);
    } catch (e) {
      console.warn('[Storage] Warning: Failed to create automatic backup before save', e);
    }
  }

  const updatedData: CmsData = {
    ...data,
    lastUpdated: new Date().toISOString(),
    version: (data.version || 0) + 1,
  };

  const tempFile = path.join(DATA_DIR, `db-${Date.now()}-${crypto.randomBytes(4).toString('hex')}.tmp`);
  await fs.promises.writeFile(tempFile, JSON.stringify(updatedData, null, 2), 'utf-8');
  await fs.promises.rename(tempFile, DB_FILE);

  cachedData = updatedData;
}

export async function getPublicData(): Promise<PublicCmsData> {
  const full = await getDbData();
  return {
    brand: full.brand,
    hero: full.hero,
    routes: full.routes
      .filter((r) => r.enabled)
      .sort((a, b) => a.sort - b.sort),
    services: full.services
      .filter((s) => s.enabled)
      .sort((a, b) => a.sort - b.sort)
      .map((s) => ({
        ...s,
        contents: (s.contents || [])
          .filter((c) => c.enabled)
          .sort((a, b) => a.sort - b.sort),
      })),
    bookingSteps: full.bookingSteps,
    fleetAdvantages: full.fleetAdvantages,
    seo: full.seo,
    lastUpdated: full.lastUpdated,
  };
}

export function generateId(prefix = 'item'): string {
  return `${prefix}_${Date.now().toString(36)}_${crypto.randomBytes(4).toString('hex')}`;
}

export async function createRoute(route: Omit<RouteItem, 'id'>): Promise<RouteItem> {
  const data = await getDbData();
  const newRoute: RouteItem = {
    ...route,
    id: generateId('route'),
    enabled: Boolean(route.enabled),
    sort: Number(route.sort) || data.routes.length + 1,
  };
  data.routes.push(newRoute);
  await saveDbData(data);
  return newRoute;
}

export async function updateRoute(id: string, updates: Partial<RouteItem>): Promise<RouteItem> {
  const data = await getDbData();
  const index = data.routes.findIndex((r) => r.id === id);
  if (index === -1) {
    throw new Error(`Route with ID ${id} not found.`);
  }

  data.routes[index] = {
    ...data.routes[index],
    ...updates,
    id, // Preserve permanent ID
  };
  await saveDbData(data);
  return data.routes[index];
}

export async function deleteRoute(id: string): Promise<void> {
  const data = await getDbData();
  const beforeCount = data.routes.length;
  data.routes = data.routes.filter((r) => r.id !== id);
  if (data.routes.length === beforeCount) {
    throw new Error(`Route with ID ${id} not found.`);
  }
  await saveDbData(data);
}

export async function createService(service: Omit<ServiceItem, 'id'>): Promise<ServiceItem> {
  const data = await getDbData();
  const newService: ServiceItem = {
    ...service,
    id: generateId('srv'),
    enabled: Boolean(service.enabled),
    sort: Number(service.sort) || data.services.length + 1,
    contents: service.contents || [],
  };
  data.services.push(newService);
  await saveDbData(data);
  return newService;
}

export async function updateService(id: string, updates: Partial<ServiceItem>): Promise<ServiceItem> {
  const data = await getDbData();
  const index = data.services.findIndex((s) => s.id === id);
  if (index === -1) {
    throw new Error(`Service with ID ${id} not found.`);
  }

  const existingContents = data.services[index].contents || [];
  data.services[index] = {
    ...data.services[index],
    ...updates,
    id, // Preserve permanent ID
    contents: updates.contents !== undefined ? updates.contents : existingContents,
  };
  await saveDbData(data);
  return data.services[index];
}

export async function deleteService(id: string): Promise<void> {
  const data = await getDbData();
  const beforeCount = data.services.length;
  data.services = data.services.filter((s) => s.id !== id);
  if (data.services.length === beforeCount) {
    throw new Error(`Service with ID ${id} not found.`);
  }
  await saveDbData(data);
}

export async function addChildContent(
  serviceId: string,
  child: Omit<ChildContent, 'id'>
): Promise<ChildContent> {
  const data = await getDbData();
  const service = data.services.find((s) => s.id === serviceId);
  if (!service) {
    throw new Error(`Parent service with ID ${serviceId} not found.`);
  }

  if (!service.contents) {
    service.contents = [];
  }

  const newChild: ChildContent = {
    ...child,
    id: generateId('child'),
    enabled: Boolean(child.enabled),
    sort: Number(child.sort) || service.contents.length + 1,
  };

  service.contents.push(newChild);
  await saveDbData(data);
  return newChild;
}

export async function updateChildContent(
  serviceId: string,
  childId: string,
  updates: Partial<ChildContent>
): Promise<ChildContent> {
  const data = await getDbData();
  const service = data.services.find((s) => s.id === serviceId);
  if (!service || !service.contents) {
    throw new Error(`Parent service with ID ${serviceId} not found.`);
  }

  const index = service.contents.findIndex((c) => c.id === childId);
  if (index === -1) {
    throw new Error(`Child content with ID ${childId} not found in service ${serviceId}.`);
  }

  service.contents[index] = {
    ...service.contents[index],
    ...updates,
    id: childId, // ID invariant
  };

  await saveDbData(data);
  return service.contents[index];
}

export async function deleteChildContent(serviceId: string, childId: string): Promise<void> {
  const data = await getDbData();
  const service = data.services.find((s) => s.id === serviceId);
  if (!service || !service.contents) {
    throw new Error(`Parent service with ID ${serviceId} not found.`);
  }

  const beforeCount = service.contents.length;
  service.contents = service.contents.filter((c) => c.id !== childId);
  if (service.contents.length === beforeCount) {
    throw new Error(`Child content with ID ${childId} not found.`);
  }

  await saveDbData(data);
}

export async function updateSeoSettings(seo: Partial<SeoSettings>): Promise<SeoSettings> {
  const data = await getDbData();
  data.seo = {
    ...data.seo,
    ...seo,
  };
  await saveDbData(data);
  return data.seo;
}

export async function updateBrandAndHero(
  brand?: Partial<CmsData['brand']>,
  hero?: Partial<CmsData['hero']>
): Promise<{ brand: CmsData['brand']; hero: CmsData['hero'] }> {
  const data = await getDbData();
  if (brand) {
    data.brand = { ...data.brand, ...brand };
  }
  if (hero) {
    data.hero = { ...data.hero, ...hero };
  }
  await saveDbData(data);
  return { brand: data.brand, hero: data.hero };
}

export async function importCmsData(payload: Partial<CmsData>, mode: 'REPLACE' | 'MERGE' = 'REPLACE'): Promise<CmsData> {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Import data must be a valid JSON object.');
  }

  // Validate structure
  if (payload.routes && !Array.isArray(payload.routes)) {
    throw new Error('Routes must be an array.');
  }
  if (payload.services && !Array.isArray(payload.services)) {
    throw new Error('Services must be an array.');
  }

  // Check ID duplicates
  const routeIds = new Set<string>();
  if (payload.routes) {
    for (const r of payload.routes) {
      if (!r.id || !r.name) {
        throw new Error('Every route must have an id and name.');
      }
      if (routeIds.has(r.id)) {
        throw new Error(`Duplicate route ID found in import: ${r.id}`);
      }
      routeIds.add(r.id);
    }
  }

  const serviceIds = new Set<string>();
  const childIds = new Set<string>();
  if (payload.services) {
    for (const s of payload.services) {
      if (!s.id || !s.name) {
        throw new Error('Every service must have an id and name.');
      }
      if (serviceIds.has(s.id)) {
        throw new Error(`Duplicate service ID found in import: ${s.id}`);
      }
      serviceIds.add(s.id);

      if (s.contents && Array.isArray(s.contents)) {
        for (const c of s.contents) {
          if (!c.id || !c.name) {
            throw new Error(`Child item in service ${s.id} must have an id and name.`);
          }
          if (childIds.has(c.id)) {
            throw new Error(`Duplicate child ID found in import: ${c.id}`);
          }
          childIds.add(c.id);
        }
      }
    }
  }

  const current = await getDbData();
  let nextData: CmsData;

  if (mode === 'REPLACE') {
    nextData = {
      brand: payload.brand ? { ...current.brand, ...payload.brand } : current.brand,
      hero: payload.hero ? { ...current.hero, ...payload.hero } : current.hero,
      routes: payload.routes || current.routes,
      services: payload.services || current.services,
      bookingSteps: payload.bookingSteps || current.bookingSteps,
      fleetAdvantages: payload.fleetAdvantages || current.fleetAdvantages,
      seo: payload.seo ? { ...current.seo, ...payload.seo } : current.seo,
      lastUpdated: new Date().toISOString(),
      version: (current.version || 1) + 1,
    };
  } else {
    // MERGE
    const routesMap = new Map(current.routes.map((r) => [r.id, r]));
    (payload.routes || []).forEach((r) => routesMap.set(r.id, r));

    const servicesMap = new Map(current.services.map((s) => [s.id, s]));
    (payload.services || []).forEach((s) => servicesMap.set(s.id, s));

    nextData = {
      ...current,
      brand: payload.brand ? { ...current.brand, ...payload.brand } : current.brand,
      hero: payload.hero ? { ...current.hero, ...payload.hero } : current.hero,
      routes: Array.from(routesMap.values()),
      services: Array.from(servicesMap.values()),
      seo: payload.seo ? { ...current.seo, ...payload.seo } : current.seo,
      lastUpdated: new Date().toISOString(),
      version: (current.version || 1) + 1,
    };
  }

  await saveDbData(nextData, true);
  return nextData;
}

export async function getSystemStatus(): Promise<SystemStatus> {
  const data = await getDbData();
  const childContentsCount = data.services.reduce((acc, s) => acc + (s.contents ? s.contents.length : 0), 0);

  return {
    status: 'ok',
    routesCount: data.routes.length,
    servicesCount: data.services.length,
    childContentsCount,
    lastUpdated: data.lastUpdated,
    serverTime: new Date().toISOString(),
    uptimeSeconds: Math.floor((Date.now() - startTime) / 1000),
    storageType: 'Durable Production Storage (Atomic Write + Automated Backup)',
  };
}
