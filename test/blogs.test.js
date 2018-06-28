const debug = require('debug')('test:blogs');
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

describe('When logged in', async () => {
  beforeEach(async() => {
    await page.login();
    await page.click('a.btn-floating');
  });

  test('Can see blog create form', async () => {
    debug('[ Running Test 1 ]');
    const label = await page.getContentsOf('form label');
    debug({ label });
    expect(label).toEqual('Blog Title');
  });

  describe('And using valid inputs', async () => {
    beforeEach(async () => {
      await page.type('.title input', 'My Title');
      await page.type('.content input', 'My Content');
      await page.click('form button');
    });

    test('Submitting takes user to review screen', async () => {
      debug('[ submitting takes user to review screen ]');

      const text = await page.getContentsOf('h5');
      debug({ text });
      expect(text).toEqual('Please confirm your entries');
    });

    test('Submitting then saving adds blog to index page', async () => {
      debug('[ submitting then saving adds blog to index page ]');
      await page.click('button.green');
      await page.waitFor('.card', { timeout: 5000 });

      const title = await page.getContentsOf('.card-title');
      const content = await page.getContentsOf('p');
      debug({ title, content });

      expect(title).toEqual('My Title');
      expect(content).toEqual('My Content');
    });
  });

  describe('And using invalid inputs', async () => {
    beforeEach(async() => {
      await page.click('form button');
    });

    test('The form shows an error message', async () => {
      debug('[ And using invalid inputs ]');

      const titleError = await page.getContentsOf('.title .red-text');
      const contentError = await page.getContentsOf('.content .red-text');
      debug({ titleError, contentError });

      expect(titleError).toEqual('You must provide a value');
      expect(contentError).toEqual('You must provide a value');
    });
  });
});

describe('User is not logged in ', async () => {
  const actions = [
    {
      method: 'get',
      path: '/api/blogs'
    },
    {
      method: 'post',
      path: '/api/blogs',
      data: {
        title: 'My Title',
        content: 'My Content'
      }
    }
  ];

  test('Blog related actions are prohibited', async () => {
    const results = await page.execRequests(actions);

    for (let result of results) {
      expect(result).toEqual({ error: 'You must log in!'});
    }

  });

});