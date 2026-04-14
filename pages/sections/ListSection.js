import { expect } from '@playwright/test';

export class ListSection {
  constructor(page) {
    this.page = page;

    this.addListButton = page.locator('#addlist');
    this.inlineEditorInput = page.locator('#updatebox');
    this.addCategoryButton = page.locator('#adddivider');

  }


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


  async expectListVisible(name) {
    await expect(this.listName(name)).toBeVisible();
  }

  async expectListMissing(name) {
    await expect(this.listName(name)).toHaveCount(0);
  }
category(name) {
  return this.page.locator('#mycategories li', {
    hasText: name
  });
}
  async createCategory(name) {
  await this.addCategoryButton.click();
  await this.inlineEditorInput.fill(name);
  await this.inlineEditorInput.press('Enter');
}

async expectCategoryName(name) {
  await expect(this.category(name)).toBeVisible();
}

categoryContainer(name) {
  return this.category(name).locator('.categorycontainer');
}
async moveListToCategory(listName, categoryName) {
  const list = this.listRow(listName);
  const category = this.categoryContainer(categoryName);

  await list.dragTo(category);
}
async expectListInsideCategory(listName, categoryName) {
  const category = this.categoryContainer(categoryName);

  await expect(category.locator('li.normallist').filter({
      has: this.page.locator('.listname', {hasText: listName, exact: true }),
    })
  ).toHaveCount(1);
}

}