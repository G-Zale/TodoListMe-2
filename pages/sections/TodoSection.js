import { expect } from '@playwright/test';

export class TodoSection {
  constructor(page) {
    this.page = page;

    // Containers
    this.todosContainer = page.locator('#mytodos');
    this.doneContainer = page.locator('#mydonetodos');
    this.tomorrowPanel = page.locator('#tomorrowitemspanel');

    // Inputs
    this.newTodoInput = page.locator('#newtodo');
    this.inlineEditorInput = page.locator('#updatebox');

    // Buttons
    this.purgeDoneButton = page.locator('a.purge');
    this.normalSortButton = page.locator('#sort0');
    this.alphabeticalSortButton = page.locator('#sort1');
    this.randomSortButton = page.locator('#sort2');
    this.sortButton = page.locator('#sortbutton');

    // Collections
    this.todoItems = page.locator('#mytodos li');
    this.doneItems = page.locator('#mydonetodos li');

    // Status indicators
    this.tomorrowCount = page.locator('#tomorrow_number');
    this.doneEmptyState = page.locator('#doneitemspanel .notodos');
  }

  // ━━━━━━━ HELPERS ━━━━━━━

  firstTodoItem() {
    return this.todoItems.first();
  }

  firstTodoText() {
    return this.firstTodoItem().locator('span');
  }

  todoItem(text) {
    return this.todosContainer.locator('li', { hasText: text });
  }

  doneItem(text) {
    return this.doneContainer.locator('li', { hasText: text });
  }

  todoByText(text) {
    return this.todosContainer.locator('li', { hasText: new RegExp(`^${text}$`) });
  }

  todosByText(text) {
    return this.todosContainer.locator('li').filter({
      has: this.page.locator(`text="${text}"`)
    });
  }

  // ━━━━━━━ ACTIONS ━━━━━━━

  async addTodo(text) {
    await this.newTodoInput.fill(text);
    await this.newTodoInput.press('Enter');
  }

  async editFirstTodo(newText) {
    await this.firstTodoText().dblclick();
    await this.inlineEditorInput.fill(newText);
    await this.inlineEditorInput.press('Enter');
  }

  async startEditingFirstTodo() {
    await this.firstTodoText().dblclick();
  }

  async changeInlineEditorValue(value) {
    await this.inlineEditorInput.fill(value);
  }

  async cancelInlineEdit() {
    await this.page.getByRole('button', { name: 'Cancel' }).click();
  }

  async removeFirstTodo() {
    await this.firstTodoItem().hover();
    await this.firstTodoItem().locator('.delete').click();
  }

  async completeTodo(text) {
    await this.todoItem(text).locator('input[type="checkbox"]').click({ force: true });
  }

  async uncompleteTodo(text) {
    await this.doneItem(text).locator('input[type="checkbox"]').click({ force: true });
  }

  async purgeDoneItems() {
    await this.purgeDoneButton.click();
  }

  async moveTodoToTomorrow(text) {
    await this.page.evaluate((todoText) => {
      const item = Array.from(document.querySelectorAll('#mytodos li')).find((node) =>
        node.innerText.includes(todoText)
      );

      tomorrow_todo(null, { draggable: $(item) });
    }, text);
  }

  async sortAlphabetically() {
    await this.alphabeticalSortButton.click();
  }

  async sortRandomly() {
    await this.randomSortButton.click();
  }

  async sortNormally() {
    await this.normalSortButton.click();
  }

  async getTodoTexts() {
    return this.todoItems.locator('span').allInnerTexts();
  }

  async getSortButtonTitle() {
    return this.sortButton.getAttribute('title');
  }

  async moveTodoToList(todoText, targetListLocator) {
    const todo = this.todoByText(todoText);
    await todo.dragTo(targetListLocator);
  }

  // ━━━━━━━ ASSERTIONS ━━━━━━━

  async expectFirstTodoToBe(text) {
    await expect(this.todoItems.first()).toContainText(text);
  }

  async expectTodoVisible(text) {
    await expect(this.todoByText(text).first()).toBeVisible();
  }

  async expectTodoMissing(text) {
    await expect(this.todoItem(text)).toHaveCount(0);
  }

  async expectTodoCount(text, count) {
    await expect(this.todosByText(text)).toHaveCount(count);
  }

  async expectDoneVisible(text) {
    await expect(this.doneItem(text)).toBeVisible();
  }

  async expectDoneMissing(text) {
    await expect(this.doneItem(text)).toHaveCount(0);
  }

  async expectNoDoneItems() {
    await expect(this.doneItems).toHaveCount(0);
    await expect(this.doneEmptyState).toContainText('No done items.');
  }

  async expectTomorrowContains(text) {
    await expect(this.tomorrowCount).toContainText('1');
    await expect(this.tomorrowPanel).toContainText(text);
  }
}