const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');

class CustomPage {
  static async build() {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-web-security']
    });

    const page = await browser.newPage();
    const customPage = new CustomPage(page);

    return new Proxy(customPage, {
      get: function(target, property) {
        return customPage[property] || browser[property] || page[property];
      }
    })
  }

  constructor(page) {
    this.page = page;
  }

  async login() {
    const user = await userFactory();
    const { session, sig } = sessionFactory(user);
  
    await this.page.setCookie({ name: 'session', value: session});
    await this.page.setCookie({ name: 'session.sig', value: sig});
    await this.page.goto('http://localhost:3000/blogs');
    await this.page.waitFor('a[href="/auth/logout"]', { timeout: 5000 }); 
    
  }

  async getContentsOf(selector) {
    let elem = await this.page.$x('//' + selector);

    let innards = await this.page.evaluate(selector => b2.textContent, elem[0]);
    debug('innards %s', innards);

    return innards;

    return this.page.evaluate((bo_selectah) => document.querySelector(bo_selectah).textContent);

    // return this.page.$eval(selector, el => el.innerHTML);
  }

  get(path) {

    return this.page.evaluate((_path) => {
        return fetch(_path, { // path would normally be included in closure scope
          method: 'GET',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(res => res.json());
      }, path);

  }

  post(path, data) {

    return this.page.evaluate((_path, _data) => {
        
        return fetch(_path, {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(_data)
        }).then(res => res.json());
      }, path, data);
  }

  execRequests(actions) {
    return Promise.all(
        actions.map(({ method, path, data }) => {
        return this[method](path, data);
      })
    );
  }

}

module.exports = CustomPage;