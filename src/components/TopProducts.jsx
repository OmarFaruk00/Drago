import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ProductPopup from './ProductPopup'
import './TopProducts.css'

const TopProducts = () => {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  const products = [
    { 
      id: 1, 
      name: 'iPhone 15 Pro', 
      price: 100000, 
      originalPrice: 120000, 
      rating: 5, 
      badge: 'Sale 17%',
      badgeColor: '#DC143C'
    },
    { 
      id: 2, 
      name: 'Samsung Galaxy S24', 
      price: 95000, 
      originalPrice: null, 
      rating: 5, 
      badge: null,
      badgeColor: null
    },
    { 
      id: 3, 
      name: 'MacBook Pro M3', 
      price: 180000, 
      originalPrice: null, 
      rating: 5, 
      badge: null,
      badgeColor: null
    },
    { 
      id: 4, 
      name: 'AirPods Pro 2', 
      price: 25000, 
      originalPrice: null, 
      rating: 5, 
      badge: null,
      badgeColor: null
    },
    { 
      id: 5, 
      name: 'Sony WH-1000XM5', 
      price: 35000, 
      originalPrice: null, 
      rating: 5, 
      badge: null,
      badgeColor: null
    },
    { 
      id: 6, 
      name: 'Apple Watch Series 9', 
      price: 45000, 
      originalPrice: null, 
      rating: 5, 
      badge: 'Gift Offer',
      badgeColor: '#10b981'
    },
    { 
      id: 7, 
      name: 'iPad Pro 12.9"', 
      price: 110000, 
      originalPrice: null, 
      rating: 5, 
      badge: null,
      badgeColor: null
    },
    { 
      id: 8, 
      name: 'PlayStation 5', 
      price: 55000, 
      originalPrice: null, 
      rating: 5, 
      badge: null,
      badgeColor: null
    },
    { 
      id: 9, 
      name: 'Nintendo Switch OLED', 
      price: 40000, 
      originalPrice: null, 
      rating: 5, 
      badge: 'New',
      badgeColor: '#10b981'
    },
    { 
      id: 10, 
      name: 'Xbox Series X', 
      price: 60000, 
      originalPrice: 65000, 
      rating: 5, 
      badge: 'Sale 8%',
      badgeColor: '#DC143C'
    },
  ]

  const handleCardClick = (product) => {
    setSelectedProduct(product)
    setIsPopupOpen(true)
  }

  const handleClosePopup = () => {
    setIsPopupOpen(false)
    setSelectedProduct(null)
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>★</span>
    ))
  }

  return (
    <section className="top-products-section">
      <div className="top-products-container">
        <div className="section-header">
          <h2 className="section-title">Top Products</h2>
          <Link to="/shop" className="view-all-link">View All →</Link>
        </div>
        
        <div className="products-grid">
          {products.map((product) => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => handleCardClick(product)}
              style={{ cursor: 'pointer' }}
            >
              {product.badge && (
                <div 
                  className="product-badge"
                  style={{ backgroundColor: product.badgeColor }}
                >
                  {product.badge}
                </div>
              )}
              <div className="product-image-container">
                <div className="product-image-placeholder">
                  <span>🛒</span>
                </div>
              </div>
              <div className="product-info">
                <div className="product-name">{product.name}</div>
                <div className="product-rating">
                  {renderStars(product.rating)}
                </div>
                <div className="product-pricing">
                  {product.originalPrice && (
                    <span className="original-price">৳{product.originalPrice.toFixed(2)}</span>
                  )}
                  <span className="current-price">৳{product.price.toFixed(2)}</span>
                </div>
              </div>
              <button 
                className="add-to-cart-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  // Handle add to cart
                }}
              >
                <span>🛍️</span>
              </button>
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