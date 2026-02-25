import './BottomNav.css'

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {/* HOME - Active */}
      <button className="bottom-nav__tab bottom-nav__tab--active" type="button">
        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1V10.5z" />
        </svg>
        <span>Home</span>
      </button>

      {/* PRAY - Inactive */}
      <button className="bottom-nav__tab bottom-nav__tab--inactive" type="button">
        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.53L12 21.35z" />
        </svg>
        <span>Pray</span>
      </button>

      {/* JOURNAL - Inactive */}
      <button className="bottom-nav__tab bottom-nav__tab--inactive" type="button">
        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 2a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 4h10v2H7V6zm0 4h10v2H7v-2zm0 4h7v2H7v-2z" />
        </svg>
        <span>Journal</span>
      </button>

      {/* PROFILE - Inactive */}
      <button className="bottom-nav__tab bottom-nav__tab--inactive" type="button">
        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="8" r="4" />
          <path d="M12 14c-6 0-8 3-8 5v1h16v-1c0-2-2-5-8-5z" />
        </svg>
        <span>Profile</span>
      </button>
    </nav>
  )
}
