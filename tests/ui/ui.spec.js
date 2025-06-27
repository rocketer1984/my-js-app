const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const mockTodos = [
  { id: 1, task: 'Clip bushes' },
  { id: 2, task: 'Tighten garage door' },
  { id: 3, task: 'Seal driveway' },
];

test.describe('To-Do List UI', () => {
  test.beforeEach(async ({ page }) => {
    // ✅ Route API requests before loading the page
    await page.route('**/api/todos', route => {
      if (route.request().method() === 'GET') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockTodos),
        });
      } else if (route.request().method() === 'POST') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ id: 4, task: 'Walk the dog' }),
        });
      }
    });

    await page.route('**/api/todos/*', route => {
      if (route.request().method() === 'DELETE') {
        route.fulfill({ status: 200 });
      }
    });

    // ✅ Now load index.html *after* mocks
    const filePath = path.resolve(__dirname, '../../index.html');
    const html = fs.readFileSync(filePath, 'utf-8');
    await page.setContent(html, { waitUntil: 'load' });
  });

  test('should preload initial tasks', async ({ page }) => {
    const items = page.locator('#todo-list li');
    await expect(items).toHaveCount(3);

    for (let i = 0; i < mockTodos.length; i++) {
      await expect(items.nth(i)).toHaveText(mockTodos[i].task);
    }
  });

  test('should add a new task', async ({ page }) => {
    await page.fill('#todo-input', 'Walk the dog');
    await page.click('button');

    const items = page.locator('#todo-list li');
    await expect(items).toHaveCount(4);
    await expect(items.last()).toHaveText('Walk the dog');
  });

  test('should show pointer cursor on hover and remove the task when clicked', async ({ page }) => {
    const items = page.locator('#todo-list li');
    await expect(items).toHaveCount(3);

    await items.nth(0).hover();
    const cursor = await items.nth(0).evaluate(el => {
      return window.getComputedStyle(el).cursor;
    });

    expect(cursor).toMatch(/pointer|url\([^)]*trashIcon\.png[^)]*\)/);

    await items.nth(0).click();
    await expect(items).toHaveCount(2);
  });
});
