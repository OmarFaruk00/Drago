import React, { useState } from 'react'
import './TopProducts.css'

const TopProducts = () => {
  const [selectedProduct, setSelectedProduct] = useState('Chinese cabbage')

  const products = [
    { 
      id: 1, 
      name: 'Green Apple', 
      price: 14.99, 
      originalPrice: 20.99, 
      rating: 5, 
      badge: 'Sale 50%',
      badgeColor: '#DC143C'
    },
    { 
      id: 2, 
      name: 'Fresh Indian Malta', 
      price: 20.00, 
      originalPrice: null, 
      rating: 5, 
      badge: null,
      badgeColor: null
    },
    { 
      id: 3, 
      name: 'Chinese cabbage', 
      price: 12.00, 
      originalPrice: null, 
      rating: 5, 
      badge: null,
      badgeColor: null
    },
    { 
      id: 4, 
      name: 'Green Lettuce', 
      price: 9.00, 
      originalPrice: null, 
      rating: 5, 
      badge: null,
      badgeColor: null
    },
    { 
      id: 5, 
      name: 'Eggplant', 
      price: 34.00, 
      originalPrice: null, 
      rating: 5, 
      badge: null,
      badgeColor: null
    },
    { 
      id: 6, 
      name: 'Big Potatoes', 
      price: 20.00, 
      originalPrice: null, 
      rating: 5, 
      badge: 'Gift Offer',
      badgeColor: '#10b981'
    },
    { 
      id: 7, 
      name: 'Corn', 
      price: 20.00, 
      originalPrice: null, 
      rating: 5, 
      badge: null,
      badgeColor: null
    },
    { 
      id: 8, 
      name: 'Fresh Cauliflower', 
      price: 12.00, 
      originalPrice: null, 
      rating: 5, 
      badge: null,
      badgeColor: null
    },
    { 
      id: 9, 
      name: 'Green Capsicum', 
      price: 8.00, 
      originalPrice: 20.00, 
      rating: 5, 
      badge: 'Sale 50%',
      badgeColor: '#DC143C'
    },
    { 
      id: 10, 
      name: 'Green Chili', 
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
          <a href="#view-all" className="view-all-link">View All →</a>
        </div>
        
        <div className="products-grid">
          {products.map((product) => (
            <div
              key={product.id}
              className={`product-card ${selectedProduct === product.name ? 'selected' : ''}`}
              onClick={() => setSelectedProduct(product.name)}
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
                    <span className="original-price">${product.originalPrice.toFixed(2)}</span>
                  )}
                  <span className="current-price">${product.price.toFixed(2)}</span>
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