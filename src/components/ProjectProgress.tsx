import React from 'react'
import '../styles/ProjectProgress.css'

interface ProjectProgressProps {
  completionPercentage: number
}

export const ProjectProgress: React.FC<ProjectProgressProps> = ({ completionPercentage }) => {
  const isComplete = completionPercentage === 100

  return (
    <div className="project-progress">
      <div className="progress-header">
        <span className="progress-label">Completion</span>
        <span className={`progress-value ${isComplete ? 'complete' : ''}`}>
          {Math.round(completionPercentage)}%
        </span>
      </div>
      <div className="progress-bar-container">
        <div
          className={`progress-bar-fill ${isComplete ? 'complete' : ''}`}
          style={{ width: `${completionPercentage}%` }}
        />
      </div>
      {isComplete && <div className="progress-success">✓ Project Complete!</div>}
    </div>
  )
}
