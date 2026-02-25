import './QuoteCard.css'

export default function QuoteCard() {
  return (
    <section className="quote-card">
      <div className="quote-card__icon">
        <span className="quote-card__icon-symbol">&ldquo;</span>
      </div>
      <div className="quote-card__content">
        <p className="quote-card__text">
          &ldquo;Be still, and know that I am God.&rdquo;
        </p>
        <span className="quote-card__reference">Psalm 46:10</span>
      </div>
    </section>
  )
}
