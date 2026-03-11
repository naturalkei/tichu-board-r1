import { Stagehand } from '@browserbasehq/stagehand'
import { chromium } from 'playwright'

const baseUrl = process.env.STAGEHAND_BASE_URL ?? 'http://127.0.0.1:4173/tichu-board-r1/'

const stagehand = new Stagehand({
  env: 'LOCAL',
  disableAPI: true,
  disablePino: true,
  verbose: 0,
  localBrowserLaunchOptions: {
    executablePath: process.env.CHROME_PATH ?? chromium.executablePath(),
    args: process.env.CI ? ['--no-sandbox'] : undefined,
    headless: true,
    viewport: {
      width: 390,
      height: 844,
    },
  },
})

try {
  await stagehand.init()

  const page = stagehand.context.pages()[0]

  if (!page) {
    throw new Error('Stagehand did not create an initial page.')
  }

  await page.goto(baseUrl, { waitUntil: 'networkidle' })

  const heading = await page.locator('h1').innerText()

  if (!heading.toLowerCase().includes('tichu')) {
    throw new Error(`Unexpected heading: ${heading}`)
  }

  await page.locator('xpath=//button[contains(., "Start scoring") or contains(., "Continue game")]').click()

  await page.waitForSelector('[data-testid="seat-north"]')
  await page.evaluate(() => {
    const seat = document.querySelector('[data-testid="seat-north"]')
    if (!(seat instanceof HTMLElement)) {
      throw new Error('North seat button not found')
    }
    seat.click()
  })
  await page.waitForSelector('[data-testid="party-editor-dialog"]')
  await page.locator('[data-testid="party-editor-dialog"] input').fill('Stagehand')
  await page.locator('xpath=//button[contains(., "Apply changes")]').click()
  await page.waitForSelector('[data-testid="seat-north"] p')

  const updatedName = await page.locator('[data-testid="seat-north"] p').nth(0).innerText()

  if (!updatedName.includes('Stagehand')) {
    throw new Error(`Player rename did not stick: ${updatedName}`)
  }

  await page.locator('xpath=//button[normalize-space()="Round"]').click()
  await page.waitForSelector('[data-testid="page-round"]')
  await page.locator('xpath=//button[contains(., "Start first round") or contains(., "Start next round")]').click()
  await page.locator('[data-testid="card-points-north-south"]').fill('60')
  await page.locator('[data-testid="card-points-east-west"]').fill('40')
  await page.locator('[data-testid="first-out-player-1"]').click()
  await page.evaluate(() => {
    const saveButton = document.querySelector('[data-testid="save-round"]')
    if (!(saveButton instanceof HTMLElement)) {
      throw new Error('Save round button not found')
    }
    saveButton.click()
  })
  await page.waitForSelector('[data-testid="global-score-summary"]')

  await page.locator('xpath=//button[normalize-space()="Results"]').click()
  await page.waitForSelector('[data-testid="team-total-north-south"]')

  const northSouthTotal = await page.locator('[data-testid="team-total-north-south"]').innerText()

  if (!northSouthTotal.includes('60')) {
    throw new Error(`Expected north-south total to include 60, got: ${northSouthTotal}`)
  }
} finally {
  await stagehand.close()
}
