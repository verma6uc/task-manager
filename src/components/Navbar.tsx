import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import '../styles/Navbar.css'

export const Navbar = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <div className="brand-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="3" y="3" width="18" height="18" rx="4" stroke="white" strokeWidth="2"/>
            </svg>
          </div>
          <span className="brand-text">TaskManager</span>
        </div>

        <div className="navbar-actions">
          <div className="user-menu">
            <div className="user-avatar-small">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <span className="user-email-nav">{user?.email}</span>
          </div>
          <button onClick={handleSignOut} className="nav-button">
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  )
}
