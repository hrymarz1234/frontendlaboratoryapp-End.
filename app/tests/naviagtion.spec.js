const { test, expect } = require('@playwright/test');

test('has link do login page', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  

  await page.click("text=Zaloguj się");
  

  await expect(page).toHaveURL('http://localhost:3000/users/login');  
  

  await expect(page.locator('h1')).toContainText('Zaloguj się do aplikacji');
});