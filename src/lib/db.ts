const DB_NAME = 'prayer-app'
const DB_VERSION = 5
const STORE_NAME = 'prayers'

export type FocusType = 'myself' | 'others' | 'general'

export interface Prayer {
  id?: number
  title: string
  body: string
  bibleVerse?: string
  timeframe: 'current' | 'longterm'
  focus: FocusType
  createdAt: number
  lastPrayed: number | null
  prayerStreak: number
  source?: string              // e.g. 'plough-daily'
  sourceDate?: string           // e.g. '2026-02-25'
}

/** Get the start-of-day (midnight) for a given timestamp in local time */
function startOfDay(ts: number): number {
  const d = new Date(ts)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

const ONE_DAY = 86400000

/**
 * Compute the live streak given the stored values.
 * - If never prayed → 0
 * - If last prayed today → keep streak
 * - If last prayed yesterday → keep streak (can still extend today)
 * - If last prayed 2+ days ago → streak broken → 0
 */
export function computeStreak(lastPrayed: number | null, storedStreak: number, now: number): number {
  if (lastPrayed == null) return 0
  const todayStart = startOfDay(now)
  const lastStart = startOfDay(lastPrayed)
  const gap = todayStart - lastStart

  if (gap <= ONE_DAY) return storedStreak  // today or yesterday
  return 0 // streak broken
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)

    req.onupgradeneeded = () => {
      const db = req.result
      let store: IDBObjectStore
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        store = db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        })
      } else {
        store = req.transaction!.objectStore(STORE_NAME)
      }

      if (!store.indexNames.contains('timeframe')) {
        store.createIndex('timeframe', 'timeframe', { unique: false })
      }
      if (!store.indexNames.contains('focus')) {
        store.createIndex('focus', 'focus', { unique: false })
      }
      if (!store.indexNames.contains('sourceDate')) {
        store.createIndex('sourceDate', 'sourceDate', { unique: false })
      }
    }

    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function addPrayer(
  prayer: Omit<Prayer, 'id' | 'createdAt' | 'lastPrayed' | 'prayerStreak'>
): Promise<number> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const record: Prayer = {
      ...prayer,
      createdAt: Date.now(),
      lastPrayed: null,
      prayerStreak: 0,
    }
    const req = store.add(record)
    req.onsuccess = () => resolve(req.result as number)
    req.onerror = () => reject(req.error)
    tx.oncomplete = () => db.close()
  })
}

export async function getPrayers(
  timeframe: 'current' | 'longterm',
  focus: FocusType
): Promise<Prayer[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const index = store.index('timeframe')
    const req = index.getAll(timeframe)
    req.onsuccess = () => {
      const results = (req.result as Prayer[])
        .filter((p) => p.focus === focus)
        .sort((a, b) => b.createdAt - a.createdAt)
      resolve(results)
    }
    req.onerror = () => reject(req.error)
    tx.oncomplete = () => db.close()
  })
}

/**
 * Mark a prayer as "prayed today".
 * Increments streak if not already prayed today, resets if broken.
 */
export async function markPrayed(id: number): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const getReq = store.get(id)

    getReq.onsuccess = () => {
      const prayer = getReq.result as Prayer | undefined
      if (!prayer) { reject(new Error('Prayer not found')); return }

      const now = Date.now()
      const todayStart = startOfDay(now)
      const lastStart = prayer.lastPrayed != null ? startOfDay(prayer.lastPrayed) : null

      // Already prayed today — no-op
      if (lastStart != null && lastStart === todayStart) {
        resolve()
        return
      }

      const currentStreak = computeStreak(prayer.lastPrayed, prayer.prayerStreak, now)
      prayer.prayerStreak = currentStreak + 1
      prayer.lastPrayed = now

      const putReq = store.put(prayer)
      putReq.onsuccess = () => resolve()
      putReq.onerror = () => reject(putReq.error)
    }

    getReq.onerror = () => reject(getReq.error)
    tx.oncomplete = () => db.close()
  })
}

export async function deletePrayer(id: number): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const req = store.delete(id)
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
    tx.oncomplete = () => db.close()
  })
}

/** Get today's completion stats for "current" prayers */
export async function getDailyProgress(): Promise<{ completed: number; total: number }> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const index = store.index('timeframe')
    const req = index.getAll('current')
    req.onsuccess = () => {
      const prayers = req.result as Prayer[]
      const total = prayers.length
      const todayStart = startOfDay(Date.now())
      const completed = prayers.filter(
        (p) => p.lastPrayed != null && startOfDay(p.lastPrayed) === todayStart
      ).length
      resolve({ completed, total })
    }
    req.onerror = () => reject(req.error)
    tx.oncomplete = () => db.close()
  })
}

/** Count prayers not prayed today, per focus, for a given timeframe */
export async function getIncompleteCounts(
  timeframe: 'current' | 'longterm'
): Promise<Record<FocusType, number>> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const index = store.index('timeframe')
    const req = index.getAll(timeframe)
    req.onsuccess = () => {
      const prayers = req.result as Prayer[]
      const todayStart = startOfDay(Date.now())
      const counts: Record<FocusType, number> = { myself: 0, others: 0, general: 0 }
      for (const p of prayers) {
        const prayedToday = p.lastPrayed != null && startOfDay(p.lastPrayed) === todayStart
        if (!prayedToday) counts[p.focus]++
      }
      resolve(counts)
    }
    req.onerror = () => reject(req.error)
    tx.oncomplete = () => db.close()
  })
}

const BASE = typeof import.meta !== 'undefined'
  ? import.meta.env?.BASE_URL ?? '/'
  : '/'

/** Fetch daily prayer JSON and insert/update the single plough-daily entry */
export async function ingestDailyPrayer(): Promise<void> {
  try {
    const res = await fetch(`${BASE}daily-prayer.json`, { cache: 'no-cache' })
    if (!res.ok) return

    const data = await res.json() as { date: string; verse: string; body: string }
    if (!data.date || !data.body) return

    // Find any existing plough-daily prayer
    const db = await openDB()
    const existing = await new Promise<Prayer | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const store = tx.objectStore(STORE_NAME)
      const all = store.getAll()
      all.onsuccess = () => {
        const match = (all.result as Prayer[]).find(
          (p) => p.source === 'plough-daily'
        )
        resolve(match ?? null)
      }
      all.onerror = () => reject(all.error)
      tx.oncomplete = () => db.close()
    })

    if (existing) {
      // Already up-to-date
      if (existing.sourceDate === data.date) return

      // Overwrite with today's prayer
      const db2 = await openDB()
      await new Promise<void>((resolve, reject) => {
        const tx = db2.transaction(STORE_NAME, 'readwrite')
        const store = tx.objectStore(STORE_NAME)
        const updated: Prayer = {
          ...existing,
          body: data.body,
          bibleVerse: data.verse || undefined,
          sourceDate: data.date,
          lastPrayed: null,
          prayerStreak: 0,
        }
        const req = store.put(updated)
        req.onsuccess = () => resolve()
        req.onerror = () => reject(req.error)
        tx.oncomplete = () => db2.close()
      })
    } else {
      // First time — create the entry
      await addPrayer({
        title: 'Daily Prayer',
        body: data.body,
        bibleVerse: data.verse || undefined,
        timeframe: 'current',
        focus: 'general',
        source: 'plough-daily',
        sourceDate: data.date,
      })
    }
  } catch {
    // Silently fail
  }
}
