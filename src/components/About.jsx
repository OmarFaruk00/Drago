import React from 'react'
import './About.css'

const About = () => {
  return (
    <section id="about" className="about">
      <div className="about-container">
        <div className="about-content">
          <div className="about-text">
            <h2 className="section-title">
              Built for the <span className="gradient-text">Future</span>
            </h2>
            <p className="about-description">
              Drago represents the next generation of digital solutions. We combine 
              innovative technology with thoughtful design to create products that 
              not only meet but exceed expectations.
            </p>
            <p className="about-description">
              Our mission is to empower businesses and individuals with tools that 
              simplify complexity and unlock new possibilities.
            </p>
            <div className="about-features">
              <div className="about-feature-item">
                <span className="check-icon">✓</span>
                <span>Industry-leading technology</span>
              </div>
              <div className="about-feature-item">
                <span className="check-icon">✓</span>
                <span>Dedicated support team</span>
              </div>
              <div className="about-feature-item">
                <span className="check-icon">✓</span>
                <span>Continuous updates & improvements</span>
              </div>
            </div>
            <button className="btn btn-primary">Learn More About Us</button>
          </div>
          <div className="about-image">
            <div className="about-placeholder">
              <div className="placeholder-content">
                <span>📸</span>
                <p>About Image</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About