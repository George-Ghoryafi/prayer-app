import { useState, useEffect } from 'react'
import type { EntryType } from '../App'
import SegmentedControl from '../components/SegmentedControl'
import EntryCard from '../components/EntryCard'
import FAB from '../components/FAB'
import NewPrayerModal from '../components/NewPrayerModal'
import {
  getPrayers, markPrayed, deletePrayer, computeStreak,
  type Prayer, type FocusType
} from '../lib/db'
import './EntriesPage.css'

interface EntriesPageProps {
  type: EntryType
  onBack: () => void
  onSelectPrayer: (prayer: Prayer) => void
}

function formatRelativeDate(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  return `${Math.floor(days / 30)} months ago`
}

function startOfDay(ts: number): number {
  const d = new Date(ts)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

export default function EntriesPage({ type, onBack, onSelectPrayer }: EntriesPageProps) {
  const [showModal, setShowModal] = useState(false)
  const [prayers, setPrayers] = useState<Prayer[]>([])
  const [loadedAt, setLoadedAt] = useState(Date.now)
  const [refreshKey, setRefreshKey] = useState(0)
  const [focus, setFocus] = useState<FocusType>('myself')

  const timeframe = type === 'current' ? 'current' as const : 'longterm' as const
  const title = type === 'current' ? 'Current' : 'Long Term'

  useEffect(() => {
    let cancelled = false
    getPrayers(timeframe, focus).then((results) => {
      if (!cancelled) {
        setPrayers(results)
        setLoadedAt(Date.now())
      }
    })
    return () => { cancelled = true }
  }, [timeframe, focus, refreshKey])

  const refresh = () => setRefreshKey((k) => k + 1)

  const handlePray = async (id: number) => {
    await markPrayed(id)
    refresh()
  }

  const handleDelete = async (id: number) => {
    await deletePrayer(id)
    refresh()
  }

  return (
    <div className="entries-page">
      <div className="entries-page__header">
        <div className="entries-page__nav">
          <button className="entries-page__back" type="button" onClick={onBack} aria-label="Go back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <h1 className="entries-page__title">{title}</h1>
        </div>
        <SegmentedControl value={focus} onChange={setFocus} />
      </div>

      <main className="entries-page__scroll">
        {prayers.length === 0 ? (
          <div className="entries-page__empty">
            <p className="entries-page__empty-text">No prayers yet. Tap + to add one.</p>
          </div>
        ) : (
          prayers.map((prayer) => {
            const streak = computeStreak(prayer.lastPrayed, prayer.prayerStreak, loadedAt)
            const isRecent = loadedAt - prayer.createdAt < 86400000 * 2
            const todayStart = startOfDay(loadedAt)
            const prayedToday = prayer.lastPrayed != null && startOfDay(prayer.lastPrayed) === todayStart
            return (
              <EntryCard
                key={prayer.id}
                id={prayer.id!}
                title={prayer.title}
                body={prayer.body}
                date={formatRelativeDate(prayer.createdAt)}
                streaks={streak}
                prayedToday={prayedToday}
                isRecent={isRecent}
                onPray={handlePray}
                onDelete={handleDelete}
                onClick={() => onSelectPrayer(prayer)}
              />
            )
          })
        )}
      </main>

      <FAB onClick={() => setShowModal(true)} />
      {showModal && (
        <NewPrayerModal
          onClose={() => setShowModal(false)}
          onSaved={refresh}
        />
      )}
    </div>
  )
}
