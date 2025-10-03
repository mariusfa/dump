interface DevJourneyProps {
  onClose: () => void
}

export function DevJourney({ onClose }: DevJourneyProps) {
  return (
    <div className="dev-journey-overlay" onClick={onClose}>
      <div className="dev-journey-modal" onClick={(e) => e.stopPropagation()}>
        <button className="dev-journey-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <div className="dev-journey-content">
          <img 
            src="/dev-journey.svg" 
            alt="DUMP Development Journey - Visual timeline showing the progression from initial idea to final gradient design"
            className="dev-journey-svg"
          />
        </div>
      </div>
    </div>
  )
}
