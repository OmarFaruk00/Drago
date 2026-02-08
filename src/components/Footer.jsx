import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import logoImage from '../images/logo.png'
import './Footer.css'

const Footer = () => {
  const location = useLocation()
  const isAuthPage = location.pathname === '/signin' || location.pathname === '/signup' || location.pathname === '/register'
  
  return (
    <footer className={`footer ${isAuthPage ? 'hide-on-mobile' : ''}`}>
      {/* Top Section - 6 Columns */}
      <div className="footer-middle">
        <div className="footer-middle-container">
          {/* Column 1: About Drago */}
          <div className="footer-column footer-column-logo">
            <Link to="/" className="footer-logo-link">
              <img src={logoImage} alt="Drago Logo" className="footer-logo-img" />
            </Link>
            <h3 className="footer-heading">About Drago</h3>
            <p className="footer-description">
              Drago is a trusted online shop in Bangladesh. Where you will find all the products of fashion, electronics, and other daily life only at Drago.
            </p>
            <div className="footer-contact">
              <a href="tel:+880192305628" className="contact-link">+88 0192305628</a>
              <a href="mailto:drago.com.bd@gmail.com" className="contact-link">drago.com.bd@gmail.com</a>
            </div>
          </div>

          {/* Column 2: About Us */}
          <div className="footer-column">
            <h3 className="footer-heading">About Us</h3>
            <ul className="footer-links">
              <li><Link to="/about" className="footer-link">Our Mission & Vision</Link></li>
              <li><a href="#why-choose-us" className="footer-link">Why Choose Us</a></li>
              <li><a href="#terms" className="footer-link">Terms & Condition</a></li>
              <li><Link to="/blog" className="footer-link">Blog</Link></li>
              <li><a href="#faqs" className="footer-link">Faqs</a></li>
            </ul>
          </div>

          {/* Column 3: Account */}
          <div className="footer-column">
            <h3 className="footer-heading">Account</h3>
            <ul className="footer-links">
              <li><Link to="/dashboard" className="footer-link">My Account</Link></li>
              <li><Link to="/signin" className="footer-link">Login/Register</Link></li>
              <li><Link to="/shop" className="footer-link">Cart</Link></li>
              <li><Link to="/shop" className="footer-link">Shop</Link></li>
              <li><a href="#product" className="footer-link">Product</a></li>
              <li><a href="#wishlist" className="footer-link">Wishlist</a></li>
            </ul>
          </div>

          {/* Column 4: Privacy & Policy */}
          <div className="footer-column">
            <h3 className="footer-heading">Privacy & Policy</h3>
            <ul className="footer-links">
              <li><a href="#delivery" className="footer-link">Delivery Policy</a></li>
              <li><a href="#return" className="footer-link">Return Policy</a></li>
              <li><a href="#refund" className="footer-link">Refund Policy</a></li>
              <li><a href="#cancellation" className="footer-link">Cancellation Policy</a></li>
              <li><a href="#privacy" className="footer-link">Privacy Policy</a></li>
              <li><a href="#warranty" className="footer-link">Warranty Policy</a></li>
            </ul>
          </div>

          {/* Column 5: Help & Support */}
          <div className="footer-column">
            <h3 className="footer-heading">Help & Support</h3>
            <div className="footer-support">
              <p className="support-address">kendua - Ishwargonj Road, Mymensingh, 2280</p>
              <p className="support-phone">
                <a href="tel:+880192305628" className="contact-link">+88 01923035628</a><br />
                <a href="tel:+8801627975945" className="contact-link">+88 01627975945</a>
              </p>
              <a href="mailto:drago.com.bd@gmail.com" className="contact-link">drago.com.bd@gmail.com</a>
            </div>
          </div>

          {/* Column 6: Instagram */}
          <div className="footer-column">
            <h3 className="footer-heading">Instagram</h3>
            <div className="instagram-grid">
              <a href="#ig1" className="instagram-item" aria-label="Instagram post 1">
                <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&h=150&fit=crop" alt="" />
              </a>
              <a href="#ig2" className="instagram-item" aria-label="Instagram post 2">
                <img src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=150&h=150&fit=crop" alt="" />
              </a>
              <a href="#ig3" className="instagram-item" aria-label="Instagram post 3">
                <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=150&h=150&fit=crop" alt="" />
              </a>
              <a href="#ig4" className="instagram-item" aria-label="Instagram post 4">
                <img src="https://images.unsplash.com/photo-1570841548792-7bfc28da1fda?w=150&h=150&fit=crop" alt="" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section - Follow Us & Payment */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <div className="footer-follow-payment">
            <div className="follow-section">
              <h3 className="follow-heading">Follow Us</h3>
              <div className="social-icons">
                <a href="#facebook" className="social-icon facebook" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#youtube" className="social-icon youtube" aria-label="YouTube">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
                <a href="#pinterest" className="social-icon pinterest" aria-label="Pinterest">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z"/></svg>
                </a>
                <a href="#instagram" className="social-icon instagram" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.53.072 2.718.272.273 2.69.073 7.53.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.48.2 4.82 2.618 7.273 7.458 7.454.813.058 1.222.072 4.47.072 3.25 0 3.668-.014 4.47-.072 4.841-.2 7.256-2.618 7.454-7.454.058-.812.072-1.221.072-4.47 0-3.248-.014-3.667-.072-4.47-.2-4.82-2.618-7.273-7.458-7.454C15.668.014 15.259 0 12 0z"/><path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8z"/><circle cx="18.406" cy="5.594" r="1.44"/></svg>
                </a>
              </div>
            </div>
            <div className="payment-logos">
              <span className="payment-logo">Apple Pay</span>
              <span className="payment-logo">VISA</span>
              <span className="payment-logo">DISCOVER</span>
              <span className="payment-logo">Mastercard</span>
            </div>
          </div>

          <div className="footer-copyright">
            drago © {new Date().getFullYear()}. All Rights Reserved
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
