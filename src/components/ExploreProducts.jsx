import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import bagIcon from '../images/icons/cart-bag.svg'
import starIcon from '../images/icons/star.png'
import './ExploreProducts.css'

const ExploreProducts = () => {
  const navigate = useNavigate()
  const [selectedProduct, setSelectedProduct] = useState('iPhone 15 Pro')

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

  const products = allProducts.slice(0, 8)

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <img key={i} src={starIcon} alt="" className={`star star-img ${i < rating ? 'filled' : ''}`} />
    ))
  }

  return (
    <section className="explore-products">
      <div className="explore-products-container">
        <div className="section-header">
          <h2 className="explore-title">Exploure Our Products</h2>
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

        {/* See All button - centered below grid */}
        <div className="explore-see-all-wrap">
          <Link to="/shop" className="explore-see-all-btn">See All →</Link>
        </div>
      </div>
    </section>
  )
}

export default ExploreProducts