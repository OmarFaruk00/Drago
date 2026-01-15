import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)

  return (
    <nav className="navbar">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="top-bar-container">
          <div className="top-bar-left"></div>
          <div className="top-bar-right">
            <select className="language-selector">
              <option value="eng">Eng</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Header - Red Bar */}
      <div className="main-header">
        <div className="main-header-container">
          <div className="header-left">
            <div className="logo-container">
              <span className="brand-logo">DRAGO</span>
              <span className="cart-icon">🛍️</span>
            </div>
          </div>
          
          <div className="header-center">
            <div className="search-container">
              <input 
                type="text" 
                placeholder="Search Products" 
                className="search-input"
              />
              <button className="search-button">Search</button>
            </div>
          </div>

          <div className="header-right">
            <div className="user-icon">👤</div>
            <div className="cart-info">
              <div className="cart-icon-badge">
                <span className="cart-icon-symbol">🛒</span>
                <span className="cart-badge">2</span>
              </div>
              <span className="cart-text">Shopping cart: ৳57.00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Navigation - White Bar */}
      <div className="secondary-nav">
        <div className="secondary-nav-container">
          <Link to="/shop" className="categories-button" onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}>
            <span className="hamburger-icon">☰</span>
            <span>All Categories</span>
            <span className="dropdown-arrow">▼</span>
          </Link>
          
          <div className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
            <Link to="/" className="nav-link">Home <span>▼</span></Link>
            <Link to="/shop" className="nav-link">Shop <span>▼</span></Link>
            <a href="#pages" className="nav-link">Pages <span>▼</span></a>
            <a href="#blog" className="nav-link">Blog <span>▼</span></a>
            <a href="#about" className="nav-link">About Us <span>▼</span></a>
            <a href="#contact" className="nav-link">Contact Us <span>▼</span></a>
          </div>

          <button 
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar