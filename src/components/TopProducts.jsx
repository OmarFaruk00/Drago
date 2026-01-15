import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './TopProducts.css'

const TopProducts = () => {
  const navigate = useNavigate()
  const [selectedProduct, setSelectedProduct] = useState('চীনা বাধাকপি')

  const products = [
    { 
      id: 1, 
      name: 'সবুজ আপেল', 
      price: 14.99, 
      originalPrice: 20.99, 
      rating: 5, 
      badge: 'Sale 50%',
      badgeColor: '#DC143C'
    },
    { 
      id: 2, 
      name: 'তাজা মাল্টা', 
      price: 20.00, 
      originalPrice: null, 
      rating: 5, 
      badge: null,
      badgeColor: null
    },
    { 
      id: 3, 
      name: 'চীনা বাধাকপি', 
      price: 12.00, 
      originalPrice: null, 
      rating: 5, 
      badge: null,
      badgeColor: null
    },
    { 
      id: 4, 
      name: 'সবুজ লেটুস', 
      price: 9.00, 
      originalPrice: null, 
      rating: 5, 
      badge: null,
      badgeColor: null
    },
    { 
      id: 5, 
      name: 'বেগুন', 
      price: 34.00, 
      originalPrice: null, 
      rating: 5, 
      badge: null,
      badgeColor: null
    },
    { 
      id: 6, 
      name: 'বড় আলু', 
      price: 20.00, 
      originalPrice: null, 
      rating: 5, 
      badge: 'Gift Offer',
      badgeColor: '#10b981'
    },
    { 
      id: 7, 
      name: 'ভুট্টা', 
      price: 20.00, 
      originalPrice: null, 
      rating: 5, 
      badge: null,
      badgeColor: null
    },
    { 
      id: 8, 
      name: 'তাজা ফুলকপি', 
      price: 12.00, 
      originalPrice: null, 
      rating: 5, 
      badge: null,
      badgeColor: null
    },
    { 
      id: 9, 
      name: 'সবুজ ক্যাপসিকাম', 
      price: 8.00, 
      originalPrice: 20.00, 
      rating: 5, 
      badge: 'Sale 50%',
      badgeColor: '#DC143C'
    },
    { 
      id: 10, 
      name: 'সবুজ মরিচ', 
      price: 34.00, 
      originalPrice: null, 
      rating: 5, 
      badge: null,
      badgeColor: null
    },
  ]

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
              className={`product-card ${selectedProduct === product.name ? 'selected' : ''}`}
              onClick={() => navigate(`/product/${product.id}`)}
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
              <button className="add-to-cart-btn">
                <span>🛍️</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TopProducts