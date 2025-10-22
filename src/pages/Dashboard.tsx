import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import '../styles/Dashboard.css'

export const Dashboard = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
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
            <p className="card-number">0</p>
            <p className="card-description">Total tasks created</p>
          </div>

          <div className="dashboard-card">
            <h3>Completed</h3>
            <p className="card-number">0</p>
            <p className="card-description">Tasks completed</p>
          </div>

          <div className="dashboard-card">
            <h3>In Progress</h3>
            <p className="card-number">0</p>
            <p className="card-description">Active tasks</p>
          </div>

          <div className="dashboard-card">
            <h3>Pending</h3>
            <p className="card-number">0</p>
            <p className="card-description">Tasks to start</p>
          </div>
        </div>

        <div className="tasks-section">
          <div className="section-header">
            <h2>Recent Tasks</h2>
            <button className="add-task-button">+ Add Task</button>
          </div>
          <div className="empty-state">
            <p>No tasks yet. Create your first task to get started!</p>
          </div>
        </div>
      </main>
    </div>
  )
}
