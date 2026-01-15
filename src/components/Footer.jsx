import React from 'react'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      {/* Top Section - Dark Gray with Logo */}
      <div className="footer-top">
        <div className="footer-top-container">
          <div className="footer-red-line"></div>
          <div className="footer-logo-section">
            <div className="footer-logo">
              <span className="cart-icon">🛒</span>
              <span className="footer-logo-text">DRAGO</span>
            </div>
          </div>
          <div className="footer-red-line"></div>
        </div>
      </div>

      {/* Middle Section - Dark Green with 5 Columns */}
      <div className="footer-middle">
        <div className="footer-middle-container">
          {/* About Drago */}
          <div className="footer-column">
            <h3 className="footer-heading">About Drago</h3>
            <p className="footer-description">
              Morbi cursus porttitor enim lobortis molestie. Duis gravida turpis dui, eget bibendum magna congue nec.
            </p>
            <div className="footer-contact">
              <a href="tel:01845678543" className="contact-link">01845678543</a>
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

          {/* Instagram */}
          <div className="footer-column">
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
      </div>

      {/* Bottom Section - Dark Green with Social, Copyright, Payment */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          {/* Social Media Icons */}
          <div className="social-icons">
            <a href="#facebook" className="social-icon facebook">f</a>
            <a href="#twitter" className="social-icon twitter">🐦</a>
            <a href="#pinterest" className="social-icon pinterest">P</a>
            <a href="#instagram" className="social-icon instagram">📷</a>
          </div>

          {/* Copyright */}
          <div className="footer-copyright">
            dragoeCommerce © {new Date().getFullYear()}. All Rights Reserved
          </div>

          {/* Payment Methods */}
          <div className="payment-logos">
            <span className="payment-logo">Pay</span>
            <span className="payment-logo">VISA</span>
            <span className="payment-logo">DISCOVER</span>
            <span className="payment-logo">Mastercard</span>
            <span className="payment-secure">🔒 Secure Payment</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer