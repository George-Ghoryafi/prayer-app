import './FAB.css'

interface FABProps {
  onClick?: () => void
}

export default function FAB({ onClick }: FABProps) {
  return (
    <button className="fab" type="button" aria-label="Add new prayer" onClick={onClick}>
      <span className="fab__icon">+</span>
    </button>
  )
}
