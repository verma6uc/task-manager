import React, { useState, useEffect } from 'react'
import { getProjects } from '../lib/projects'
import type { Project } from '../lib/projects'
import type { TaskStatus, TaskPriority } from '../lib/tasks'
import '../styles/TaskFilters.css'

export interface TaskFiltersState {
  status?: TaskStatus
  priority?: TaskPriority
  projectId?: string
}

interface TaskFiltersProps {
  filters: TaskFiltersState
  onFiltersChange: (filters: TaskFiltersState) => void
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({ filters, onFiltersChange }) => {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const allProjects = await getProjects()
      setProjects(allProjects)
    } catch (err) {
      console.error('Failed to load projects:', err)
    }
  }

  const handleStatusChange = (status: string) => {
    onFiltersChange({
      ...filters,
      status: status === '' ? undefined : (status as TaskStatus),
    })
  }

  const handlePriorityChange = (priority: string) => {
    onFiltersChange({
      ...filters,
      priority: priority === '' ? undefined : (priority as TaskPriority),
    })
  }

  const handleProjectChange = (projectId: string) => {
    onFiltersChange({
      ...filters,
      projectId: projectId === '' ? undefined : projectId,
    })
  }

  const handleClearFilters = () => {
    onFiltersChange({})
  }

  const hasActiveFilters = filters.status || filters.priority || filters.projectId

  return (
    <div className="task-filters">
      <div className="filters-row">
        <div className="filter-group">
          <label htmlFor="filter-status">Status</label>
          <select
            id="filter-status"
            value={filters.status || ''}
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filter-priority">Priority</label>
          <select
            id="filter-priority"
            value={filters.priority || ''}
            onChange={(e) => handlePriorityChange(e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filter-project">Project</label>
          <select
            id="filter-project"
            value={filters.projectId || ''}
            onChange={(e) => handleProjectChange(e.target.value)}
          >
            <option value="">All Projects</option>
            <option value="none">No Project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <button className="clear-filters-btn" onClick={handleClearFilters}>
            Clear Filters
          </button>
        )}
      </div>
    </div>
  )
}
