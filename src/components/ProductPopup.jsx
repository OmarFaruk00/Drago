import React from 'react'
import cartCheckIcon from '../images/icons/cart-check.svg'
import starIcon from '../images/icons/star.png'
import './ProductPopup.css'

const ProductPopup = ({ product, isOpen, onClose }) => {
  if (!isOpen || !product) return null

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <img key={i} src={starIcon} alt="" className={`popup-star star-img ${i < rating ? 'filled' : ''}`} />
    ))
  }

  return (
    <div className="product-popup-overlay" onClick={handleOverlayClick}>
      <div className="product-popup-content">
        <button className="popup-close-btn" onClick={onClose}>×</button>
        
        <div className="popup-product-container">
          <div className="popup-image-section">
            <div className="popup-image-placeholder">
              {product.badge && (
                <div 
                  className="popup-badge"
                  style={{ backgroundColor: product.badgeColor }}
                >
                  {product.badge}
                </div>
              )}
              <span>🛒</span>
            </div>
          </div>
          
          <div className="popup-info-section">
            <h2 className="popup-product-name">{product.name}</h2>
            
            <div className="popup-rating">
              {renderStars(product.rating)}
              <span className="popup-rating-text">({product.rating})</span>
            </div>
            
            <div className="popup-pricing">
              <>
                {product.originalPrice && (
                  <span className="popup-original-price">৳{product.originalPrice.toFixed(2)}</span>
                )}
                <span className="popup-current-price">৳{product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="popup-discount">
                    Save ৳{(product.originalPrice - product.price).toFixed(2)}
                  </span>
                )}
              </>
            </div>
            
            <div className="popup-description">
              <p>Experience the latest in technology with this premium product. Features cutting-edge design and superior performance.</p>
            </div>
            
            <div className="popup-actions">
              <button className="popup-add-to-cart-btn">
                <img src={cartCheckIcon} alt="" className="popup-cart-icon-img" />
                Add to Cart
              </button>
              <button className="popup-buy-now-btn">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPopup
