import Header from '../components/Header'
import FocusCard from '../components/FocusCard'
import JourneyCard from '../components/JourneyCard'
import QuoteCard from '../components/QuoteCard'
import FAB from '../components/FAB'
import BottomNav from '../components/BottomNav'
import './Dashboard.css'

export default function Dashboard() {
  return (
    <div className="dashboard">
      <main className="dashboard__scroll">
        <Header />
        <FocusCard />
        <JourneyCard />
        <QuoteCard />
      </main>
      <FAB />
      <BottomNav />
    </div>
  )
}
