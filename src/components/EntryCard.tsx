import { useState, useRef, useEffect } from 'react'
import './EntryCard.css'

interface EntryCardProps {
  id: number
  title: string
  body: string
  date: string
  streaks: number
  prayedToday: boolean
  isRecent?: boolean
  onPray: (id: number) => void
  onDelete: (id: number) => void
}

export default function EntryCard({
  id, title, body, date, streaks, prayedToday, isRecent, onPray, onDelete
}: EntryCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  return (
    <article className="entry-card">
      <div className="entry-card__header">
        <div className="entry-card__meta">
          {isRecent && (
            <div className="entry-card__tag">
              <svg className="entry-card__tag-icon" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.15 4.85a.5.5 0 00-.707 0L6.5 9.793 4.557 7.85a.5.5 0 00-.707.707l2.297 2.297a.5.5 0 00.707 0l5.296-5.297a.5.5 0 000-.707z" />
                <path d="M2.5 1A1.5 1.5 0 001 2.5v9.793l1-1V2.5a.5.5 0 01.5-.5h8.793l1-1H2.5z" />
                <path d="M13.5 2H6.707l-1 1H13.5a.5.5 0 01.5.5v8.793l1-1V2.5A1.5 1.5 0 0013.5 2z" />
              </svg>
              <span className="entry-card__tag-text">Recent</span>
            </div>
          )}
          <span className="entry-card__date">{date}</span>
        </div>

        {/* Menu wrapper */}
        <div className="entry-card__menu-wrapper" ref={menuRef}>
          <button
            className="entry-card__menu"
            type="button"
            aria-label="More options"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            •••
          </button>

          {menuOpen && (
            <div className="entry-card__dropdown">
              <button
                className="entry-card__dropdown-item"
                type="button"
                disabled={prayedToday}
                onClick={() => { onPray(id); setMenuOpen(false) }}
              >
                <svg className="entry-card__dropdown-icon" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 1a1 1 0 01.894.553l.448.894A1 1 0 0012.236 3h1.528a1 1 0 01.707 1.707l-1.06 1.06a1 1 0 00-.293.708v.289a1 1 0 01-.553.894l-.894.448a1 1 0 01-.894 0l-.894-.448A1 1 0 019.33 7.764v-.289a1 1 0 00-.293-.707l-1.06-1.06A1 1 0 018.683 4h1.08a1 1 0 00.894-.553L10.553 1.553A1 1 0 0110 1z" />
                  <path d="M5 10c0-.552.448-1 1-1h8a1 1 0 011 1v5a4 4 0 01-4 4h-2a4 4 0 01-4-4v-5z" />
                </svg>
                {prayedToday ? 'Prayed Today ✓' : 'Prayed Today'}
              </button>
              <div className="entry-card__dropdown-divider" />
              <button
                className="entry-card__dropdown-item entry-card__dropdown-item--danger"
                type="button"
                onClick={() => { onDelete(id); setMenuOpen(false) }}
              >
                <svg className="entry-card__dropdown-icon" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.5 4h3a1.5 1.5 0 00-3 0zM7 4a3 3 0 016 0h4.25a.75.75 0 010 1.5h-.92l-.8 10.4A3 3 0 0112.55 19h-5.1a3 3 0 01-2.98-3.1L3.67 5.5H2.75a.75.75 0 010-1.5H7z" />
                </svg>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <h3 className="entry-card__title">{title}</h3>
      <p className="entry-card__body">{body}</p>

      <div className="entry-card__divider" />

      <div className="entry-card__streak">
        <svg className="entry-card__streak-icon" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 1c-.2 0-.4.1-.5.3C6.3 3.5 5 5.5 5 7.5c0 .8.3 1.5.7 2.1L4.3 11c-.2.2-.3.5-.3.8 0 1.2 1.8 3.2 4 3.2s4-2 4-3.2c0-.3-.1-.6-.3-.8l-1.4-1.4c.4-.6.7-1.3.7-2.1 0-2-1.3-4-2.5-6.2-.1-.2-.3-.3-.5-.3z" />
        </svg>
        <span className="entry-card__streak-text">
          {streaks} day {streaks === 1 ? 'streak' : 'streak'}
        </span>
      </div>
    </article>
  )
}
