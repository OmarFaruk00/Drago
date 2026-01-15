import React from 'react'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      {/* Top Green Header Strip */}
      <div className="footer-header">
        <div className="footer-header-container">
          <div className="footer-logo">
            <span className="cart-icon">🛒</span>
            <span className="footer-logo-text">DRAGO</span>
          </div>
        </div>
      </div>

      {/* Main Dark Gray Content Area */}
      <div className="footer-main">
        <div className="footer-main-container">
          {/* Left Column */}
          <div className="footer-left">
            {/* About Drago */}
            <div className="footer-section">
              <h3 className="footer-heading">About Drago</h3>
              <p className="footer-description">
                Morbi cursus porttitor enim lobortis molestie. Duis gravida turpis dui, eget bibendum magna congue nec.
              </p>
              <div className="footer-contact">
                <a href="tel:01845678543" className="contact-link">01845678543</a>
                <a href="mailto:drago@gmail.com" className="contact-link">drago@gmail.com</a>
              </div>
            </div>

            {/* Proxy */}
            <div className="footer-section">
              <h3 className="footer-heading">Proxy</h3>
              <ul className="footer-links">
                <li><a href="#about">About</a></li>
                <li><a href="#shop">Shop</a></li>
                <li><a href="#product">Product</a></li>
                <li><a href="#products-details">Products Details</a></li>
                <li><a href="#track-order">Track Order</a></li>
              </ul>
            </div>

            {/* Red Divider */}
            <div className="footer-divider"></div>

            {/* Instagram */}
            <div className="footer-section">
              <h3 className="footer-heading">Instagram</h3>
              <div className="instagram-grid">
                {Array.from({ length: 8 }, (_, i) => (
                  <div key={i} className="instagram-item">
                    <span>📷</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="footer-right">
            {/* My Account */}
            <div className="footer-section">
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
            <div className="footer-section">
              <h3 className="footer-heading">Helps</h3>
              <ul className="footer-links">
                <li><a href="#contact">Contact</a></li>
                <li><a href="#faqs">Faqs</a></li>
                <li><a href="#terms">Terms & Condition</a></li>
                <li><a href="#privacy">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Green Footer Strip */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          {/* Social Media Icons */}
          <div className="social-icons">
            <a href="#facebook" className="social-icon facebook">f</a>
            <a href="#twitter" className="social-icon twitter">🐦</a>
            <a href="#pinterest" className="social-icon pinterest">P</a>
            <a href="#instagram" className="social-icon instagram">📷</a>
          </div>

          {/* Payment Logos */}
          <div className="payment-logos">
            <span className="payment-logo">Apple Pay</span>
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