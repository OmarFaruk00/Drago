import React from 'react'
import './Features.css'

const Features = () => {
  const features = [
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Optimized for speed and performance, delivering instant results for your users.'
    },
    {
      icon: '🎨',
      title: 'Beautiful Design',
      description: 'Modern, intuitive interface that creates an exceptional user experience.'
    },
    {
      icon: '🔒',
      title: 'Secure & Safe',
      description: 'Enterprise-grade security to protect your data and privacy.'
    },
    {
      icon: '📱',
      title: 'Fully Responsive',
      description: 'Perfect experience on all devices - desktop, tablet, and mobile.'
    },
    {
      icon: '🚀',
      title: 'Easy Integration',
      description: 'Simple setup and seamless integration with your existing workflow.'
    },
    {
      icon: '💎',
      title: 'Premium Quality',
      description: 'Built with attention to detail and commitment to excellence.'
    }
  ]

  return (
    <section id="features" className="features">
      <div className="features-container">
        <div className="features-header">
          <h2 className="section-title">Why Choose Drago?</h2>
          <p className="section-description">
            Everything you need to succeed in the digital world
          </p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features