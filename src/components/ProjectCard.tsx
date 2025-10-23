import React from 'react'
import type { Project } from '../lib/projects'
import { ProjectStatusBadge } from './ProjectStatusBadge'
import '../styles/ProjectCard.css'

interface ProjectCardProps {
  project: Project
  taskCount?: number
  completionPercentage?: number
  onClick?: () => void
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  taskCount = 0,
  completionPercentage = 0,
  onClick,
}) => {
  return (
    <div className="project-card" onClick={onClick}>
      <div className="project-card-header">
        <h3>{project.name}</h3>
        <ProjectStatusBadge status={project.status} />
      </div>

      {project.description && (
        <p className="project-card-description">{project.description}</p>
      )}

      <div className="project-card-stats">
        <div className="stat-item">
          <span className="stat-label">Tasks</span>
          <span className="stat-value">{taskCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Progress</span>
          <span className="stat-value">{Math.round(completionPercentage)}%</span>
        </div>
      </div>

      <div className="project-card-progress-bar">
        <div
          className="project-card-progress-fill"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>

      <div className="project-card-footer">
        <span className="project-card-date">
          Updated {new Date(project.updated_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  )
}
