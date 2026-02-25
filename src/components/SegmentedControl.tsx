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
}

export default function SegmentedControl({ value, onChange }: SegmentedControlProps) {
  return (
    <div className="segmented-control">
      <div className="segmented-control__track">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            className={`segmented-control__tab ${tab.value === value ? 'segmented-control__tab--active' : ''}`}
            onClick={() => onChange(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}
