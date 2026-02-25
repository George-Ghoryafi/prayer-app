import { useState, useEffect } from 'react'
import type { EntryType } from '../App'
import Header from '../components/Header'
import FocusCard from '../components/FocusCard'
import JourneyCard from '../components/JourneyCard'
import QuoteCard from '../components/QuoteCard'
import FAB from '../components/FAB'
import NewPrayerModal from '../components/NewPrayerModal'
import { getDailyProgress, ingestDailyPrayer } from '../lib/db'
import './Dashboard.css'

interface DashboardProps {
  onNavigate: (type: EntryType) => void
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [showModal, setShowModal] = useState(false)
  const [completed, setCompleted] = useState(0)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    // Ingest daily prayer first, then refresh progress
    ingestDailyPrayer().then(() =>
      getDailyProgress().then(({ completed: c, total: t }) => {
        setCompleted(c)
        setTotal(t)
      })
    )
  }, [showModal]) // re-fetch after modal closes (new prayer added)

  return (
    <div className="dashboard">
      <main className="dashboard__scroll">
        <Header />
        <FocusCard completed={completed} total={total} onClick={() => onNavigate('current')} />
        <JourneyCard onClick={() => onNavigate('longterm')} />
        <QuoteCard />
      </main>
      <FAB onClick={() => setShowModal(true)} />
      {showModal && (
        <NewPrayerModal onClose={() => setShowModal(false)} />
      )}
    </div>
  )
}
