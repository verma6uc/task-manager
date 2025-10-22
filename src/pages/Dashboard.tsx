import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { TaskForm } from '../components/TaskForm'
import { TaskList } from '../components/TaskList'
import { getTasks, createTask, getTaskStats, Task, CreateTaskInput } from '../lib/tasks'
import '../styles/Dashboard.css'

export const Dashboard = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [tasks, setTasks] = useState<Task[]>([])
  const [stats, setStats] = useState({ total: 0, completed: 0, in_progress: 0, pending: 0 })
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [loading, setLoading] = useState(true)

  const loadTasks = async () => {
    try {
      const [tasksData, statsData] = await Promise.all([getTasks(), getTaskStats()])
      setTasks(tasksData)
      setStats(statsData)
    } catch (error) {
      console.error('Failed to load tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const handleCreateTask = async (taskInput: CreateTaskInput) => {
    await createTask(taskInput)
    await loadTasks()
    setShowTaskForm(false)
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Task Manager Dashboard</h1>
          <div className="user-info">
            <span className="user-email">{user?.email}</span>
            <button onClick={handleSignOut} className="signout-button">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="welcome-section">
          <h2>Welcome back!</h2>
          <p>Your task management workspace is ready.</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>My Tasks</h3>
            <p className="card-number">{stats.total}</p>
            <p className="card-description">Total tasks created</p>
          </div>

          <div className="dashboard-card">
            <h3>Completed</h3>
            <p className="card-number">{stats.completed}</p>
            <p className="card-description">Tasks completed</p>
          </div>

          <div className="dashboard-card">
            <h3>In Progress</h3>
            <p className="card-number">{stats.in_progress}</p>
            <p className="card-description">Active tasks</p>
          </div>

          <div className="dashboard-card">
            <h3>Pending</h3>
            <p className="card-number">{stats.pending}</p>
            <p className="card-description">Tasks to start</p>
          </div>
        </div>

        <div className="tasks-section">
          <div className="section-header">
            <h2>Recent Tasks</h2>
            <button onClick={() => setShowTaskForm(true)} className="add-task-button">
              + Add Task
            </button>
          </div>

          {loading ? (
            <div className="empty-state">
              <p>Loading tasks...</p>
            </div>
          ) : (
            <TaskList tasks={tasks} onTaskUpdate={loadTasks} />
          )}
        </div>
      </main>

      {showTaskForm && (
        <TaskForm onSubmit={handleCreateTask} onCancel={() => setShowTaskForm(false)} />
      )}
    </div>
  )
}
