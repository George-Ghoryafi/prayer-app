import { useState } from 'react'
import Dashboard from './pages/Dashboard'
import EntriesPage from './pages/EntriesPage'
import PrayerDetail from './pages/PrayerDetail'
import { markPrayed, type Prayer } from './lib/db'

export type EntryType = 'current' | 'longterm'

function App() {
  const [page, setPage] = useState<'dashboard' | 'entries' | 'detail'>('dashboard')
  const [entryType, setEntryType] = useState<EntryType>('current')
  const [activePrayer, setActivePrayer] = useState<Prayer | null>(null)

  const navigateToEntries = (type: EntryType) => {
    setEntryType(type)
    setPage('entries')
  }

  const navigateToDashboard = () => {
    setPage('dashboard')
  }

  const navigateToDetail = (prayer: Prayer) => {
    setActivePrayer(prayer)
    setPage('detail')
  }

  const closeDetail = () => {
    setActivePrayer(null)
    setPage('entries')
  }

  const handleAnswered = async () => {
    if (!activePrayer?.id) return
    await markPrayed(activePrayer.id)
    closeDetail()
  }

  if (page === 'detail' && activePrayer) {
    return <PrayerDetail prayer={activePrayer} onBack={closeDetail} onAnswered={handleAnswered} />
  }

  if (page === 'entries') {
    return (
      <EntriesPage
        type={entryType}
        onBack={navigateToDashboard}
        onSelectPrayer={navigateToDetail}
      />
    )
  }

  return <Dashboard onNavigate={navigateToEntries} />
}

export default App
