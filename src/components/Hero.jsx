import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Hero.css'

const Hero = () => {
  const [activeSlide, setActiveSlide] = useState(0)

  return (
    <section id="home" className="hero">
      <div className="hero-container">
        {/* Left Side - Image Block */}
        <div className="hero-image-block">
          <div className="image-container">
            <div className="sale-badge">70% OFF</div>
            <div className="image-placeholder">
              <img 
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=500&fit=crop" 
                alt="Big Sale - Shopping" 
                className="hero-banner-img"
              />
            </div>
          </div>
        </div>

        {/* Right Side - Text and CTA */}
        <div className="hero-content">
          <div className="sale-text-small">Up to 70%</div>
          <h1 className="hero-title">Big Sale</h1>
          <div className="hero-subtitle">Update Your Style</div>
          <p className="hero-description">Discover exclusive offers on new arrivals and update your style effortlessly. Limited-time sale is live. Don&apos;t miss out!</p>
          <Link to="/shop" className="shop-now-button">Shop now</Link>
          
          {/* Carousel Indicators */}
          <div className="carousel-indicators">
            <div className={`indicator ${activeSlide === 0 ? 'active' : ''}`} onClick={() => setActiveSlide(0)}></div>
            <div className={`indicator ${activeSlide === 1 ? 'active' : ''}`} onClick={() => setActiveSlide(1)}></div>
            <div className={`indicator ${activeSlide === 2 ? 'active' : ''}`} onClick={() => setActiveSlide(2)}></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero