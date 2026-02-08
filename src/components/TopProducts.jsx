import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ProductPopup from './ProductPopup'
import starIcon from '../images/icons/star.png'
import bagIcon from '../images/icons/cart-bag.svg'
import './TopProducts.css'

const TopProducts = () => {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [selectedCardId, setSelectedCardId] = useState(null)

  /* Two layers, 4 cards per row, 8 cards total - uniform sizes */
  const products = [
    { id: 1, name: 'Galaxy S25 Ultra 5G', price: 14.99, originalPrice: 19.99, rating: 5 },
    { id: 2, name: 'Bluetooth Earbuds', price: 14.99, originalPrice: 19.99, rating: 5 },
    { id: 3, name: 'HD Smart LED TV 43"', price: 319.99, originalPrice: 349.99, rating: 5 },
    { id: 4, name: 'Power Bank 20000mAh', price: 24.99, originalPrice: 29.99, rating: 5 },
    { id: 5, name: 'Gaming Headset Pro', price: 59.99, originalPrice: 79.99, rating: 5 },
    { id: 6, name: 'Fast Charger Adapter', price: 19.99, originalPrice: 24.99, rating: 5 },
    { id: 7, name: 'USB-C Multiport Hub', price: 29.99, originalPrice: 34.99, rating: 5 },
    { id: 8, name: 'Smart Watch Series X', price: 9.99, originalPrice: 14.99, rating: 5 },
  ]

  const handleCardClick = (product) => {
    setSelectedProduct(product)
    setIsPopupOpen(true)
    setSelectedCardId(product.id)
  }

  const handleClosePopup = () => {
    setIsPopupOpen(false)
    setSelectedProduct(null)
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <img key={i} src={starIcon} alt="" className={`star star-img ${i < rating ? 'filled' : ''}`} />
    ))
  }

  return (
    <section className="top-products-section">
      <div className="top-products-container">
        <div className="section-header">
          <h2 className="section-title">Top Products</h2>
          <Link to="/shop" className="view-all-link">See All Products →</Link>
        </div>
        <div className="products-grid">
          {products.map((product) => (
            <div
              key={product.id}
              className={`product-card ${selectedCardId === product.id ? 'selected' : ''}`}
              onClick={() => handleCardClick(product)}
              style={{ cursor: 'pointer' }}
            >
              <div className="product-image-container">
                <div className="product-image-placeholder">
                  <span>🛒</span>
                </div>
              </div>
              <div className="product-info">
                <div className="product-name">{product.name}</div>
                <div className="product-pricing">
                  <span className="current-price">৳{product.price.toFixed(2)}</span>
                  {product.originalPrice && (
                    <span className="original-price">৳{product.originalPrice.toFixed(2)}</span>
                  )}
                </div>
                <div className="stars-and-bag-row">
                  <div className="product-rating">
                    {renderStars(product.rating)}
                  </div>
                  <button
                    className="add-to-cart-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                    aria-label="Add to cart"
                  >
                    <img src={bagIcon} alt="" className="bag-icon-img" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Popup */}
      <ProductPopup 
        product={selectedProduct}
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
      />
    </section>
  )
}

export default TopProducts