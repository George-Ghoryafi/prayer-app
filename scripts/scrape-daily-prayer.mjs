#!/usr/bin/env node
/**
 * Scrapes the daily prayer from plough.com using Puppeteer.
 * Writes result to public/daily-prayer.json.
 */
import puppeteer from 'puppeteer'
import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const URL = 'https://www.plough.com/en/subscriptions/daily-prayer'
const OUT = resolve(__dirname, '..', 'public', 'daily-prayer.json')

async function scrape() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    const page = await browser.newPage()
    await page.goto(URL, { waitUntil: 'networkidle2', timeout: 30_000 })

    // Wait for JS-rendered content
    await page.waitForSelector('.post-content', { timeout: 15_000 })

    const data = await page.evaluate(() => {
      // Date
      const dateEl = document.querySelector('time.post-date')
      const rawDate = dateEl?.textContent?.trim() ?? ''

      // Build an ISO date from "Today, February 25" or similar
      const now = new Date()
      const isoDate = now.toISOString().split('T')[0] // YYYY-MM-DD

      // Content paragraphs
      const content = document.querySelector('.post-content')
      if (!content) return null

      const paragraphs = Array.from(content.querySelectorAll('p'))
        .map((p) => p.textContent?.trim())
        .filter(Boolean)

      if (paragraphs.length === 0) return null

      // First paragraph is the bible verse
      const verse = paragraphs[0]
      // Remaining paragraphs are the prayer body
      const body = paragraphs.slice(1).join('\n\n')

      return { date: isoDate, rawDate, verse, body }
    })

    if (!data || !data.body) {
      console.error('Failed to extract prayer content')
      process.exit(1)
    }

    writeFileSync(OUT, JSON.stringify(data, null, 2) + '\n')
    console.log(`Wrote daily prayer for ${data.date} to ${OUT}`)
    console.log(`Verse: ${data.verse?.slice(0, 80)}...`)
    console.log(`Body: ${data.body?.slice(0, 80)}...`)
  } finally {
    await browser.close()
  }
}

scrape().catch((err) => {
  console.error('Scrape failed:', err)
  process.exit(1)
})
