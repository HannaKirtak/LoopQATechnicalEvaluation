const { test, expect } = require('@playwright/test');

// Test data as JSON object
const testData = [
    {
        taskName: "Implement user authentication",
        columnName: "To Do",
        tags: ["Feature", "High Priority"],
        section: "Web Application",
    },
    {
        taskName: "Fix navigation bug",
        columnName: "To Do",
        tags: ["Bug"],
        section: "Web Application",
    },
    {
        taskName: "Design system updates",
        columnName: "In Progress",
        tags: ["Design"],
        section: "Web Application",
    }
]

// Common precondition: Login to the app
test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    // Login with credentials
    await page.fill('input[id="username"]', 'admin');
    await page.fill('input[id="password"]', 'password123');
    await page.click('button[type="submit"]');
});

// Test cases based on JSON data
testData.forEach(({ taskName, columnName, tags, section }) => {
    test(`Verify task "${taskName}" in ${section}`, async ({ page }) => {

        //Navigate to the Web Application section
        await page.click(`h2:has-text("${section}")`);

        // Locate the column 
        const column = await page.locator(`h2:has-text("${columnName}")`).locator('..');
        await expect(column).toBeVisible();

        // Verify the task is in the correct column
        const task = await column.locator(`h3:has-text("${taskName}")`).locator('..')
        await expect(task).toBeVisible();

        // Verify tags 
        for (const tag of tags) {
            const tagLocator = await task.locator(`span:has-text("${tag}")`);
            await expect(tagLocator).toBeVisible();
        }
    });
});
