import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Browser, Page } from 'puppeteer';
import { getDb } from '../db/sqlite';

puppeteer.use(StealthPlugin());

let browser: Browser | null = null;
let activePage: Page | null = null;

export async function launchBrowser(headless: boolean = true) {
  if (!browser) {
    browser = await puppeteer.launch({
      headless,
      protocolTimeout: 240000,
      defaultViewport: null,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    }) as unknown as Browser;
  }
  return browser;
}

export async function closeBrowser() {
  if (browser) {
    await browser.close();
    browser = null;
    activePage = null;
  }
}

export async function getPage(url?: string, useNewTab: boolean = false): Promise<Page> {
  const b = await launchBrowser();
  let page: Page;
  
  if (useNewTab) {
    page = await b.newPage();
  } else {
    if (!activePage || activePage.isClosed()) {
      activePage = await b.newPage();
      await activePage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
    }
    page = activePage;
  }
  
  // load cookies only if page is fresh or we need to ensure session
  const cookiesOnPage = await page.cookies();
  if (cookiesOnPage.length === 0) {
    const db = getDb();
    const session = await db.get('SELECT cookies FROM session WHERE id = 1');
    if (session && session.cookies) {
      const cookies = JSON.parse(session.cookies);
      await page.setCookie(...cookies);
    }
  }

  if (url) {
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    } catch (e: any) {
      console.warn(`[Browser] Navigation warning for ${url}: ${e.message}`);
      // Try again once if it's a timeout
      if (e.message.includes('timeout')) {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      }
    }
  }
  return page;
}

export async function saveCookies(page: Page) {
  const cookies = await page.cookies();
  const db = getDb();
  await db.run('INSERT OR REPLACE INTO session (id, cookies) VALUES (1, ?)', [JSON.stringify(cookies)]);
}
