import React from 'react'
import type { Project } from '../lib/projects'
import { ProjectCard } from './ProjectCard'
import '../styles/ProjectList.css'

interface ProjectListProps {
  projects: Project[]
  projectStats: Map<string, { taskCount: number; completionPercentage: number }>
  isLoading?: boolean
  onProjectClick: (projectId: string) => void
}

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  projectStats,
  isLoading,
  onProjectClick,
}) => {
  if (isLoading) {
    return <div className="project-list-loading">Loading projects...</div>
  }

  if (projects.length === 0) {
    return (
      <div className="project-list-empty">
        <p>No projects found</p>
        <p className="empty-subtitle">Create your first project to get started</p>
      </div>
    )
  }

  return (
    <div className="project-list">
      {projects.map((project) => {
        const stats = projectStats.get(project.id) || { taskCount: 0, completionPercentage: 0 }
        return (
          <ProjectCard
            key={project.id}
            project={project}
            taskCount={stats.taskCount}
            completionPercentage={stats.completionPercentage}
            onClick={() => onProjectClick(project.id)}
          />
        )
      })}
    </div>
  )
}
