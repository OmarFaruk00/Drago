import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './ExploreProducts.css'

const ExploreProducts = () => {
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedProduct, setSelectedProduct] = useState('Green Apple')

  const categories = ['All', 'Vegetable', 'Fruit', 'Meat & Fish', 'View All']

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
      name: 'Surjapur Mango',
      price: 14.99,
      originalPrice: null,
      rating: 5,
      badge: null,
      badgeColor: null
    },
    {
      id: 3,
      name: 'Red Tomatos',
      price: 14.99,
      originalPrice: null,
      rating: 5,
      badge: null,
      badgeColor: null
    },
    {
      id: 4,
      name: 'Fresh Cauliflower',
      price: 14.99,
      originalPrice: null,
      rating: 5,
      badge: null,
      badgeColor: null
    },
    {
      id: 5,
      name: 'Green Lettuce',
      price: 14.99,
      originalPrice: null,
      rating: 5,
      badge: null,
      badgeColor: null
    },
    {
      id: 6,
      name: 'Eggplant',
      price: 14.99,
      originalPrice: null,
      rating: 5,
      badge: null,
      badgeColor: null
    },
    {
      id: 7,
      name: 'Green Chilli',
      price: 14.99,
      originalPrice: null,
      rating: 5,
      badge: null,
      badgeColor: null
    },
    {
      id: 8,
      name: 'Eggplant',
      price: 14.99,
      originalPrice: null,
      rating: 5,
      badge: null,
      badgeColor: null
    }
  ]

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>★</span>
    ))
  }

  return (
    <section className="explore-products">
      <div className="explore-products-container">
        <h2 className="explore-title">Exploure Our Products</h2>
        
        {/* Category Filters */}
        <div className="category-filters">
          {categories.map((category, index) => (
            <React.Fragment key={category}>
              <button
                className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
              {index < categories.length - 1 && <span className="filter-divider">|</span>}
            </React.Fragment>
          ))}
        </div>

        {/* Product Grid */}
        <div className="products-grid">
          {products.map((product) => (
            <div
              key={product.id}
              className={`product-card ${selectedProduct === product.name ? 'selected' : ''}`}
              onClick={() => setSelectedProduct(product.name)}
            >
              {/* Badge */}
              {product.badge && (
                <div
                  className="product-badge"
                  style={{ backgroundColor: product.badgeColor }}
                >
                  {product.badge}
                </div>
              )}

              {/* Action Icons */}
              <div className="product-actions">
                <button className="action-icon wishlist-icon">♡</button>
                <button className="action-icon view-icon">👁️</button>
              </div>

              {/* Product Image */}
              <div className="product-image-wrapper">
                <div className="product-image-placeholder">
                  <span>🛒</span>
                </div>
              </div>

              {/* Product Info */}
              <div className="product-info">
                <div className="product-name">{product.name}</div>
                <div className="product-rating">
                  {renderStars(product.rating)}
                </div>
                <div className="product-pricing">
                  {product.originalPrice && (
                    <span className="original-price">৳{product.originalPrice.toFixed(2)}</span>
                  )}
                  <span className={`current-price ${product.originalPrice ? 'sale-price' : ''}`}>
                    ৳{product.price.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                className={`add-to-cart-icon ${selectedProduct === product.name ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedProduct(product.name)
                }}
              >
                🛍️
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ExploreProducts