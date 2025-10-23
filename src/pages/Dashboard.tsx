import { useState, useEffect } from 'react'
import { TaskForm } from '../components/TaskForm'
import { TaskTable } from '../components/TaskTable'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { getTasks, createTask, getTaskStats } from '../lib/tasks'
import type { Task, CreateTaskInput } from '../lib/tasks'
import { getProjects } from '../lib/projects'
import type { Project } from '../lib/projects'
import '../styles/Dashboard.css'

export const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [stats, setStats] = useState({ total: 0, done: 0, in_progress: 0, todo: 0 })
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'todo' | 'in_progress' | 'done'>('all')
  const [projects, setProjects] = useState<Project[]>([])
  const [projectFilter, setProjectFilter] = useState<string>('all')

  const loadTasks = async () => {
    try {
      const [tasksData, statsData, projectsData] = await Promise.all([
        getTasks(),
        getTaskStats(),
        getProjects('active')
      ])
      setTasks(tasksData)
      setStats(statsData)
      setProjects(projectsData)
    } catch (error) {
      console.error('Failed to load tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  const handleCreateTask = async (taskInput: CreateTaskInput) => {
    await createTask(taskInput)
    await loadTasks()
    setShowTaskForm(false)
  }

  let filteredTasks = filter === 'all'
    ? tasks
    : tasks.filter(task => task.status === filter)

  // Apply project filter
  if (projectFilter !== 'all') {
    if (projectFilter === 'none') {
      filteredTasks = filteredTasks.filter(task => !task.project_id)
    } else {
      filteredTasks = filteredTasks.filter(task => task.project_id === projectFilter)
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const completionRate = stats.total > 0
    ? Math.round((stats.done / stats.total) * 100)
    : 0

  return (
    <div className="dashboard-layout">
      <Navbar />

      <main className="dashboard-main">
        <div className="container">
          <section className="hero-section">
            <div className="hero-content">
              <h1 className="hero-title">{getGreeting()}</h1>
              <p className="hero-subtitle">Here's what you need to focus on today</p>
            </div>
            <button onClick={() => setShowTaskForm(true)} className="btn-primary">
              <span className="btn-icon">+</span>
              New Task
            </button>
          </section>

          <section className="stats-section">
            <div className="stats-grid">
              <div className="stat-card stat-primary">
                <div className="stat-label">Overview</div>
                <div className="stat-value">{stats.total}</div>
                <div className="stat-desc">Total Tasks</div>
                <div className="stat-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                  <span className="progress-label">{completionRate}% Complete</span>
                </div>
              </div>

              <div className="stat-card stat-clickable" onClick={() => setFilter('todo')}>
                <div className="stat-label">To Do</div>
                <div className="stat-value">{stats.todo}</div>
                <div className="stat-desc">Waiting to start</div>
                <div className="stat-indicator stat-indicator-todo"></div>
              </div>

              <div className="stat-card stat-clickable" onClick={() => setFilter('in_progress')}>
                <div className="stat-label">In Progress</div>
                <div className="stat-value">{stats.in_progress}</div>
                <div className="stat-desc">Currently working</div>
                <div className="stat-indicator stat-indicator-progress"></div>
              </div>

              <div className="stat-card stat-clickable" onClick={() => setFilter('done')}>
                <div className="stat-label">Done</div>
                <div className="stat-value">{stats.done}</div>
                <div className="stat-desc">Completed</div>
                <div className="stat-indicator stat-indicator-done"></div>
              </div>
            </div>
          </section>

          <section className="tasks-section">
            <div className="section-header">
              <div>
                <h2 className="section-title">Tasks</h2>
                <p className="section-subtitle">
                  {filteredTasks.length} {filter === 'all' ? 'total' : filter.replace('_', ' ')} {filteredTasks.length === 1 ? 'task' : 'tasks'}
                </p>
              </div>

              <div className="filters-container">
                <div className="project-filter">
                  <label htmlFor="project-select">Project:</label>
                  <select
                    id="project-select"
                    value={projectFilter}
                    onChange={(e) => setProjectFilter(e.target.value)}
                    className="project-select"
                  >
                    <option value="all">All Projects</option>
                    <option value="none">Standalone Tasks</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-pills">
                <button
                  className={`pill ${filter === 'all' ? 'pill-active' : ''}`}
                  onClick={() => setFilter('all')}
                >
                  All
                </button>
                <button
                  className={`pill ${filter === 'todo' ? 'pill-active' : ''}`}
                  onClick={() => setFilter('todo')}
                >
                  To Do
                </button>
                <button
                  className={`pill ${filter === 'in_progress' ? 'pill-active' : ''}`}
                  onClick={() => setFilter('in_progress')}
                >
                  In Progress
                </button>
                <button
                  className={`pill ${filter === 'done' ? 'pill-active' : ''}`}
                  onClick={() => setFilter('done')}
                >
                  Done
                </button>
                </div>
              </div>
            </div>

            <div className="tasks-content">
              {loading ? (
                <div className="state-container">
                  <div className="spinner"></div>
                  <p className="state-text">Loading your tasks...</p>
                </div>
              ) : filteredTasks.length === 0 ? (
                <div className="state-container">
                  <div className="empty-illustration">
                    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                      <circle cx="60" cy="60" r="50" fill="#fafafa" stroke="#e5e5e5" strokeWidth="2"/>
                      <path d="M45 60L55 70L75 50" stroke="#0a0a0a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className="empty-title">
                    {filter === 'all' ? 'No tasks yet' : `No ${filter.replace('_', ' ')} tasks`}
                  </h3>
                  <p className="empty-desc">
                    {filter === 'all'
                      ? "Create your first task to start organizing your work"
                      : `You don't have any ${filter.replace('_', ' ')} tasks at the moment`}
                  </p>
                  {filter === 'all' && (
                    <button onClick={() => setShowTaskForm(true)} className="btn-secondary">
                      Create Your First Task
                    </button>
                  )}
                </div>
              ) : (
                <TaskTable tasks={filteredTasks} onTaskUpdate={loadTasks} />
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />

      {showTaskForm && (
        <TaskForm onSubmit={handleCreateTask} onCancel={() => setShowTaskForm(false)} />
      )}
    </div>
  )
}
