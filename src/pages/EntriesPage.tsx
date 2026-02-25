import type { EntryType } from '../App'
import SegmentedControl from '../components/SegmentedControl'
import EntryCard from '../components/EntryCard'
import FAB from '../components/FAB'
import BottomNav from '../components/BottomNav'
import { currentEntries, longtermEntries } from '../data/mockEntries'
import './EntriesPage.css'

interface EntriesPageProps {
  type: EntryType
  onBack: () => void
  onHomeClick: () => void
}

export default function EntriesPage({ type, onBack, onHomeClick }: EntriesPageProps) {
  const entries = type === 'current' ? currentEntries : longtermEntries
  const title = type === 'current' ? 'Current' : 'Long Term'

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
        <SegmentedControl />
      </div>

      <main className="entries-page__scroll">
        {entries.map((entry) => (
          <EntryCard
            key={entry.id}
            title={entry.title}
            body={entry.body}
            date={entry.date}
            streaks={entry.streaks}
            isRecent={entry.isRecent}
          />
        ))}
      </main>

      <FAB />
      <BottomNav variant="entries" onHomeClick={onHomeClick} />
    </div>
  )
}
