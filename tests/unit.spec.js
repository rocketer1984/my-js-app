const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Unit tests for script.js functions', () => {
  test.beforeEach(async ({ page }) => {
    // Load the index.html to get the DOM and your script loaded
    const filePath = path.resolve(__dirname, '../index.html');
    const fileUrl = 'file://' + filePath.replace(/\\/g, '/');
    await page.goto(fileUrl);
  });

  test('preloadTodos should add initial tasks to the list', async ({ page }) => {
    // Wait for the page to load and initial tasks to be added
    const items = page.locator('#todo-list li');
    await expect(items).toHaveCount(3);

    await expect(items.nth(0)).toHaveText('Clean the yard');
    await expect(items.nth(1)).toHaveText('Go swim');
    await expect(items.nth(2)).toHaveText('Mom');
  });

  test('addTodoItem should add a single task to the list', async ({ page }) => {
    // Call addTodoItem in the page context to add a task
    await page.evaluate(() => addTodoItem('Test Task'));

    const lastItem = page.locator('#todo-list li').last();
    await expect(lastItem).toHaveText('Test Task');
  });

  test('addTodo should add task from input field and clear it', async ({ page }) => {
    // Fill the input box
    await page.fill('#todo-input', 'New Task');

    // Call addTodo function inside the page
    await page.evaluate(() => addTodo());

    // Check the new task is added
    const lastItem = page.locator('#todo-list li').last();
    await expect(lastItem).toContainText('New Task');

    // Input should be cleared
    const inputValue = await page.$eval('#todo-input', el => el.value);
    expect(inputValue).toBe('');
  });

  test('addTodo should NOT add empty or whitespace-only tasks', async ({ page }) => {
    // Set input to empty string
    await page.fill('#todo-input', '');
    await page.evaluate(() => addTodo());
    
    // Set input to whitespace string
    await page.fill('#todo-input', '    ');
    await page.evaluate(() => addTodo());

    const items = page.locator('#todo-list li');
    // Should still have only the 3 initial tasks
    await expect(items).toHaveCount(3);
  });
});
