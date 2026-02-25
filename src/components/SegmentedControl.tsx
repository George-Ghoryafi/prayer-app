import type { FocusType } from '../lib/db'
import './SegmentedControl.css'

const TABS: { label: string; value: FocusType }[] = [
  { label: 'Myself', value: 'myself' },
  { label: 'Others', value: 'others' },
  { label: 'General', value: 'general' },
]

interface SegmentedControlProps {
  value: FocusType
  onChange: (value: FocusType) => void
  counts?: Record<FocusType, number>
}

export default function SegmentedControl({ value, onChange, counts }: SegmentedControlProps) {
  return (
    <div className="segmented-control">
      <div className="segmented-control__track">
        {TABS.map((tab) => {
          const count = counts?.[tab.value] ?? 0
          return (
            <button
              key={tab.value}
              type="button"
              className={`segmented-control__tab ${tab.value === value ? 'segmented-control__tab--active' : ''}`}
              onClick={() => onChange(tab.value)}
            >
              {tab.label}
              {count > 0 && (
                <span className={`segmented-control__badge ${tab.value === value ? 'segmented-control__badge--active' : ''}`}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
