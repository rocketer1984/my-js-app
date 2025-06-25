const { test, expect } = require('@playwright/test');
const path = require('path');

// Group all tests related to the To-Do UI
test.describe('To-Do List UI', () => {

  // Before each test, load the index.html page directly using the file:// protocol
  test.beforeEach(async ({ page }) => {
    const filePath = path.resolve(__dirname, '../index.html');
    const fileUrl = 'file://' + filePath.replace(/\\/g, '/'); // Handle Windows backslashes
    await page.goto(fileUrl);
  });

  // ✅ Test 1: Check that the initial tasks are loaded into the list
  test('should preload initial tasks', async ({ page }) => {
    const items = page.locator('#todo-list li');

    // Expect exactly 3 tasks to be preloaded
    await expect(items).toHaveCount(3);

    // Check the exact text of each item
    await expect(items.nth(0)).toHaveText('Clean the yard');
    await expect(items.nth(1)).toHaveText('Go swim');
    await expect(items.nth(2)).toHaveText('Call Mom');
  });

  // ✅ Test 2: Add a new task to the list
  test('should add a new task', async ({ page }) => {
    // Fill the input with a new task
    await page.fill('#todo-input', 'Walk the dog');

    // Click the "Add" button
    await page.click('button');

    const items = page.locator('#todo-list li');

    // Expect 4 items now (3 preloaded + 1 new)
    await expect(items).toHaveCount(4);

    // The new task should be the last one
    await expect(items.last()).toHaveText('Walk the dog');
  });

  // ✅ Test 3: Remove a task and check cursor style on hover
  test('should show pointer cursor on hover and remove the task when clicked', async ({ page }) => {
    const items = page.locator('#todo-list li');

    // Ensure 3 items initially
    await expect(items).toHaveCount(3);

    // Hover over the first item
    await items.nth(0).hover();

    // Evaluate the computed cursor style
    const cursor = await items.nth(0).evaluate((el) => {
      return window.getComputedStyle(el).cursor;
    });

    // Verify that the cursor is 'pointer'
    // expect(cursor).toBe('url(\"file:///C:/Projects/jsApp/resources/trashIcon.png\"), pointer');
    expect(cursor).toMatch(/url\([^)]*trashIcon\.png[^)]*\)|pointer/);


    // Click the item to remove it
    await items.nth(0).click();

    // Confirm it's removed (2 items left)
    await expect(items).toHaveCount(2);
  });

});
