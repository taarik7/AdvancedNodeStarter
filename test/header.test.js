const debug = require('debug')('test:header');
const Page = require('./helpers/page');

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.setExtraHTTPHeaders({
    'X-Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; options eval-script",
    'X-WebKit-CSP': "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline'",
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline'"
  });
  // await page.setBypassCSP(true);
  await page.goto('http://localhost:3000');
});

afterEach(async () => {
  await page.close();
});

test('The header has the correct text', async () => {
  debug('[ Running Test 1 ]');

  // const text = await page.evaluate(() => document.querySelector('a.brand-logo').textContent);
  // const text = await page.getContentsOf('a.brand-logo');
  const xpath = "//*[@id=\"root\"]/div/div/nav/div/a";
  const element = await page.$x(xpath);
  let text = await page.evaluate(elem => elem.textContent, element[0]);
  debug('[ - text: %s ]', text);

  expect(text).toEqual('Blogster');
});

test('Clicking login starts oauth flow', async () => {
  debug('[ Running Test 2 ]');

  await page.click('.right a');

  const url = await page.url();
  debug('[ - url: %s ]', url.substring(0,50));

  expect(url).toMatch(/accounts\.google\.com/);
});

test('When signed in, shows logout button', async () => {
  debug('[ Running Test 3 ]');
  await page.login();

  // const text = await page.evaluate(() => document.querySelector('a[href="/auth/logout"]').textContent);

  // const text = await page.getContentsOf('a[href="/auth/logout"]');
  const xpath = "//*[@id=\"root\"]/div/div/nav/div/ul/li[2]/a";
  const element = await page.$x(xpath);
  let text = await page.evaluate(elem => elem.textContent, element[0]);
  debug('[ - text: %s ]', text);

  expect(text).toEqual('Logout');
});