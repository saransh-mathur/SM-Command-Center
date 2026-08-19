import { test, expect } from '@playwright/test';

test.describe('SM Command Center - UI Walkthrough & Alignment', () => {

  test('Cockpit (Dashboard) - Functionality & Alignment', async ({ page }) => {
    await page.goto('/');
    
    // Verify the main layout and cockpit render properly
    await expect(page.locator('text=SM Command Center').first()).toBeVisible();
    
    // Wait for the UI to settle (animations, layout)
    await page.waitForTimeout(1000);
    
    // Visual Regression Test: Ensures components are aligned to design
    // The first time this runs, it saves a baseline image. Future runs will compare against it.
    await expect(page).toHaveScreenshot('cockpit-alignment.png', { fullPage: true, maxDiffPixelRatio: 0.1 });
  });

  test('MBA Study Tab - Flow & Functionality', async ({ page }) => {
    await page.goto('/mba-study');
    
    await page.waitForSelector('main'); 
    
    // Wait for animations
    await page.waitForTimeout(1000);
    
    // Take visual snapshot of MBA Study view
    await expect(page).toHaveScreenshot('mba-study-alignment.png', { fullPage: true, maxDiffPixelRatio: 0.1 });
  });

  test('Course Lab Tab - Flow & Functionality', async ({ page }) => {
    await page.goto('/course-lab');
    
    // Wait for the main elements of the Course Lab to load
    await page.waitForSelector('main');
    
    // Wait for animations
    await page.waitForTimeout(1000);
    
    // Check alignment
    await expect(page).toHaveScreenshot('course-lab-alignment.png', { fullPage: true, maxDiffPixelRatio: 0.1 });
  });

  test('Career Tab - Placeholder Flow', async ({ page }) => {
    await page.goto('/career');
    
    // Verify the coming soon text exists
    await expect(page.locator('text=Career Dashboard coming soon')).toBeVisible();
    
    await page.waitForTimeout(500);
    
    // Check alignment
    await expect(page).toHaveScreenshot('career-tab-alignment.png', { fullPage: true, maxDiffPixelRatio: 0.1 });
  });

});
