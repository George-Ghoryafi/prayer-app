import { useState } from 'react'
import Dashboard from './pages/Dashboard'
import EntriesPage from './pages/EntriesPage'

export type EntryType = 'current' | 'longterm'

function App() {
  const [page, setPage] = useState<'dashboard' | 'entries'>('dashboard')
  const [entryType, setEntryType] = useState<EntryType>('current')

  const navigateToEntries = (type: EntryType) => {
    setEntryType(type)
    setPage('entries')
  }

  const navigateToDashboard = () => {
    setPage('dashboard')
  }

  if (page === 'entries') {
    return (
      <EntriesPage
        type={entryType}
        onBack={navigateToDashboard}
      />
    )
  }

  return <Dashboard onNavigate={navigateToEntries} />
}

export default App
