import { useState } from 'react'
import type { EntryType } from '../App'
import Header from '../components/Header'
import FocusCard from '../components/FocusCard'
import JourneyCard from '../components/JourneyCard'
import QuoteCard from '../components/QuoteCard'
import FAB from '../components/FAB'
import NewPrayerModal from '../components/NewPrayerModal'
import './Dashboard.css'

interface DashboardProps {
  onNavigate: (type: EntryType) => void
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="dashboard">
      <main className="dashboard__scroll">
        <Header />
        <FocusCard onClick={() => onNavigate('current')} />
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
