const { chromium } = require('playwright');
const path = require('path');

async function captureOGImage() {
  console.log('🚀 Starting OG image capture...');
  
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1200, height: 630 }
  });
  
  const page = await context.newPage();
  
  try {
    // Update this URL based on your dev server or deployed site
    const url = 'http://localhost:5174/auth-illustration/';
    console.log(`📸 Navigating to ${url}...`);
    
    await page.goto(url, { waitUntil: 'networkidle' });
    
    // Wait for the slide to load
    await page.waitForTimeout(2000);
    
    // Optional: Start the flow to make it more visually interesting
    const startButton = await page.locator('button:has-text("Start OAuth Flow")');
    if (await startButton.isVisible()) {
      await startButton.click();
      await page.waitForTimeout(500);
    }
    
    // Take screenshot
    const outputPath = path.join(__dirname, '..', 'public', 'og-image.png');
    await page.screenshot({
      path: outputPath,
      fullPage: false
    });
    
    console.log(`✅ Screenshot saved to: ${outputPath}`);
    console.log('📱 Dimensions: 1200x630 (optimized for social media)');
    
  } catch (error) {
    console.error('❌ Error capturing screenshot:', error);
  } finally {
    await browser.close();
  }
}

captureOGImage();
