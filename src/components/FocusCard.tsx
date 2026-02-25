import './FocusCard.css'

const BASE = import.meta.env.BASE_URL

interface FocusCardProps {
  completed: number
  total: number
  onClick?: () => void
}

export default function FocusCard({ completed, total, onClick }: FocusCardProps) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <section className="focus-card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : undefined }}>
      <div className="focus-card__image-wrapper">
        <img
          className="focus-card__image"
          src={`${BASE}images/sunrise-mountains.png`}
          alt="Sunrise over mountain ranges"
        />
        <div className="focus-card__image-overlay" />
      </div>

      <div className="focus-card__content">
        <div className="focus-card__tag">
          <span className="focus-card__tag-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
            </svg>
          </span>
          <span className="focus-card__tag-text">Daily Focus</span>
        </div>

        <h2 className="focus-card__title">Daily Prayers</h2>
        <p className="focus-card__body">
          Pressing needs and daily focus. Center your thoughts on what matters today.
        </p>

        <div className="focus-card__progress">
          <div className="focus-card__progress-track">
            <div className="focus-card__progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="focus-card__progress-text">{completed}/{total}</span>
        </div>
      </div>
    </section>
  )
}
