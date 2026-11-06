import { strict as assert } from 'node:assert';
import { spawn, execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { createServer } from 'node:net';
import path from 'node:path';
import { chromium } from 'playwright';

const tmp = mkdtempSync(path.join(process.cwd(), '.history-browser-'));
process.env.TEMP = tmp;
process.env.TMP = tmp;
const listener = createServer();
await new Promise((resolve) => listener.listen(0, '127.0.0.1', resolve));
const port = listener.address().port;
await new Promise((resolve) => listener.close(resolve));
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'dev', '-p', String(port)], {
  cwd: process.cwd(), env: process.env, stdio: ['ignore', 'pipe', 'pipe']
});
const ready = new Promise((resolve, reject) => {
  server.stdout.on('data', (chunk) => { if (String(chunk).includes('Ready')) resolve(); });
  server.on('error', reject);
  server.on('exit', (code) => reject(new Error(`Next exited ${code}`)));
});
let browser;
try {
  await ready;
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.addInitScript(() => {
    window.__testPops = 0;
    window.addEventListener('popstate', () => { window.__testPops++; }, true);
  });
  await page.route('**/api/orders/test-order/edit', (route) => route.fulfill({ json: {
    biodata: { templateSlug: 'kumkum', docLocale: 'en', fullName: 'Example Person', profileType: 'bride', dob: '1990-01-01', phone: '+919876543210' },
    templateSlug: 'kumkum', pricePaise: 4900, editsUsed: 0, editLimit: 2
  } }));
  await page.route('**/en/orders/test-order', (route) => route.fulfill({ contentType: 'text/html', body: '<title>Order</title>' }));
  const dialogs = [];
  let accept = false;
  page.on('dialog', async (dialog) => {
    dialogs.push(dialog.type());
    if (accept) await dialog.accept(); else await dialog.dismiss();
  });
  await page.goto(`http://localhost:${port}/en/faq`);
  await page.goto(`http://localhost:${port}/en/orders/test-order/edit`);
  const name = page.getByLabel('Full name');
  await name.waitFor();
  const length = await page.evaluate(() => history.length);
  await name.fill('Changed Name');
  await page.waitForFunction((n) => history.length > n, length);
  await page.locator('a[href="#main"]').focus();
  await page.keyboard.press('Enter');
  await page.waitForURL('**/edit#main');
  assert.deepEqual(dialogs, [], 'following the skip link must not prompt');
  await page.evaluate(() => history.back());
  await page.waitForURL('**/edit', { timeout: 5000 });
  assert.deepEqual(dialogs, [], 'Back through an in-page anchor must not prompt');
  assert.equal(await name.inputValue(), 'Changed Name');
  const pops = await page.evaluate(() => window.__testPops);
  await page.evaluate(() => history.back());
  await page.waitForFunction((n) => window.__testPops >= n + 2, pops);
  assert.deepEqual(dialogs, ['confirm'], 'cancelling Back prompts and returns to the editor');
  assert.equal(await name.inputValue(), 'Changed Name');
  await page.reload().catch(() => {});
  assert.deepEqual(dialogs, ['confirm', 'beforeunload'], 'ordinary reload retains its unload warning');
  assert.equal(await name.inputValue(), 'Changed Name');
  accept = true;
  await page.evaluate(() => history.back());
  await page.waitForURL('**/en/orders/test-order');
  assert.deepEqual(dialogs, ['confirm', 'beforeunload', 'confirm'], 'confirmed Back must not prompt again');
  await context.close();
  const beforeContext = await browser.newContext();
  const beforePage = await beforeContext.newPage();
  await beforePage.addInitScript(() => {
    window.__testPops = 0;
    window.addEventListener('popstate', () => { window.__testPops++; }, true);
  });
  await beforePage.route('**/api/orders/test-order/edit', (route) => route.fulfill({ json: {
    biodata: { templateSlug: 'kumkum', docLocale: 'en', fullName: 'Example Person', profileType: 'bride', dob: '1990-01-01', phone: '+919876543210' },
    templateSlug: 'kumkum', pricePaise: 4900, editsUsed: 0, editLimit: 2
  } }));
  await beforePage.route('**/en/orders/test-order', (route) => route.fulfill({ contentType: 'text/html', body: '<title>Order</title>' }));
  const beforeDialogs = [];
  let beforeAccept = false;
  beforePage.on('dialog', async (dialog) => {
    beforeDialogs.push(dialog.type());
    if (beforeAccept) await dialog.accept(); else await dialog.dismiss();
  });
  await beforePage.goto(`http://localhost:${port}/en/faq`);
  await beforePage.goto(`http://localhost:${port}/en/orders/test-order/edit`);
  const beforeName = beforePage.getByLabel('Full name');
  await beforeName.waitFor();
  await beforePage.locator('a[href="#main"]').focus();
  await beforePage.keyboard.press('Enter');
  await beforePage.waitForURL('**/edit#main');
  const beforeLength = await beforePage.evaluate(() => history.length);
  await beforeName.fill('Changed Name');
  await beforePage.waitForFunction((n) => history.length > n, beforeLength);
  assert.deepEqual(beforeDialogs, [], 'fragment before editing must not prompt');
  const beforePops = await beforePage.evaluate(() => window.__testPops);
  await beforePage.evaluate(() => history.back());
  await beforePage.waitForFunction((n) => window.__testPops >= n + 2, beforePops);
  assert.deepEqual(beforeDialogs, ['confirm']);
  assert.equal(await beforeName.inputValue(), 'Changed Name');
  beforeAccept = true;
  await beforePage.evaluate(() => history.back());
  await beforePage.waitForURL('**/en/orders/test-order', { timeout: 6000 });
  assert.deepEqual(beforeDialogs, ['confirm', 'confirm'], 'confirmation must not cause another unload prompt');
  await beforeContext.close();
  const cleanContext = await browser.newContext();
  const cleanPage = await cleanContext.newPage();
  await cleanPage.route('**/api/orders/test-order/edit', (route) => route.fulfill({ json: {
    biodata: { templateSlug: 'kumkum', docLocale: 'en', fullName: 'Example Person', profileType: 'bride', dob: '1990-01-01', phone: '+919876543210' },
    templateSlug: 'kumkum', pricePaise: 4900, editsUsed: 0, editLimit: 2
  } }));
  let cleanPrompts = 0;
  cleanPage.on('dialog', async (dialog) => { cleanPrompts++; await dialog.dismiss(); });
  await cleanPage.goto(`http://localhost:${port}/en/faq`);
  await cleanPage.goto(`http://localhost:${port}/en/orders/test-order/edit`);
  const cleanName = cleanPage.getByLabel('Full name');
  await cleanName.waitFor();
  const cleanLength = await cleanPage.evaluate(() => history.length);
  await cleanName.fill('Changed Name');
  await cleanPage.waitForFunction((n) => history.length > n, cleanLength);
  await cleanName.fill('Example Person');
  await cleanPage.evaluate(() => history.back());
  await cleanPage.waitForURL('**/en/faq');
  assert.equal(cleanPrompts, 0, 'clean Back passes without prompting');
  await cleanContext.close();
  const qualityContext = await browser.newContext();
  const qualityPage = await qualityContext.newPage();
  await qualityPage.addInitScript(() => {
    const decode = window.createImageBitmap.bind(window);
    window.createImageBitmap = (...args) => new Promise((resolve, reject) => {
      window.__releasePhoto = () => decode(...args).then(resolve, reject);
    });
    window.__testPops = 0;
    window.addEventListener('popstate', () => { window.__testPops++; }, true);
  });
  let patchPayload;
  let startPatch, releasePatch;
  const patchStarted = new Promise((resolve) => { startPatch = resolve; });
  const patchGate = new Promise((resolve) => { releasePatch = resolve; });
  await qualityPage.route('**/api/orders/test-order/edit', async (route) => {
    if (route.request().method() === 'PATCH') {
      patchPayload = route.request().postDataJSON(); startPatch();
      await patchGate;
      await route.fulfill({ status: 409, json: {} });
    } else await route.fulfill({ json: {
      biodata: { templateSlug: 'kumkum', docLocale: 'en', fullName: 'Example Person', profileType: 'bride', dob: '1990-01-01', phone: '+919876543210' },
      templateSlug: 'kumkum', pricePaise: 4900, editsUsed: 0, editLimit: 2
    } });
  });
  await qualityPage.goto(`http://localhost:${port}/en/faq`);
  await qualityPage.goto(`http://localhost:${port}/en/orders/test-order/edit`);
  await qualityPage.getByRole('button', { name: '3 Education and work' }).click();
  await qualityPage.getByRole('button', { name: 'Add another qualification' }).click();
  await qualityPage.getByLabel('Year').first().fill('2020');
  await qualityPage.getByRole('button', { name: 'Add another qualification' }).click();
  await qualityPage.getByLabel('Year').nth(1).fill('20');
  await qualityPage.getByRole('button', { name: '8 Photo' }).click();
  await qualityPage.getByRole('button', { name: 'Save changes' }).click();
  const year = qualityPage.getByLabel('Year').nth(1);
  await year.waitFor({ state: 'visible' });
  assert.equal(await year.getAttribute('aria-invalid'), 'true');
  assert.equal(await qualityPage.getByLabel('Year').first().getAttribute('aria-invalid'), null);
  const errorId = await year.getAttribute('aria-describedby');
  assert.ok(errorId);
  assert.match(await qualityPage.locator(`[id="${errorId}"]`).innerText(), /four-digit year/i);
  await year.fill('2020');
  await qualityPage.getByRole('button', { name: '8 Photo' }).click();
  const encodedImage = await qualityPage.evaluate(() => {
    const canvas = document.createElement('canvas'); canvas.width = 2; canvas.height = 2;
    return canvas.toDataURL('image/png').split(',')[1];
  });
  const image = Buffer.from(encodedImage, 'base64');
  await qualityPage.locator('input[type="file"]').setInputFiles({ name: 'photo.png', mimeType: 'image/png', buffer: image });
  await qualityPage.getByText('Preparing your photo…').waitFor();
  assert.equal(await qualityPage.getByRole('button', { name: 'Save changes' }).isDisabled(), true);
  assert.equal(patchPayload, undefined);
  await qualityPage.evaluate(() => window.__releasePhoto());
  await qualityPage.getByText('Preparing your photo…').waitFor({ state: 'hidden' });
  await qualityPage.getByRole('button', { name: 'Save changes' }).click();
  await patchStarted;
  assert.match(patchPayload.biodata.photo.src, /^data:image\/jpeg;base64,/);
  const qualityDialogs = [];
  qualityPage.on('dialog', async (dialog) => { qualityDialogs.push(dialog.message()); await dialog.dismiss(); });
  const qualityPops = await qualityPage.evaluate(() => window.__testPops);
  await qualityPage.evaluate(() => history.back());
  await qualityPage.waitForFunction((n) => window.__testPops >= n + 2, qualityPops);
  assert.deepEqual(qualityDialogs, [], 'Back during save must not ask to discard');
  await qualityPage.getByText('Save is in progress. Please stay here; leaving will not cancel the save.').waitFor();
  releasePatch();
  await qualityPage.getByText('This order changed or is no longer editable.', { exact: false }).waitFor();
  await qualityPage.locator('img[src^="data:image/jpeg"]').first().waitFor();
  await qualityPage.getByRole('button', { name: '3 Education and work' }).click();
  assert.equal(await qualityPage.getByLabel('Year').nth(1).inputValue(), '2020');
  await qualityContext.close();
  const noopContext = await browser.newContext();
  const noopPage = await noopContext.newPage();
  await noopPage.addInitScript(() => {
    window.__testPops = 0;
    window.addEventListener('popstate', () => { window.__testPops++; }, true);
  });
  let releaseNoop, startNoop;
  const noopGate = new Promise((resolve) => { releaseNoop = resolve; });
  const noopStarted = new Promise((resolve) => { startNoop = resolve; });
  await noopPage.route('**/api/orders/test-order/edit', async (route) => {
    if (route.request().method() === 'PATCH') {
      startNoop(); await noopGate; await route.fulfill({ status: 409, json: {} });
    } else await route.fulfill({ json: {
      biodata: { templateSlug: 'kumkum', docLocale: 'en', fullName: 'Example Person', profileType: 'bride', dob: '1990-01-01', phone: '+919876543210' },
      templateSlug: 'kumkum', pricePaise: 4900, editsUsed: 0, editLimit: 2
    } });
  });
  await noopPage.goto(`http://localhost:${port}/en/faq`);
  await noopPage.goto(`http://localhost:${port}/en/orders/test-order/edit`);
  await noopPage.getByRole('button', { name: '8 Photo' }).click();
  await noopPage.getByRole('button', { name: 'Save changes' }).click();
  await noopStarted;
  const noopDialogs = [];
  noopPage.on('dialog', async (dialog) => { noopDialogs.push(dialog.message()); await dialog.dismiss(); });
  const noopPops = await noopPage.evaluate(() => window.__testPops);
  await noopPage.evaluate(() => history.back());
  await noopPage.waitForFunction((n) => window.__testPops >= n + 2, noopPops);
  assert.deepEqual(noopDialogs, [], 'Back during an unchanged save must not navigate or ask to discard');
  await noopPage.getByText('Save is in progress. Please stay here; leaving will not cancel the save.').waitFor();
  releaseNoop();
  await noopPage.getByText('This order changed or is no longer editable.', { exact: false }).waitFor();
  await noopContext.close();
  for (const changed of [true, false]) {
    const successContext = await browser.newContext();
    const successPage = await successContext.newPage();
    let patchCount = 0, payload, releaseNavigation, navigationStarted;
    const navigationGate = new Promise((resolve) => { releaseNavigation = resolve; });
    const navigationStart = new Promise((resolve) => { navigationStarted = resolve; });
    await successPage.route('**/api/orders/test-order/edit', async (route) => {
      if (route.request().method() === 'PATCH') {
        patchCount++; payload = route.request().postDataJSON();
        await route.fulfill({ json: { biodata: payload.biodata, editsUsed: changed ? 1 : 0, editLimit: 2 } });
      } else await route.fulfill({ json: {
        biodata: { templateSlug: 'kumkum', docLocale: 'en', fullName: 'Example Person', profileType: 'bride', dob: '1990-01-01', phone: '+919876543210' },
        templateSlug: 'kumkum', pricePaise: 4900, editsUsed: 0, editLimit: 2
      } });
    });
    await successPage.route(/\/en\/orders\/test-order(?:\?.*)?$/, async (route) => {
      navigationStarted(); await navigationGate;
      await route.fulfill({ contentType: 'text/html', body: '<title>Order</title>' });
    });
    await successPage.goto(`http://localhost:${port}/en/orders/test-order/edit`);
    const successName = successPage.getByLabel('Full name');
    await successName.waitFor();
    if (changed) await successName.fill('Changed Name');
    await successPage.getByRole('button', { name: '8 Photo' }).click();
    await successPage.getByRole('button', { name: 'Save changes' }).click({ noWaitAfter: true });
    await successPage.getByText('Your order is up to date. Open your order to continue.').waitFor({ timeout: 6000 });
    const openOrder = successPage.getByRole('link', { name: 'Open your order' });
    assert.equal(await openOrder.getAttribute('href'), '/en/orders/test-order');
    assert.equal(await successPage.getByRole('button', { name: '8 Photo' }).isDisabled(), true);
    assert.equal(await successPage.locator('form').evaluate((form) => Boolean(form.closest('[inert]'))), true);
    assert.equal(patchCount, 1);
    assert.equal(payload.expectedRevision, 0);
    await openOrder.click({ noWaitAfter: true });
    await navigationStart;
    assert.equal(patchCount, 1, 'delayed navigation must not cause another PATCH');
    releaseNavigation();
    await successPage.waitForURL('**/en/orders/test-order');
    await successContext.close();
  }
  console.log('Chromium history scenario: passed');
} finally {
  await browser?.close();
  if (server.pid && process.platform === 'win32') execFileSync('taskkill', ['/pid', String(server.pid), '/t', '/f'], { stdio: 'ignore' });
  else server.kill();
  rmSync(tmp, { recursive: true, force: true });
}
