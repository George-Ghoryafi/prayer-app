import './JourneyCard.css'

const BASE = import.meta.env.BASE_URL

export default function JourneyCard() {
  return (
    <section className="journey-card">
      <div className="journey-card__image-wrapper">
        <img
          className="journey-card__image"
          src={`${BASE}images/ocean-waves.png`}
          alt="Calm ocean waves at sunset"
        />
        <div className="journey-card__image-overlay" />
      </div>

      <div className="journey-card__content">
        <div className="journey-card__tag">
          <span className="journey-card__tag-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L8 10h3v6l4-8h-3V2z" />
              <path d="M6 14l-3 8h6l-3-8z" />
              <path d="M18 14l-3 8h6l-3-8z" />
            </svg>
          </span>
          <span className="journey-card__tag-text">Journeys</span>
        </div>

        <h2 className="journey-card__title">Long Term</h2>
        <p className="journey-card__body">
          Ongoing journeys and lifelong hopes. Keep your vision steady.
        </p>

        <div className="journey-card__avatars">
          {/* Avatar 1 */}
          <div className="journey-card__avatar">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="16" fill="#7FA8B8" />
              <circle cx="16" cy="13" r="5" fill="#5A8FA3" />
              <ellipse cx="16" cy="26" rx="8" ry="6" fill="#5A8FA3" />
            </svg>
          </div>
          {/* Avatar 2 */}
          <div className="journey-card__avatar">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="16" fill="#8BB5C4" />
              <circle cx="16" cy="13" r="5" fill="#6A9CB0" />
              <ellipse cx="16" cy="26" rx="8" ry="6" fill="#6A9CB0" />
            </svg>
          </div>
          {/* Placeholder +3 */}
          <div className="journey-card__avatar journey-card__avatar--placeholder">
            <span className="journey-card__avatar-text">+3</span>
          </div>
        </div>
      </div>
    </section>
  )
}
