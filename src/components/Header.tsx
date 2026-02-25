import './Header.css'

export default function Header() {
  return (
    <header className="header">
      <div className="header__titles">
        <span className="header__overline">Today</span>
        <h1 className="header__greeting">Good Morning</h1>
      </div>
      <div className="header__avatar">
        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="8" r="4" />
          <path d="M12 14c-6 0-8 3-8 5v1h16v-1c0-2-2-5-8-5z" />
        </svg>
      </div>
    </header>
  )
}
