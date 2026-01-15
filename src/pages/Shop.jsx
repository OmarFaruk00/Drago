import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './Shop.css'

const Shop = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [selectedRating, setSelectedRating] = useState(null)

  const categories = [
    { name: 'All Categories', count: 120 },
    { name: 'Fresh Fruit', count: 22 },
    { name: 'Fresh Vegetables', count: 20 },
    { name: 'Meat & Fish', count: 14 },
    { name: 'Cooking', count: 15 },
    { name: 'Snacks', count: 10 },
    { name: 'Non-Veg', count: 14 },
    { name: 'Bakery & Milk', count: 12 },
    { name: 'Beverages', count: 10 },
    { name: 'Grocery', count: 10 },
    { name: 'Beauty & Health', count: 8 },
    { name: 'Bread & Bakery', count: 12 },
    { name: 'Baking Needs', count: 7 },
    { name: 'Diabetic Food', count: 5 },
    { name: 'Dish Detergents', count: 6 },
    { name: 'Oil', count: 9 }
  ]

  const ratings = [
    { stars: 5, percent: 9.1 },
    { stars: 4, percent: 8.2 },
    { stars: 3, percent: 6.4 },
    { stars: 2, percent: 3.6 },
    { stars: 1, percent: 1.8 }
  ]

  const popularTags = ['Healthy', 'Vegetables', 'Eat Fresh', 'Organic', 'Fresh', 'Fruits', 'Snacks', 'Orange', 'Freshfood', 'Food']

  const saleProducts = [
    { name: 'Red Capsicum', originalPrice: 10.00, salePrice: 8.00, rating: 5 },
    { name: 'Chinese Cabbage', originalPrice: 10.00, salePrice: 8.00, rating: 5 },
    { name: 'Green Capsicum', originalPrice: 10.00, salePrice: 8.00, rating: 5 }
  ]

  const products = [
    { id: 1, name: 'Big Potato', price: 24.99 },
    { id: 2, name: 'Chinese Cabbage', price: 24.99 },
    { id: 3, name: 'Indian Finger', price: 24.99 },
    { id: 4, name: 'Eggplant', price: 24.99 },
    { id: 5, name: 'Fresh Cauliflower', price: 24.99 },
    { id: 6, name: 'Sweet Apple', price: 24.99 },
    { id: 7, name: 'Green Capsicum', price: 24.99 },
    { id: 8, name: 'Green Chili', price: 24.99 },
    { id: 9, name: 'Small Cucumber', price: 24.99 },
    { id: 10, name: 'Green Lettuce', price: 24.99 },
    { id: 11, name: 'Ladies Finger', price: 24.99 },
    { id: 12, name: 'Red Capsicum', price: 24.99 },
    { id: 13, name: 'Red Chili', price: 24.99 },
    { id: 14, name: 'Red Tomato', price: 24.99 },
    { id: 15, name: 'Sweet Mango', price: 24.99 }
  ]

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>★</span>
    ))
  }

  const totalPages = Math.ceil(products.length / 9)

  return (
    <div className="shop-page">
      <Navbar />
      <div className="shop-content">
        {/* Header Section */}
        <div className="shop-header">
          <div className="shop-header-container">
            <div className="categories-dropdown">
              <button className="categories-btn">Categories</button>
            </div>
            <div className="shop-nav">
              <a href="/" className="nav-link">Home</a>
              <span className="nav-separator">/</span>
              <span className="nav-current">Shop</span>
            </div>
            <div className="result-found">Result Found: 120</div>
          </div>
        </div>

        <div className="shop-main">
          <div className="shop-main-container">
            {/* Left Sidebar - Filters */}
            <aside className="shop-sidebar">
              {/* All Categories */}
              <div className="filter-section">
                <h3 className="filter-title">All Categories</h3>
                <ul className="category-list">
                  {categories.map((category, index) => (
                    <li key={index}>
                      <button
                        className={`category-item ${selectedCategory === category.name ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedCategory(category.name)
                          // Scroll to top when category changes
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        }}
                      >
                        {category.name} <span className="category-count">({category.count})</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Filter */}
              <div className="filter-section">
                <h3 className="filter-title">Price</h3>
                <div className="price-slider-container">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="price-slider"
                  />
                  <div className="price-range-display">
                    ৳{priceRange[0]} - ৳{priceRange[1]}
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="filter-section">
                <h3 className="filter-title">Rating</h3>
                <ul className="rating-list">
                  {ratings.map((rating, index) => (
                    <li key={index}>
                      <button
                        className={`rating-item ${selectedRating === rating.stars ? 'active' : ''}`}
                        onClick={() => setSelectedRating(rating.stars)}
                      >
                        <span className="rating-stars">{renderStars(rating.stars)}</span>
                        <span className="rating-percent">({rating.percent}%)</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Popular Tags */}
              <div className="filter-section">
                <h3 className="filter-title">Popular Tag</h3>
                <div className="tags-container">
                  {popularTags.map((tag, index) => (
                    <button key={index} className={`tag-btn ${tag === 'Healthy' ? 'active' : ''}`}>
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* 79% Discount Banner */}
              <div className="discount-banner">
                <div className="discount-badge">79% Discount!</div>
                <div className="discount-text">on your first order</div>
                <div className="discount-image-placeholder">
                  <span>🥬🍅🥒</span>
                </div>
                <button className="discount-shop-btn">Shop Now</button>
              </div>

              {/* Sale Products */}
              <div className="filter-section">
                <h3 className="filter-title">Sale Products</h3>
                <div className="sale-products-list">
                  {saleProducts.map((product, index) => (
                    <div key={index} className="sale-product-item">
                      <div className="sale-product-image">
                        <span>🛒</span>
                      </div>
                      <div className="sale-product-info">
                        <div className="sale-product-name">{product.name}</div>
                        <div className="sale-product-rating">{renderStars(product.rating)}</div>
                        <div className="sale-product-pricing">
                          <span className="sale-original-price">৳{product.originalPrice.toFixed(2)}</span>
                          <span className="sale-price">৳{product.salePrice.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main Product Grid */}
            <main className="shop-products">
              <div className="products-grid">
                {products.map((product) => (
                  <div key={product.id} className="product-card">
                    <div className="product-image-container">
                      <div className="product-image-placeholder">
                        <span>🛒</span>
                      </div>
                      <button className="wishlist-btn">♡</button>
                      <button className="add-cart-label">Add to cart</button>
                    </div>
                    <div className="product-info">
                      <div className="product-name">{product.name}</div>
                      <div className="product-price">৳{product.price.toFixed(2)}</div>
                      <button className="cart-icon-btn">🛍️</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="pagination">
                <button className="pagination-btn" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}>
                  ←
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
                <button className="pagination-btn" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}>
                  →
                </button>
              </div>
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Shop