import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage.js';

test.describe('TodoSection', () => {
  test('edits an existing todo item', async ({ page }) => {
    const app = new HomePage(page);
    await app.open();

    await app.todoSection.editFirstTodo('Edited first task');
    await app.todoSection.expectFirstTodoToBe('Edited first task');
  });

  test('cancels todo editing', async ({ page }) => {
    const app = new HomePage(page);
    await app.open();
    const originalText = "Howdy. Let's get you up and running.";

    await app.todoSection.startEditingFirstTodo();
    await app.todoSection.changeInlineEditorValue('Changed but canceled');
    await app.todoSection.cancelInlineEdit();
    await app.todoSection.expectFirstTodoToBe(originalText);
  });

  test('removes a todo item', async ({ page }) => {
    const app = new HomePage(page);
    await app.open();
    const removedText = "Howdy. Let's get you up and running.";

    await app.todoSection.removeFirstTodo();
    await app.todoSection.expectTodoMissing(removedText);
  });

  test('completes and uncompletes a todo item', async ({ page }) => {
    const app = new HomePage(page);
    await app.open();

    await app.todoSection.addTodo('Finish me');
    await app.todoSection.completeTodo('Finish me');
    await app.todoSection.expectDoneVisible('Finish me');

    await app.todoSection.uncompleteTodo('Finish me');
    await app.todoSection.expectTodoVisible('Finish me');
    await app.todoSection.expectDoneMissing('Finish me');
  });

  test('moves a todo item to tomorrow', async ({ page }) => {
    const app = new HomePage(page);
    await app.open();

    await app.todoSection.addTodo('Tomorrow task');
    await app.todoSection.moveTodoToTomorrow('Tomorrow task');

    await app.todoSection.expectTodoMissing('Tomorrow task');
    await app.todoSection.expectTomorrowContains('Tomorrow task');
  });

  test('removes completed items', async ({ page }) => {
    const app = new HomePage(page);
    await app.open();

    await app.todoSection.addTodo('Completed task one');
    await app.todoSection.addTodo('Completed task two');

    await app.todoSection.completeTodo('Completed task one');
    await app.todoSection.completeTodo('Completed task two');

    await app.todoSection.expectDoneVisible('Completed task one');
    await app.todoSection.expectDoneVisible('Completed task two');

    await app.todoSection.purgeDoneItems();
    await app.todoSection.expectNoDoneItems();
  });

  test('sorts todo items alphabetically', async ({ page }) => {
    const app = new HomePage(page);
    await app.open();

    await app.todoSection.addTodo('Zulu task');
    await app.todoSection.addTodo('Aalpha task');
    await app.todoSection.sortAlphabetically();

    const items = await app.todoSection.getTodoTexts();
    expect(items.indexOf('Aalpha task')).toBeGreaterThanOrEqual(0);
    expect(items.indexOf('Zulu task')).toBeGreaterThanOrEqual(0);
    expect(items.indexOf('Aalpha task')).toBeLessThan(items.indexOf('Zulu task'));
  });

  test('sorts todo items randomly', async ({ page }) => {
    const app = new HomePage(page);
    await app.open();

    await app.todoSection.addTodo('Zulu task');
    await app.todoSection.addTodo('Alpha task');
    await app.todoSection.addTodo('Bravo task');

    const before = await app.todoSection.getTodoTexts();
    await app.todoSection.sortRandomly();
    const after = await app.todoSection.getTodoTexts();
    const sortTitle = await app.todoSection.getSortButtonTitle();

    expect(after).not.toEqual(before);
    expect(sortTitle).toBe('Sorting items randomly');
  });

  test('sorts to normal after another sort mode', async ({ page }) => {
    const app = new HomePage(page);
    await app.open();

    await app.todoSection.addTodo('Zulu task');
    await app.todoSection.addTodo('Alpha task');
    await app.todoSection.addTodo('Bravo task');

    const initialOrder = await app.todoSection.getTodoTexts();

    await app.todoSection.sortRandomly();
    await app.todoSection.sortNormally();

    const restoredOrder = await app.todoSection.getTodoTexts();
    const sortTitle = await app.todoSection.getSortButtonTitle();

    expect(restoredOrder).toEqual(initialOrder);
    expect(sortTitle).toBe('Sorting items normally');
  });



  test('persists todos after reload', async ({ page }) => {
    const app = new HomePage(page);
    await app.open();

    await app.todoSection.addTodo('Persistent task');

    await page.reload();

    await app.todoSection.expectTodoVisible('Persistent task');
  });

  test('allows duplicate todo names', async ({ page }) => {
    const app = new HomePage(page);
    await app.open();

    await app.todoSection.addTodo('Same');
    await app.todoSection.expectAtLeastOneTodoVisible('Same');

    await app.todoSection.addTodo('Same');

    await app.todoSection.expectTodoCount('Same', 2);
  });
});

test.describe('ListSection', () => {
  test('creates, renames, and deletes a list', async ({ page }) => {
    const app = new HomePage(page);
    await app.open();

    await app.listManager.createList('QA List');
    await app.listManager.expectListVisible('QA List');

    await app.listManager.renameList('QA List', 'Renamed QA List');
    await app.listManager.expectListVisible('Renamed QA List');

    await app.listManager.deleteList('Renamed QA List');
    await app.listManager.expectListMissing('Renamed QA List');
  });

  test('moves todo to another list', async ({ page }) => {
    const app = new HomePage(page);
    await app.open();

    await app.listManager.createList('List A');
    await app.listManager.createList('List B');

    await app.listManager.openList('List B');
    await app.todoSection.addTodo('Alpha task');

    const listA = app.listManager.listRow('List A');
    await app.todoSection.moveTodoToList('Alpha task', listA);

    await app.listManager.openList('List A');
    await app.todoSection.expectTodoVisible('Alpha task');
  });

    test('user workflow scenario', async ({ page }) => {
    const app = new HomePage(page);
    await app.open();

    await app.listManager.createList('Work');
    await app.listManager.openList('Work');

    await app.todoSection.addTodo('Alpha task');
    await app.todoSection.addTodo('Bravo task');

    await app.todoSection.completeTodo('Alpha task');
    await app.todoSection.moveTodoToTomorrow('Bravo task');

    await app.todoSection.expectDoneVisible('Alpha task');
    await app.todoSection.expectTomorrowContains('Bravo task');
  });
  
});
