

export class BasePage {
  constructor(page, path = '') {
    this.page = page;
    this.path = path;
  }

  async open() {
    await this.page.goto(`https://todolistme.net${this.path}`);
    // await this.page.goto(`https://todolistme.net`);
  }
}