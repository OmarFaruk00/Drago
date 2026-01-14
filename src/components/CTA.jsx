import React from 'react'
import './CTA.css'

const CTA = () => {
  return (
    <section id="contact" className="cta">
      <div className="cta-container">
        <div className="cta-content">
          <h2 className="cta-title">
            Ready to Get Started?
          </h2>
          <p className="cta-description">
            Join thousands of satisfied users who have transformed their digital experience with Drago.
          </p>
          <div className="cta-actions">
            <button className="btn btn-primary btn-large">Start Free Trial</button>
            <button className="btn btn-secondary btn-large">Schedule Demo</button>
          </div>
          <p className="cta-note">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  )
}

export default CTA