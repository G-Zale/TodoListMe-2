import { expect } from '@playwright/test';

export class ListSection {
  constructor(page) {
    this.page = page;

    this.addListButton = page.locator('#addlist');
    this.inlineEditorInput = page.locator('#updatebox');
  }

  // ===== LIST LOCATORS =====

  list(name) {
    return this.page.locator('span.listname', { hasText: name });
  }

  listRow(name) {
    return this.page.locator('#lists li.normallist').filter({
      has: this.page.locator('.listname', {
        hasText: name,
        exact: true
      }),
    });
  }

  listName(name) {
    return this.listRow(name).locator('.listname');
  }

  // ===== LIST ACTIONS =====

  async createList(name) {
    await this.addListButton.click();
    await this.inlineEditorInput.waitFor({ state: 'visible' });
    await this.inlineEditorInput.fill(name);
    await this.inlineEditorInput.press('Enter');
  }

  async renameList(oldName, newName) {
    const item = this.list(oldName);

    await item.dblclick();
    await this.inlineEditorInput.waitFor({ state: 'visible' });
    await this.inlineEditorInput.fill(newName);
    await this.inlineEditorInput.press('Enter');
  }

  async deleteList(name) {
    const item = this.listRow(name);

    await item.hover();
    await item.locator('.delete').click();
  }

  async openList(name) {
    await this.listName(name).click();
  }

  // ===== ASSERTIONS =====

  async expectListVisible(name) {
    await expect(this.listName(name)).toBeVisible();
  }

  async expectListMissing(name) {
    await expect(this.listName(name)).toHaveCount(0);
  }
}