import { test, expect } from '@playwright/test';

test.describe('Instagram Stories Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display story thumbnails in horizontal list', async ({ page }) => {
    // Wait for stories to load
    await page.waitForSelector('.story-list');
    
    // Check if story thumbnails are visible
    const thumbnails = page.locator('.story-thumbnail');
    await expect(thumbnails).toHaveCount(6);
    
    // Check if thumbnails have gradient borders (unviewed stories)
    const gradientBorders = page.locator('.story-gradient');
    await expect(gradientBorders.first()).toBeVisible();
  });

  test('should open story viewer when thumbnail is clicked', async ({ page }) => {
    // Wait for stories to load
    await page.waitForSelector('.story-list');
    
    // Click on first story thumbnail
    await page.locator('.story-thumbnail').first().click();
    
    // Check if story viewer opens
    await expect(page.locator('#story-viewer')).toBeVisible();
    
    // Check if progress bars are visible
    await expect(page.locator('.progress-bar')).toHaveCount(6);
    
    // Check if story header is visible
    await expect(page.locator('text=sarah_m')).toBeVisible();
  });

  test('should navigate to next story when right side is tapped', async ({ page }) => {
    // Open story viewer
    await page.waitForSelector('.story-list');
    await page.locator('.story-thumbnail').first().click();
    await page.waitForSelector('#story-viewer');
    
    // Get the navigation area and click right side
    const rightNav = page.locator('.absolute.inset-0.flex > div').nth(1);
    await rightNav.click();
    
    // Check if story changed (username should change)
    await expect(page.locator('text=alex_k')).toBeVisible();
  });

  test('should navigate to previous story when left side is tapped', async ({ page }) => {
    // Open story viewer at second story
    await page.waitForSelector('.story-list');
    await page.locator('.story-thumbnail').nth(1).click();
    await page.waitForSelector('#story-viewer');
    
    // Get the navigation area and click left side
    const leftNav = page.locator('.absolute.inset-0.flex > div').first();
    await leftNav.click();
    
    // Check if story changed to previous one
    await expect(page.locator('text=sarah_m')).toBeVisible();
  });

  test('should close story viewer when X button is clicked', async ({ page }) => {
    // Open story viewer
    await page.waitForSelector('.story-list');
    await page.locator('.story-thumbnail').first().click();
    await page.waitForSelector('#story-viewer');
    
    // Click close button
    await page.locator('button:has(svg)').click();
    
    // Check if story viewer is closed
    await expect(page.locator('#story-viewer')).not.toBeVisible();
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Open story viewer
    await page.waitForSelector('.story-list');
    await page.locator('.story-thumbnail').first().click();
    await page.waitForSelector('#story-viewer');
    
    // Test right arrow key
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('text=alex_k')).toBeVisible();
    
    // Test left arrow key
    await page.keyboard.press('ArrowLeft');
    await expect(page.locator('text=sarah_m')).toBeVisible();
    
    // Test escape key
    await page.keyboard.press('Escape');
    await expect(page.locator('#story-viewer')).not.toBeVisible();
  });

  test('should auto-advance stories after timeout', async ({ page }) => {
    // Open story viewer
    await page.waitForSelector('.story-list');
    await page.locator('.story-thumbnail').first().click();
    await page.waitForSelector('#story-viewer');
    
    // Wait for story to auto-advance (5 seconds + buffer)
    await page.waitForTimeout(5500);
    
    // Check if story advanced to next one
    await expect(page.locator('text=alex_k')).toBeVisible();
  });

  test('should show loading states', async ({ page }) => {
    // Check initial loading skeleton
    await page.goto('/');
    
    // Should show loading spinner while stories load
    const loadingSpinner = page.locator('.animate-pulse');
    await expect(loadingSpinner.first()).toBeVisible();
  });

  test('should mark stories as viewed', async ({ page }) => {
    // Open and view first story
    await page.waitForSelector('.story-list');
    await page.locator('.story-thumbnail').first().click();
    await page.waitForSelector('#story-viewer');
    
    // Close story viewer
    await page.keyboard.press('Escape');
    
    // Check if story thumbnail shows viewed state (gray border)
    const viewedStory = page.locator('.story-viewed').first();
    await expect(viewedStory).toBeVisible();
  });

  test('should be responsive for mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check if layout is mobile-optimized
    await page.waitForSelector('.story-list');
    
    // Story list should be horizontally scrollable
    const storyList = page.locator('.story-list');
    await expect(storyList).toHaveCSS('overflow-x', 'auto');
    
    // Story viewer should be full screen
    await page.locator('.story-thumbnail').first().click();
    const storyViewer = page.locator('#story-viewer');
    await expect(storyViewer).toHaveCSS('position', 'fixed');
  });
});
