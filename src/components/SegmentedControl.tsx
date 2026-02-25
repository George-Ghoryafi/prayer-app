import { useState } from 'react'
import './SegmentedControl.css'

const TABS = ['Myself', 'Others', 'General'] as const

export default function SegmentedControl() {
  const [active, setActive] = useState(0)

  return (
    <div className="segmented-control">
      <div className="segmented-control__track">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            type="button"
            className={`segmented-control__tab ${i === active ? 'segmented-control__tab--active' : ''}`}
            onClick={() => setActive(i)}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  )
}
