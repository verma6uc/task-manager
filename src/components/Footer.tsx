import '../styles/Footer.css'

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <p className="footer-text">© {currentYear} TaskManager. All rights reserved.</p>
        </div>
        <div className="footer-right">
          <a href="#" className="footer-link">Privacy</a>
          <span className="footer-divider">•</span>
          <a href="#" className="footer-link">Terms</a>
          <span className="footer-divider">•</span>
          <a href="#" className="footer-link">Help</a>
        </div>
      </div>
    </footer>
  )
}
