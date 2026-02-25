import { useState, useRef, useEffect } from 'react'
import type { Prayer } from '../lib/db'
import './PrayerDetail.css'

interface PrayerDetailProps {
  prayer: Prayer
  onBack: () => void
}

function paginateText(text: string, frame: HTMLDivElement): string[] {
  const frameHeight = frame.clientHeight
  if (frameHeight <= 0) return [text]

  const clone = document.createElement('p')
  clone.className = 'prayer-detail__body'
  clone.style.position = 'absolute'
  clone.style.visibility = 'hidden'
  clone.style.pointerEvents = 'none'
  clone.style.top = '0'
  clone.style.left = '0'
  clone.style.width = `${frame.clientWidth}px`
  clone.style.margin = '0'
  frame.appendChild(clone)

  const words = text.split(/\s+/)
  const pages: string[] = []
  let wordIdx = 0

  while (wordIdx < words.length) {
    const pageWords: string[] = []

    while (wordIdx < words.length) {
      pageWords.push(words[wordIdx])
      clone.textContent = pageWords.join(' ')

      if (clone.scrollHeight > frameHeight) {
        pageWords.pop()
        break
      }
      wordIdx++
    }

    if (pageWords.length > 0) {
      pages.push(pageWords.join(' '))
    } else {
      pages.push(words[wordIdx])
      wordIdx++
    }
  }

  frame.removeChild(clone)
  return pages.length > 0 ? pages : [text]
}

interface PageData {
  type: 'verse' | 'body'
  text: string
}

function usePages(
  prayer: Prayer,
  containerRef: React.RefObject<HTMLDivElement | null>
): PageData[] {
  const prayerText = prayer.body

  const [textPages, setTextPages] = useState<string[]>([prayerText])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver(() => {
      setTextPages(paginateText(prayerText, container))
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [prayerText, containerRef])

  const allPages: PageData[] = []

  if (prayer.bibleVerse) {
    allPages.push({ type: 'verse', text: prayer.bibleVerse })
  }

  for (const page of textPages) {
    allPages.push({ type: 'body', text: page })
  }

  return allPages
}

export default function PrayerDetail({ prayer, onBack }: PrayerDetailProps) {
  const textAreaRef = useRef<HTMLDivElement>(null)
  const pages = usePages(prayer, textAreaRef)
  const [currentPage, setCurrentPage] = useState(0)

  const touchStartY = useRef(0)
  const swiping = useRef(false)

  const goNext = () => setCurrentPage((p) => Math.min(p + 1, pages.length - 1))
  const goPrev = () => setCurrentPage((p) => Math.max(p - 1, 0))

  useEffect(() => {
    const el = textAreaRef.current
    if (!el) return

    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
      swiping.current = true
    }

    const onTouchEnd = (e: TouchEvent) => {
      if (!swiping.current) return
      swiping.current = false
      const delta = touchStartY.current - e.changedTouches[0].clientY
      if (Math.abs(delta) > 40) {
        if (delta > 0) goNext()
        else goPrev()
      }
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (Math.abs(e.deltaY) > 20) {
        if (e.deltaY > 0) goNext()
        else goPrev()
      }
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    el.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchend', onTouchEnd)
      el.removeEventListener('wheel', onWheel)
    }
  })

  const activePage = Math.min(currentPage, pages.length - 1)
  const page = pages[activePage]

  return (
    <div className="prayer-detail">
      {/* Top Navigation */}
      <nav className="prayer-detail__nav">
        <button className="prayer-detail__back" type="button" onClick={onBack} aria-label="Go back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
        </button>
        <button className="prayer-detail__edit" type="button" aria-label="Edit prayer">
          <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
          </svg>
        </button>
      </nav>

      {/* Reading Area */}
      <div className="prayer-detail__content">
        <div className="prayer-detail__quote-icon" aria-hidden="true">"</div>
        <div className="prayer-detail__page-frame" ref={textAreaRef}>
          {page?.type === 'verse' ? (
            <div className="prayer-detail__verse-page" key={`verse-${activePage}`}>
              <p className="prayer-detail__body">{page.text}</p>
            </div>
          ) : (
            <p className="prayer-detail__body" key={`body-${activePage}`}>
              {page?.text}
            </p>
          )}
        </div>
      </div>

      {/* Page dots */}
      {pages.length > 1 && (
        <div className="prayer-detail__dots">
          {pages.map((_, i) => (
            <div
              key={i}
              className={`prayer-detail__dot ${i === activePage ? 'prayer-detail__dot--active' : ''}`}
            />
          ))}
        </div>
      )}

      {/* Sticky Bottom Action */}
      <div className="prayer-detail__actions">
        <svg className="prayer-detail__leaf" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75" />
        </svg>

        <button className="prayer-detail__answered-btn" type="button">
          <span className="prayer-detail__check-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </span>
          <span className="prayer-detail__answered-text">Mark as Answered</span>
        </button>
      </div>
    </div>
  )
}
