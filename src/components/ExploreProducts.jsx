import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './ExploreProducts.css'

const ExploreProducts = () => {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedProduct, setSelectedProduct] = useState('iPhone 15 Pro')

  const categories = ['All', 'Smartphones', 'Laptops', 'Headphones', 'View All']

  const allProducts = [
    // Smartphones
    {
      id: 1,
      name: 'iPhone 15 Pro',
      price: 100000,
      originalPrice: 120000,
      rating: 5,
      badge: 'Sale 17%',
      badgeColor: '#DC143C',
      category: 'Smartphones'
    },
    {
      id: 2,
      name: 'Samsung Galaxy S24',
      price: 95000,
      originalPrice: null,
      rating: 5,
      badge: null,
      badgeColor: null,
      category: 'Smartphones'
    },
    {
      id: 3,
      name: 'Xiaomi 14 Pro',
      price: 65000,
      originalPrice: null,
      rating: 4,
      badge: null,
      badgeColor: null,
      category: 'Smartphones'
    },
    {
      id: 4,
      name: 'OnePlus 12',
      price: 75000,
      originalPrice: null,
      rating: 5,
      badge: null,
      badgeColor: null,
      category: 'Smartphones'
    },
    // Laptops
    {
      id: 5,
      name: 'MacBook Pro M3',
      price: 180000,
      originalPrice: null,
      rating: 5,
      badge: null,
      badgeColor: null,
      category: 'Laptops'
    },
    {
      id: 6,
      name: 'Dell XPS 15',
      price: 140000,
      originalPrice: null,
      rating: 5,
      badge: null,
      badgeColor: null,
      category: 'Laptops'
    },
    {
      id: 7,
      name: 'HP Spectre x360',
      price: 120000,
      originalPrice: null,
      rating: 4,
      badge: null,
      badgeColor: null,
      category: 'Laptops'
    },
    // Headphones
    {
      id: 8,
      name: 'Sony WH-1000XM5',
      price: 35000,
      originalPrice: null,
      rating: 5,
      badge: null,
      badgeColor: null,
      category: 'Headphones'
    },
    {
      id: 9,
      name: 'AirPods Pro 2',
      price: 25000,
      originalPrice: null,
      rating: 5,
      badge: null,
      badgeColor: null,
      category: 'Headphones'
    },
    {
      id: 10,
      name: 'Bose QuietComfort 45',
      price: 32000,
      originalPrice: null,
      rating: 5,
      badge: null,
      badgeColor: null,
      category: 'Headphones'
    },
    {
      id: 11,
      name: 'JBL Tune 770NC',
      price: 8000,
      originalPrice: null,
      rating: 4,
      badge: null,
      badgeColor: null,
      category: 'Headphones'
    },
    {
      id: 12,
      name: 'Apple Watch Series 9',
      price: 45000,
      originalPrice: null,
      rating: 5,
      badge: null,
      badgeColor: null,
      category: 'Smart Watches'
    }
  ]

  // Filter products based on active category
  const products = activeCategory === 'All' 
    ? allProducts 
    : activeCategory === 'Smartphones'
    ? allProducts.filter(p => p.category === 'Smartphones')
    : activeCategory === 'Laptops'
    ? allProducts.filter(p => p.category === 'Laptops')
    : activeCategory === 'Headphones'
    ? allProducts.filter(p => p.category === 'Headphones')
    : allProducts

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>★</span>
    ))
  }

  return (
    <section className="explore-products">
      <div className="explore-products-container">
        <div className="section-header">
          <h2 className="explore-title">Exploure Our Products</h2>
          <Link to="/shop" className="view-all-link">View All →</Link>
        </div>
        
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
              onClick={() => navigate(`/product/${product.id}`)}
              style={{ cursor: 'pointer' }}
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
                <button 
                  className="action-icon wishlist-icon"
                  onClick={(e) => e.stopPropagation()}
                >
                  ♡
                </button>
                <button 
                  className="action-icon view-icon"
                  onClick={(e) => e.stopPropagation()}
                >
                  👁️
                </button>
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
                  // Handle add to cart
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