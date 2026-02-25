import { useState } from 'react'
import { addPrayer, type FocusType } from '../lib/db'
import './NewPrayerModal.css'

interface NewPrayerModalProps {
  onClose: () => void
  onSaved?: () => void
}

export default function NewPrayerModal({ onClose, onSaved }: NewPrayerModalProps) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [bibleVerse, setBibleVerse] = useState('')
  const [showVerse, setShowVerse] = useState(false)
  const [timeframe, setTimeframe] = useState<'current' | 'longterm'>('current')
  const [focus, setFocus] = useState<FocusType>('myself')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    const trimmedTitle = title.trim()
    const trimmedBody = body.trim()
    if (!trimmedTitle || !trimmedBody || saving) return

    setSaving(true)
    try {
      const trimmedVerse = bibleVerse.trim() || undefined
      await addPrayer({ title: trimmedTitle, body: trimmedBody, bibleVerse: trimmedVerse, timeframe, focus })
      onSaved?.()
      onClose()
    } catch (err) {
      console.error('Failed to save prayer:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="prayer-modal-backdrop" onClick={onClose}>
      <div className="prayer-modal" onClick={(e) => e.stopPropagation()}>
        {/* Drag Handle */}
        <div className="prayer-modal__handle" />

        {/* Header */}
        <div className="prayer-modal__header">
          <h2 className="prayer-modal__title">New Prayer</h2>
          <button className="prayer-modal__close" type="button" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="prayer-modal__body">
          {/* Text Input */}
          <div className="prayer-modal__input-wrapper">
            <input
              className="prayer-modal__title-input"
              type="text"
              placeholder="Prayer Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={60}
            />
            <div className="prayer-modal__divider" />
            <textarea
              className="prayer-modal__textarea"
              placeholder="What's on your heart?"
              rows={5}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            <svg className="prayer-modal__input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6h16" />
              <path d="M4 12h10" />
              <path d="M4 18h14" />
            </svg>
          </div>

          {/* Bible Verse (optional, collapsible) */}
          <div className="prayer-modal__group">
            <button
              type="button"
              className="prayer-modal__verse-toggle"
              onClick={() => setShowVerse(!showVerse)}
            >
              <svg className="prayer-modal__verse-toggle-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 2a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6H6zm7 1.5L18.5 9H13V3.5zM8 13h8v1.5H8V13zm0 3h6v1.5H8V16z" />
              </svg>
              <span>Add Bible Verse</span>
              <svg
                className={`prayer-modal__verse-chevron ${showVerse ? 'prayer-modal__verse-chevron--open' : ''}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {showVerse && (
              <textarea
                className="prayer-modal__verse-input"
                placeholder={'"For I know the plans I have for you..." — Jeremiah 29:11'}
                rows={3}
                value={bibleVerse}
                onChange={(e) => setBibleVerse(e.target.value)}
              />
            )}
          </div>

          {/* Timeframe */}
          <div className="prayer-modal__group">
            <div className="prayer-modal__label">Timeframe</div>
            <div className="prayer-modal__chips">
              <button
                type="button"
                className={`prayer-modal__chip ${timeframe === 'current' ? 'prayer-modal__chip--active' : ''}`}
                onClick={() => setTimeframe('current')}
              >
                Current
              </button>
              <button
                type="button"
                className={`prayer-modal__chip ${timeframe === 'longterm' ? 'prayer-modal__chip--active' : ''}`}
                onClick={() => setTimeframe('longterm')}
              >
                Long Term
              </button>
            </div>
          </div>

          {/* Focus */}
          <div className="prayer-modal__group">
            <div className="prayer-modal__label">Focus</div>
            <div className="prayer-modal__chips">
              <button
                type="button"
                className={`prayer-modal__chip ${focus === 'myself' ? 'prayer-modal__chip--active' : ''}`}
                onClick={() => setFocus('myself')}
              >
                <span className="prayer-modal__chip-icon">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M12 14c-6 0-8 3-8 5v1h16v-1c0-2-2-5-8-5z" />
                  </svg>
                </span>
                Myself
              </button>
              <button
                type="button"
                className={`prayer-modal__chip ${focus === 'others' ? 'prayer-modal__chip--active' : ''}`}
                onClick={() => setFocus('others')}
              >
                <span className="prayer-modal__chip-icon">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="9" cy="8" r="3.5" />
                    <path d="M9 13c-5 0-7 2.5-7 4v1h14v-1c0-1.5-2-4-7-4z" />
                    <circle cx="17" cy="9" r="2.5" />
                    <path d="M22 18v-1c0-1.2-1.5-3-4.5-3.5" />
                  </svg>
                </span>
                Others
              </button>
              <button
                type="button"
                className={`prayer-modal__chip ${focus === 'general' ? 'prayer-modal__chip--active' : ''}`}
                onClick={() => setFocus('general')}
              >
                <span className="prayer-modal__chip-icon">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </span>
                General
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="prayer-modal__actions">
          <button
            className="prayer-modal__save"
            type="button"
            onClick={handleSave}
            disabled={saving || !body.trim() || !title.trim()}
            style={{ opacity: (!body.trim() || !title.trim()) ? 0.5 : 1 }}
          >
            {saving ? 'Saving...' : 'Save Prayer'}
          </button>
          <button className="prayer-modal__cancel" type="button" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
