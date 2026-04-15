import { expect } from '@playwright/test';

export class ListSection {
  constructor(page) {
    this.page = page;

    // Containers
    this.listsContainer = page.locator('#lists');
    this.categoriesContainer = page.locator('#mycategories');

    // Buttons
    this.addListButton = page.locator('#addlist');
    this.addCategoryButton = page.locator('#adddivider');

    // Inputs
    this.inlineEditorInput = page.locator('#updatebox');
  }

  // ━━━━━━━ HELPERS ━━━━━━━

  list(name) {
    return this.page.locator('span.listname', { hasText: name });
  }

  listRow(name) {
    return this.listsContainer.locator('li.normallist').filter({
      has: this.page.locator('.listname', {
        hasText: name,
        exact: true
      }),
    });
  }

  listName(name) {
    return this.listRow(name).locator('.listname');
  }

  category(name) {
    return this.categoriesContainer.locator('li', { hasText: name });
  }

  categoryContainer(name) {
    return this.category(name).locator('.categorycontainer');
  }

  // ━━━━━━━ ACTIONS ━━━━━━━

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

  async createCategory(name) {
    await this.addCategoryButton.click();
    await this.inlineEditorInput.fill(name);
    await this.inlineEditorInput.press('Enter');
  }

  async moveListToCategory(listName, categoryName) {
    const list = this.listRow(listName);
    const category = this.categoryContainer(categoryName);

    await list.dragTo(category);
  }

  // ━━━━━━━ ASSERTIONS ━━━━━━━

  async expectListVisible(name) {
    await expect(this.listName(name)).toBeVisible();
  }

  async expectListMissing(name) {
    await expect(this.listName(name)).toHaveCount(0);
  }

  async expectCategoryName(name) {
    await expect(this.category(name)).toBeVisible();
  }

  async expectListInsideCategory(listName, categoryName) {
    const category = this.categoryContainer(categoryName);

    await expect(category.locator('li.normallist').filter({
      has: this.page.locator('.listname', { hasText: listName, exact: true }),
    })).toHaveCount(1);
  }
}