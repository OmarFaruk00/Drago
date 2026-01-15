import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './ExploreProducts.css'

const ExploreProducts = () => {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedProduct, setSelectedProduct] = useState('সবুজ আপেল')

  const categories = ['All', 'Vegetable', 'Fruit', 'Meat & Fish', 'View All']

  const allProducts = [
    // Fruits
    {
      id: 1,
      name: 'সবুজ আপেল',
      price: 14.99,
      originalPrice: 20.99,
      rating: 5,
      badge: 'Sale 50%',
      badgeColor: '#DC143C',
      category: 'Fruit'
    },
    {
      id: 2,
      name: 'সুরজপুর আম',
      price: 14.99,
      originalPrice: null,
      rating: 5,
      badge: null,
      badgeColor: null,
      category: 'Fruit'
    },
    {
      id: 13,
      name: 'কলা',
      price: 40.00,
      originalPrice: null,
      rating: 5,
      badge: null,
      badgeColor: null,
      category: 'Fruit'
    },
    {
      id: 14,
      name: 'কমলা',
      price: 60.00,
      originalPrice: null,
      rating: 5,
      badge: null,
      badgeColor: null,
      category: 'Fruit'
    },
    {
      id: 15,
      name: 'পেয়ারা',
      price: 50.00,
      originalPrice: null,
      rating: 5,
      badge: null,
      badgeColor: null,
      category: 'Fruit'
    },
    {
      id: 16,
      name: 'লিচু',
      price: 150.00,
      originalPrice: null,
      rating: 5,
      badge: null,
      badgeColor: null,
      category: 'Fruit'
    },
    {
      id: 17,
      name: 'আঙ্গুর',
      price: 180.00,
      originalPrice: null,
      rating: 5,
      badge: null,
      badgeColor: null,
      category: 'Fruit'
    },
    {
      id: 18,
      name: 'জাম',
      price: 120.00,
      originalPrice: null,
      rating: 5,
      badge: null,
      badgeColor: null,
      category: 'Fruit'
    },
    // Vegetables
    {
      id: 3,
      name: 'লাল টমেটো',
      price: 14.99,
      originalPrice: null,
      rating: 5,
      badge: null,
      badgeColor: null,
      category: 'Vegetable'
    },
    {
      id: 4,
      name: 'তাজা ফুলকপি',
      price: 14.99,
      originalPrice: null,
      rating: 5,
      badge: null,
      badgeColor: null,
      category: 'Vegetable'
    },
    {
      id: 5,
      name: 'সবুজ লেটুস',
      price: 14.99,
      originalPrice: null,
      rating: 5,
      badge: null,
      badgeColor: null,
      category: 'Vegetable'
    },
    {
      id: 6,
      name: 'বেগুন',
      price: 14.99,
      originalPrice: null,
      rating: 5,
      badge: null,
      badgeColor: null,
      category: 'Vegetable'
    },
    {
      id: 7,
      name: 'সবুজ মরিচ',
      price: 14.99,
      originalPrice: null,
      rating: 5,
      badge: null,
      badgeColor: null,
      category: 'Vegetable'
    },
    // Meat & Fish products
    {
      id: 8,
      name: 'গরুর মাংস',
      price: 450.00,
      originalPrice: null,
      rating: 5,
      badge: null,
      badgeColor: null,
      category: 'Meat & Fish'
    },
    {
      id: 9,
      name: 'মুরগির মাংস',
      price: 180.00,
      originalPrice: null,
      rating: 5,
      badge: null,
      badgeColor: null,
      category: 'Meat & Fish'
    },
    {
      id: 10,
      name: 'ইলিশ মাছ',
      price: 800.00,
      originalPrice: null,
      rating: 5,
      badge: null,
      badgeColor: null,
      category: 'Meat & Fish'
    },
    {
      id: 11,
      name: 'রুই মাছ',
      price: 250.00,
      originalPrice: null,
      rating: 5,
      badge: null,
      badgeColor: null,
      category: 'Meat & Fish'
    },
    {
      id: 12,
      name: 'চিংড়ি',
      price: 350.00,
      originalPrice: null,
      rating: 5,
      badge: null,
      badgeColor: null,
      category: 'Meat & Fish'
    }
  ]

  // Filter products based on active category
  const products = activeCategory === 'All' 
    ? allProducts 
    : activeCategory === 'Vegetable'
    ? allProducts.filter(p => p.category === 'Vegetable')
    : activeCategory === 'Fruit'
    ? allProducts.filter(p => p.category === 'Fruit')
    : activeCategory === 'Meat & Fish'
    ? allProducts.filter(p => p.category === 'Meat & Fish')
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