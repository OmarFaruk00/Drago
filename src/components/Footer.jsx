import React from 'react'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="brand-logo">Drago</span>
            <p className="footer-description">
              Transforming digital experiences with innovative solutions.
            </p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4 className="footer-heading">Product</h4>
              <a href="#features" className="footer-link">Features</a>
              <a href="#pricing" className="footer-link">Pricing</a>
              <a href="#updates" className="footer-link">Updates</a>
            </div>
            <div className="footer-column">
              <h4 className="footer-heading">Company</h4>
              <a href="#about" className="footer-link">About</a>
              <a href="#careers" className="footer-link">Careers</a>
              <a href="#blog" className="footer-link">Blog</a>
            </div>
            <div className="footer-column">
              <h4 className="footer-heading">Support</h4>
              <a href="#help" className="footer-link">Help Center</a>
              <a href="#contact" className="footer-link">Contact</a>
              <a href="#docs" className="footer-link">Documentation</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} Drago. All rights reserved.
          </p>
          <div className="footer-social">
            <a href="#twitter" className="social-link" aria-label="Twitter">Twitter</a>
            <a href="#linkedin" className="social-link" aria-label="LinkedIn">LinkedIn</a>
            <a href="#github" className="social-link" aria-label="GitHub">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer