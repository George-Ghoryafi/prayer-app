const DB_NAME = 'prayer-app'
const DB_VERSION = 4
const STORE_NAME = 'prayers'

export type FocusType = 'myself' | 'others' | 'general'

export interface Prayer {
  id?: number
  title: string
  body: string
  bibleVerse?: string          // optional verse text, e.g. '"Be still..." — Psalm 46:10'
  timeframe: 'current' | 'longterm'
  focus: FocusType
  createdAt: number
  lastPrayed: number | null
  prayerStreak: number
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
