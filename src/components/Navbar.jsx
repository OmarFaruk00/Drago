import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import SignInModal from './SignInModal'
import CreateAccountModal from './CreateAccountModal'
import ShoppingCart from './ShoppingCart'
import logoImage from '../images/logo.jpg'
import './Navbar.css'

const Navbar = () => {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)
  const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState([
    { name: 'Fresh Indian Orange', quantity: 1, price: 12.00 },
    { name: 'Green Apple', quantity: 1, price: 14.00 }
  ])
  
  // Hide navbar on SignIn/SignUp pages for mobile
  const isAuthPage = location.pathname === '/signin' || location.pathname === '/signup' || location.pathname === '/register'
  
  const handleRemoveItem = (index) => {
    setCartItems(prev => prev.filter((_, i) => i !== index))
  }
  
  // Categories list
  const categories = [
    { name: 'All Categories', count: 120 },
    { name: 'Smartphones', count: 25 },
    { name: 'Laptops', count: 18 },
    { name: 'Headphones', count: 22 },
    { name: 'Smart Watches', count: 15 },
    { name: 'Tablets', count: 12 },
    { name: 'Cameras', count: 10 },
    { name: 'Speakers', count: 14 },
    { name: 'Gaming', count: 16 },
    { name: 'Accessories', count: 20 },
    { name: 'TV & Audio', count: 12 },
    { name: 'Smart Home', count: 8 },
    { name: 'Wearables', count: 10 }
  ]
  
  // Removed scroll state - nav1 stays sticky with fixed size

  // Show breadcrumb if on shop page or account/create account page
  const isShopPage = location.pathname === '/shop'
  const showBreadcrumb = location.pathname === '/register' || location.pathname === '/create-account'
  
  // Get selected category from localStorage (updated by Shop page)
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  
  useEffect(() => {
    if (isShopPage) {
      // Listen for category changes from Shop page
      const handleCategoryChange = () => {
        const category = localStorage.getItem('selectedCategory') || 'All Categories'
        setSelectedCategory(category)
      }
      
      // Get initial category
      handleCategoryChange()
      
      // Listen for custom event
      window.addEventListener('categoryChanged', handleCategoryChange)
      
      return () => {
        window.removeEventListener('categoryChanged', handleCategoryChange)
      }
    }
  }, [isShopPage])

  // No scroll effects needed - nav1 stays sticky with fixed size

  return (
    <nav className={`navbar ${isAuthPage ? 'hide-on-mobile' : ''}`}>
      {/* Top Bar - Always Fixed */}
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
            <Link to="/" className="logo-container">
              <img src={logoImage} alt="Drago Logo" className="brand-logo-img" />
            </Link>
          </div>
          
          <div className="header-center">
            <div className="search-container">
              <div className="search-input-wrapper">
                <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="11" cy="11" r="8" stroke="black" strokeWidth="2" fill="none"/>
                  <path d="m21 21-4.35-4.35" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <input 
                  type="text" 
                  placeholder="Search Products" 
                  className="search-input"
                />
              </div>
              <button className="search-button">Search</button>
            </div>
          </div>

          <div className="header-right">
            <div className="user-icon" onClick={() => setIsSignInModalOpen(true)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="11" stroke="white" strokeWidth="2" fill="none"/>
                <circle cx="12" cy="8" r="3" stroke="white" strokeWidth="2" fill="none"/>
                <path d="M6 20 C6 16, 8.5 14, 12 14 C15.5 14, 18 16, 18 20" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="header-separator"></div>
            <div className="cart-info" onClick={() => setIsCartOpen(true)}>
              <div className="cart-icon-badge">
                <svg className="cart-icon-symbol" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" stroke="white" strokeWidth="2" fill="none"/>
                  <line x1="3" y1="6" x2="21" y2="6" stroke="white" strokeWidth="2"/>
                  <path d="M16 10a4 4 0 0 1-8 0" stroke="white" strokeWidth="2" fill="none"/>
                </svg>
                <span className="cart-badge">{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>
              <div className="cart-amount">৳{cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Navigation - White Bar */}
      <div className="secondary-nav">
        <div className="secondary-nav-container">
          <div 
            className="categories-wrapper"
            onMouseEnter={() => setIsCategoriesOpen(true)}
            onMouseLeave={() => setIsCategoriesOpen(false)}
          >
            <button 
              className="categories-button" 
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
            >
              <span className="hamburger-icon">☰</span>
              <span>All Categories</span>
              <span className="dropdown-arrow">▼</span>
            </button>
            
            {/* Categories Dropdown */}
            {isCategoriesOpen && (
              <div className="categories-dropdown-menu">
                <ul className="categories-dropdown-list">
                  {categories.map((category, index) => (
                    <li key={index}>
                      <Link 
                        to="/shop" 
                        className="category-dropdown-item"
                        onClick={() => {
                          setIsCategoriesOpen(false)
                          localStorage.setItem('selectedCategory', category.name)
                          window.dispatchEvent(new Event('categoryChanged'))
                        }}
                      >
                        <span className="category-name">{category.name}</span>
                        <span className="category-count">({category.count})</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
            <Link 
              to="/" 
              className="nav-link"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' })
                setIsMobileMenuOpen(false)
              }}
            >
              Home <span>▼</span>
            </Link>
            <Link to="/shop" className="nav-link">Shop <span>▼</span></Link>
            <a href="#pages" className="nav-link">Pages <span>▼</span></a>
            <Link to="/blog" className={`nav-link ${location.pathname === '/blog' ? 'active' : ''}`}>Blog <span>▼</span></Link>
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
      
      {/* Breadcrumb Navigation - Shop Page */}
      {isShopPage && (
        <div className="breadcrumb-nav">
          <div className="breadcrumb-container">
            <Link to="/" className="breadcrumb-item" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <span className="breadcrumb-icon">🏠</span>
              <span>Home</span>
            </Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item">Categories</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">{selectedCategory}</span>
          </div>
        </div>
      )}
      {(location.pathname === '/register' || location.pathname === '/create-account' || isCreateAccountModalOpen) && (
        <div className="breadcrumb-nav">
          <div className="breadcrumb-container">
            <Link to="/" className="breadcrumb-item" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <span className="breadcrumb-icon">🏠</span>
              <span>Home</span>
            </Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item">Account</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">Create Account</span>
          </div>
        </div>
      )}
      {location.pathname === '/dashboard' && (
        <div className="breadcrumb-nav">
          <div className="breadcrumb-container">
            <Link to="/" className="breadcrumb-item" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <span className="breadcrumb-icon">🏠</span>
              <span>Home</span>
            </Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item">Account</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">Dashboard</span>
          </div>
        </div>
      )}
      
      {/* Sign In Modal */}
      <SignInModal 
        isOpen={isSignInModalOpen} 
        onClose={() => setIsSignInModalOpen(false)}
        onSwitchToCreateAccount={() => setIsCreateAccountModalOpen(true)}
      />

      {/* Create Account Modal */}
      <CreateAccountModal 
        isOpen={isCreateAccountModalOpen} 
        onClose={() => setIsCreateAccountModalOpen(false)}
        onSwitchToLogin={() => setIsSignInModalOpen(true)}
      />

      {/* Shopping Cart Sidebar */}
      <ShoppingCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveItem}
      />
    </nav>
  )
}

export default Navbar