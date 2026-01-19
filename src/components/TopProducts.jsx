import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './TopProducts.css'

const TopProducts = () => {
  const navigate = useNavigate()
  const [selectedProduct, setSelectedProduct] = useState('iPhone 15 Pro')

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