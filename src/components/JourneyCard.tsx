import './JourneyCard.css'

const BASE = import.meta.env.BASE_URL

interface JourneyCardProps {
  onClick?: () => void
}

export default function JourneyCard({ onClick }: JourneyCardProps) {
  return (
    <section className="journey-card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : undefined }}>
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
      </div>
    </section>
  )
}
