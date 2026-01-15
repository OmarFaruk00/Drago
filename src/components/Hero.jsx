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
              <div className="illustration-placeholder">
                <span>👩‍🦱👩</span>
                <p>Image Placeholder</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Text and CTA */}
        <div className="hero-content">
          <div className="sale-text-small">UP TO 70%</div>
          <h1 className="hero-title">Big Sale</h1>
          <div className="hero-subtitle">Happening Now</div>
          <Link to="/shop" className="shop-now-button">Shop now →</Link>
        </div>
      </div>

      {/* Carousel Indicators */}
      <div className="carousel-indicators">
        <span 
          className={`indicator ${activeSlide === 0 ? 'active' : ''}`}
          onClick={() => setActiveSlide(0)}
        ></span>
        <span 
          className={`indicator ${activeSlide === 1 ? 'active' : ''}`}
          onClick={() => setActiveSlide(1)}
        ></span>
        <span 
          className={`indicator ${activeSlide === 2 ? 'active' : ''}`}
          onClick={() => setActiveSlide(2)}
        ></span>
      </div>
    </section>
  )
}

export default Hero