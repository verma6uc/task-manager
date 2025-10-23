import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProjects, createProject, getProjectStats } from '../lib/projects'
import type { Project, ProjectStatus, CreateProjectInput, UpdateProjectInput } from '../lib/projects'
import { ProjectList } from '../components/ProjectList'
import { ProjectForm } from '../components/ProjectForm'
import '../styles/Projects.css'

export const Projects: React.FC = () => {
  const navigate = useNavigate()
  const [projects, setProjects] = useState<Project[]>([])
  const [projectStats, setProjectStats] = useState<Map<string, any>>(new Map())
  const [activeTab, setActiveTab] = useState<ProjectStatus>('active')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadProjects()
  }, [activeTab])

  const loadProjects = async () => {
    setIsLoading(true)
    try {
      const data = await getProjects(activeTab)
      setProjects(data)

      // Load stats for each project
      const statsMap = new Map()
      for (const project of data) {
        try {
          const stats = await getProjectStats(project.id)
          statsMap.set(project.id, {
            taskCount: stats.total,
            completionPercentage: stats.completionPercentage,
          })
        } catch (err) {
          console.error(`Failed to load stats for project ${project.id}:`, err)
        }
      }
      setProjectStats(statsMap)
    } catch (error) {
      console.error('Failed to load projects:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateProject = async (input: CreateProjectInput | UpdateProjectInput) => {
    try {
      await createProject(input as CreateProjectInput)
      setIsFormOpen(false)
      loadProjects()
    } catch (error) {
      console.error('Failed to create project:', error)
      throw error
    }
  }

  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`)
  }

  const filteredProjects = projects.filter(p => p.status === activeTab)

  return (
    <div className="projects-page">
      <div className="projects-header">
        <h1>Projects</h1>
        <button className="btn-primary" onClick={() => setIsFormOpen(true)}>
          + New Project
        </button>
      </div>

      <div className="projects-tabs">
        <button
          className={`tab ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Active
          {!isLoading && (
            <span className="tab-count">
              {projects.filter(p => p.status === 'active').length}
            </span>
          )}
        </button>
        <button
          className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed
          {!isLoading && (
            <span className="tab-count">
              {projects.filter(p => p.status === 'completed').length}
            </span>
          )}
        </button>
        <button
          className={`tab ${activeTab === 'archived' ? 'active' : ''}`}
          onClick={() => setActiveTab('archived')}
        >
          Archived
          {!isLoading && (
            <span className="tab-count">
              {projects.filter(p => p.status === 'archived').length}
            </span>
          )}
        </button>
      </div>

      <ProjectList
        projects={filteredProjects}
        projectStats={projectStats}
        isLoading={isLoading}
        onProjectClick={handleProjectClick}
      />

      <ProjectForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateProject}
        mode="create"
      />
    </div>
  )
}
