import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProject, getProjectStats, updateProject } from '../lib/projects'
import { getTasksByProject, createTask } from '../lib/tasks'
import type { Project } from '../lib/projects'
import type { Task, CreateTaskInput } from '../lib/tasks'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { TaskTable } from '../components/TaskTable'
import { TaskForm } from '../components/TaskForm'
import { ProjectProgress } from '../components/ProjectProgress'
import { TaskStatusDistribution } from '../components/TaskStatusDistribution'
import { ProjectStatusBadge } from '../components/ProjectStatusBadge'
import { ConfirmationDialog } from '../components/ConfirmationDialog'
import '../styles/ProjectDetail.css'

export const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [stats, setStats] = useState({ total: 0, done: 0, in_progress: 0, todo: 0, completionPercentage: 0 })
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; action: string; message: string }>({
    isOpen: false,
    action: '',
    message: '',
  })

  useEffect(() => {
    if (id) {
      loadProjectData()
    }
  }, [id])

  const loadProjectData = async () => {
    if (!id) return

    setLoading(true)
    try {
      const [projectData, tasksData, statsData] = await Promise.all([
        getProject(id),
        getTasksByProject(id),
        getProjectStats(id),
      ])
      setProject(projectData)
      setTasks(tasksData)
      setStats(statsData)
    } catch (error) {
      console.error('Failed to load project data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (taskInput: CreateTaskInput) => {
    if (!id) return
    await createTask({ ...taskInput, project_id: id })
    await loadProjectData()
    setShowTaskForm(false)
  }

  const handleStatusChange = async (newStatus: 'completed' | 'archived' | 'active') => {
    if (!project) return

    const messages = {
      completed: 'Are you sure you want to mark this project as completed?',
      archived: 'Are you sure you want to archive this project? Archived projects can be reactivated later.',
      active: 'Are you sure you want to reactivate this project?',
    }

    setConfirmDialog({
      isOpen: true,
      action: newStatus,
      message: messages[newStatus],
    })
  }

  const confirmStatusChange = async () => {
    if (!project) return

    try {
      await updateProject(project.id, { status: confirmDialog.action as any })
      setConfirmDialog({ isOpen: false, action: '', message: '' })
      await loadProjectData()
    } catch (error) {
      console.error('Failed to update project status:', error)
    }
  }

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Navbar />
        <main className="dashboard-main">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading project...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="dashboard-layout">
        <Navbar />
        <main className="dashboard-main">
          <div className="error-state">
            <h2>Project not found</h2>
            <button onClick={() => navigate('/projects')} className="btn-primary">
              Back to Projects
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="dashboard-layout">
      <Navbar />

      <main className="dashboard-main">
        <div className="container">
          <div className="project-detail-header">
            <button onClick={() => navigate('/projects')} className="back-button">
              ← Back to Projects
            </button>
          </div>

          <section className="project-info-section">
            <div className="project-title-row">
              <div>
                <h1 className="project-title">{project.name}</h1>
                {project.description && (
                  <p className="project-description">{project.description}</p>
                )}
              </div>
              <ProjectStatusBadge status={project.status} />
            </div>

            <div className="project-actions">
              {project.status === 'active' && (
                <button
                  onClick={() => handleStatusChange('completed')}
                  className="btn-secondary"
                >
                  Mark as Completed
                </button>
              )}
              {project.status === 'completed' && (
                <>
                  <button
                    onClick={() => handleStatusChange('active')}
                    className="btn-secondary"
                  >
                    Reactivate
                  </button>
                  <button
                    onClick={() => handleStatusChange('archived')}
                    className="btn-secondary"
                  >
                    Archive Project
                  </button>
                </>
              )}
              {project.status === 'archived' && (
                <button
                  onClick={() => handleStatusChange('active')}
                  className="btn-primary"
                >
                  Reactivate Project
                </button>
              )}
            </div>
          </section>

          <section className="project-stats-section">
            <div className="stats-grid">
              <ProjectProgress completionPercentage={stats.completionPercentage} />
              <TaskStatusDistribution
                todo={stats.todo}
                inProgress={stats.in_progress}
                done={stats.done}
              />
            </div>
          </section>

          <section className="project-tasks-section">
            <div className="section-header">
              <div>
                <h2 className="section-title">Tasks</h2>
                <p className="section-subtitle">
                  {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} in this project
                </p>
              </div>
              {project.status === 'active' && (
                <button onClick={() => setShowTaskForm(true)} className="btn-primary">
                  <span className="btn-icon">+</span>
                  Add Task
                </button>
              )}
            </div>

            <div className="tasks-content">
              {tasks.length === 0 ? (
                <div className="empty-state">
                  <h3>No tasks yet</h3>
                  <p>Add your first task to this project to get started</p>
                  {project.status === 'active' && (
                    <button onClick={() => setShowTaskForm(true)} className="btn-secondary">
                      Create First Task
                    </button>
                  )}
                </div>
              ) : (
                <TaskTable tasks={tasks} onTaskUpdate={loadProjectData} />
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />

      {showTaskForm && (
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setShowTaskForm(false)}
          initialProjectId={id}
        />
      )}

      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        title="Confirm Action"
        message={confirmDialog.message}
        confirmText="Confirm"
        cancelText="Cancel"
        onConfirm={confirmStatusChange}
        onCancel={() => setConfirmDialog({ isOpen: false, action: '', message: '' })}
        variant="info"
      />
    </div>
  )
}
