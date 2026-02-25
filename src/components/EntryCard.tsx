import './EntryCard.css'

interface EntryCardProps {
  title: string
  body: string
  date: string
  streaks: number
  isRecent?: boolean
}

export default function EntryCard({ title, body, date, streaks, isRecent }: EntryCardProps) {
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
        <button className="entry-card__menu" type="button" aria-label="More options">•••</button>
      </div>

      <h3 className="entry-card__title">{title}</h3>
      <p className="entry-card__body">{body}</p>

      <div className="entry-card__divider" />

      <div className="entry-card__streak">
        <svg className="entry-card__streak-icon" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 1c-.2 0-.4.1-.5.3C6.3 3.5 5 5.5 5 7.5c0 .8.3 1.5.7 2.1L4.3 11c-.2.2-.3.5-.3.8 0 1.2 1.8 3.2 4 3.2s4-2 4-3.2c0-.3-.1-.6-.3-.8l-1.4-1.4c.4-.6.7-1.3.7-2.1 0-2-1.3-4-2.5-6.2-.1-.2-.3-.3-.5-.3z" />
        </svg>
        <span className="entry-card__streak-text">
          {streaks} {streaks === 1 ? 'streak' : 'streaks'}
        </span>
      </div>
    </article>
  )
}
