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

  const frame = page.mainFrame()
  const heading = await frame.locator('h1').innerText()

  if (!heading.toLowerCase().includes('tichu')) {
    throw new Error(`Unexpected heading: ${heading}`)
  }

  await frame.locator('[data-testid="player-name-player-1"]').fill('Stagehand')

  const updatedName = await frame.locator('[data-testid="player-name-player-1"]').inputValue()

  if (updatedName !== 'Stagehand') {
    throw new Error(`Player rename did not stick: ${updatedName}`)
  }

  await frame.locator('[data-testid="card-points-north-south"]').fill('60')
  await frame.locator('[data-testid="card-points-east-west"]').fill('40')
  await frame.locator('[data-testid="first-out-player-1"]').click()
  await frame.locator('[data-testid="save-round"]').click()

  const northSouthTotal = await frame.locator('[data-testid="team-total-north-south"]').innerText()

  if (!northSouthTotal.includes('60')) {
    throw new Error(`Expected north-south total to include 60, got: ${northSouthTotal}`)
  }
} finally {
  await stagehand.close()
}
