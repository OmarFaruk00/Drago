import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Footer.css'

const Footer = () => {
  const location = useLocation()
  const isAuthPage = location.pathname === '/signin' || location.pathname === '/signup' || location.pathname === '/register'
  
  return (
    <footer className={`footer ${isAuthPage ? 'hide-on-mobile' : ''}`}>
      {/* Middle Section - Dark Gray with Columns */}
      <div className="footer-middle">
        <div className="footer-middle-container">
          {/* About Drago - Left Column with Logo */}
          <div className="footer-column footer-column-logo">
            <Link to="/" className="footer-logo-link">
              <img src="/logo.png" alt="Drago Logo" className="footer-logo-img" />
            </Link>
            <p className="footer-description">
              Morbi cursus porttitor enim lobortis molestie. Duis gravida turpis dui, eget bibendum magna congue nec.
            </p>
            <div className="footer-contact">
              <a href="tel:+880178664389" className="contact-link">+880178664389</a>
              <span className="contact-or">or</span>
              <a href="mailto:drago@gmail.com" className="contact-link">drago@gmail.com</a>
            </div>
          </div>

          {/* My Account */}
          <div className="footer-column">
            <h3 className="footer-heading">My Account</h3>
            <ul className="footer-links">
              <li><a href="#my-account">My Account</a></li>
              <li><a href="#order-history">Order History</a></li>
              <li><a href="#shopping-cart">Shoping Cart</a></li>
              <li><a href="#wishlist">Wishlist</a></li>
              <li><a href="#settings">Settings</a></li>
            </ul>
          </div>

          {/* Helps */}
          <div className="footer-column">
            <h3 className="footer-heading">Helps</h3>
            <ul className="footer-links">
              <li><a href="#contact">Contact</a></li>
              <li><a href="#faqs">Faqs</a></li>
              <li><a href="#terms">Terms & Condition</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Proxy */}
          <div className="footer-column">
            <h3 className="footer-heading">Proxy</h3>
            <ul className="footer-links">
              <li><a href="#about">About</a></li>
              <li><a href="#shop">Shop</a></li>
              <li><a href="#product">Product</a></li>
              <li><a href="#products-details">Products Details</a></li>
              <li><a href="#track-order">Track Order</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-column">
            <h3 className="footer-heading">Categories</h3>
            <ul className="footer-links">
              <li><a href="#smartphones">Smartphones</a></li>
              <li><a href="#laptops">Laptops</a></li>
              <li><a href="#headphones">Headphones</a></li>
              <li><a href="#gaming">Gaming</a></li>
            </ul>
          </div>

          {/* Follow Us / Instagram */}
          <div className="footer-column">
            <h3 className="footer-heading desktop-heading">Instagram</h3>
            <h3 className="footer-heading mobile-heading">Follow Us</h3>
            <div className="instagram-grid">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="instagram-item">
                  <span>📷</span>
                </div>
              ))}
            </div>
            <div className="social-icons-mobile">
              <a href="#facebook" className="social-icon facebook">f</a>
              <a href="#instagram" className="social-icon instagram">📷</a>
              <a href="#youtube" className="social-icon youtube">▶</a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Dark Green with Social, Copyright, Payment */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          {/* Social Media Icons */}
          <div className="social-icons">
            <a href="#facebook" className="social-icon facebook">f</a>
            <a href="#instagram" className="social-icon instagram">📷</a>
            <a href="#youtube" className="social-icon youtube">▶</a>
          </div>

          {/* Help and About Us Links */}
          <div className="footer-help-links">
            <a href="#help" className="help-link">Help</a>
            <span className="link-separator">|</span>
            <a href="#about" className="help-link">About Us</a>
          </div>

          {/* Payment Methods */}
          <div className="payment-logos">
            <span className="payment-logo">Pay</span>
            <span className="payment-logo">VISA</span>
            <span className="payment-logo">DISCOVER</span>
            <span className="payment-logo">Mastercard</span>
            <span className="payment-secure">🔒 Secure Payment</span>
          </div>

          {/* Copyright */}
          <div className="footer-copyright">
            dragoeCommerce © {new Date().getFullYear()}. All Rights Reserved
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer