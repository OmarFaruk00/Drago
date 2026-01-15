import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './Shop.css'

const Shop = () => {
  const navigate = useNavigate()
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
    { name: 'লাল ক্যাপসিকাম', originalPrice: 10.00, salePrice: 8.00, rating: 5 },
    { name: 'চীনা বাধাকপি', originalPrice: 10.00, salePrice: 8.00, rating: 5 },
    { name: 'সবুজ ক্যাপসিকাম', originalPrice: 10.00, salePrice: 8.00, rating: 5 }
  ]

  const allProducts = [
    // Vegetables
    { id: 1, name: 'বড় আলু', price: 24.99, category: 'Fresh Vegetables' },
    { id: 2, name: 'চীনা বাধাকপি', price: 24.99, category: 'Fresh Vegetables' },
    { id: 3, name: 'ভুট্টা', price: 24.99, category: 'Fresh Vegetables' },
    { id: 4, name: 'বেগুন', price: 24.99, category: 'Fresh Vegetables' },
    { id: 5, name: 'তাজা ফুলকপি', price: 24.99, category: 'Fresh Vegetables' },
    { id: 7, name: 'সবুজ ক্যাপসিকাম', price: 24.99, category: 'Fresh Vegetables' },
    { id: 8, name: 'সবুজ মরিচ', price: 24.99, category: 'Fresh Vegetables' },
    { id: 9, name: 'ছোট শসা', price: 24.99, category: 'Fresh Vegetables' },
    { id: 10, name: 'সবুজ লেটুস', price: 24.99, category: 'Fresh Vegetables' },
    { id: 11, name: 'ঢেঁড়শ', price: 24.99, category: 'Fresh Vegetables' },
    { id: 12, name: 'লাল ক্যাপসিকাম', price: 24.99, category: 'Fresh Vegetables' },
    { id: 13, name: 'লাল মরিচ', price: 24.99, category: 'Fresh Vegetables' },
    { id: 14, name: 'লাল টমেটো', price: 24.99, category: 'Fresh Vegetables' },
    
    // Fruits
    { id: 6, name: 'মিষ্টি আপেল', price: 24.99, category: 'Fresh Fruit' },
    { id: 15, name: 'মিষ্টি আম', price: 24.99, category: 'Fresh Fruit' },
    { id: 30, name: 'কলা', price: 40.00, category: 'Fresh Fruit' },
    { id: 31, name: 'কমলা', price: 60.00, category: 'Fresh Fruit' },
    { id: 32, name: 'পেয়ারা', price: 50.00, category: 'Fresh Fruit' },
    { id: 33, name: 'লিচু', price: 150.00, category: 'Fresh Fruit' },
    { id: 34, name: 'আঙ্গুর', price: 180.00, category: 'Fresh Fruit' },
    { id: 35, name: 'জাম', price: 120.00, category: 'Fresh Fruit' },
    { id: 36, name: 'কাঁঠাল', price: 80.00, category: 'Fresh Fruit' },
    { id: 37, name: 'নারিকেল', price: 35.00, category: 'Fresh Fruit' },
    { id: 38, name: 'তরমুজ', price: 45.00, category: 'Fresh Fruit' },
    { id: 39, name: 'পেঁপে', price: 30.00, category: 'Fresh Fruit' },
    { id: 40, name: 'বাঙ্গি', price: 40.00, category: 'Fresh Fruit' },
    { id: 41, name: 'স্ট্রবেরি', price: 250.00, category: 'Fresh Fruit' },
    { id: 42, name: 'আনারস', price: 70.00, category: 'Fresh Fruit' },
    { id: 43, name: 'বরই', price: 55.00, category: 'Fresh Fruit' },
    { id: 44, name: 'জামরুল', price: 90.00, category: 'Fresh Fruit' },
    { id: 45, name: 'কামরাঙা', price: 65.00, category: 'Fresh Fruit' },
    { id: 46, name: 'ডালিম', price: 100.00, category: 'Fresh Fruit' },
    { id: 47, name: 'পাকা খেজুর', price: 200.00, category: 'Fresh Fruit' },
    { id: 48, name: 'শরিফা', price: 110.00, category: 'Fresh Fruit' },
    { id: 49, name: 'ড্রাগন ফল', price: 160.00, category: 'Fresh Fruit' },
    
    // Meat & Fish
    { id: 16, name: 'গরুর মাংস', price: 450.00, category: 'Meat & Fish' },
    { id: 17, name: 'খাসির মাংস', price: 500.00, category: 'Meat & Fish' },
    { id: 18, name: 'মুরগির মাংস', price: 180.00, category: 'Meat & Fish' },
    { id: 19, name: 'ইলিশ মাছ', price: 800.00, category: 'Meat & Fish' },
    { id: 20, name: 'রুই মাছ', price: 250.00, category: 'Meat & Fish' },
    { id: 21, name: 'কাতলা মাছ', price: 220.00, category: 'Meat & Fish' },
    { id: 22, name: 'চিংড়ি', price: 350.00, category: 'Meat & Fish' },
    { id: 23, name: 'মাগুর মাছ', price: 300.00, category: 'Meat & Fish' },
    { id: 24, name: 'টেংরা মাছ', price: 280.00, category: 'Meat & Fish' },
    { id: 25, name: 'পুটি মাছ', price: 200.00, category: 'Meat & Fish' },
    { id: 26, name: 'তেলাপিয়া মাছ', price: 150.00, category: 'Meat & Fish' },
    { id: 27, name: 'কই মাছ', price: 400.00, category: 'Meat & Fish' },
    { id: 28, name: 'শিং মাছ', price: 320.00, category: 'Meat & Fish' },
    { id: 29, name: 'বোয়াল মাছ', price: 380.00, category: 'Meat & Fish' }
  ]

  // Filter products based on selected category
  const products = selectedCategory === 'All Categories' 
    ? allProducts 
    : allProducts.filter(p => p.category === selectedCategory)

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
                <Link to="/shop" className="discount-shop-btn">Shop Now</Link>
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
                  <div 
                    key={product.id} 
                    className="product-card"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <div className="product-image-container">
                      <div className="product-image-placeholder">
                        <span>🛒</span>
                      </div>
                      <button 
                        className="wishlist-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          // Handle wishlist
                        }}
                      >
                        ♡
                      </button>
                      <button 
                        className="add-cart-label"
                        onClick={(e) => {
                          e.stopPropagation()
                          // Handle add to cart
                        }}
                      >
                        Add to cart
                      </button>
                    </div>
                    <div className="product-info">
                      <div className="product-name">{product.name}</div>
                      <div className="product-price">৳{product.price.toFixed(2)}</div>
                      <button 
                        className="cart-icon-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          // Handle add to cart
                        }}
                      >
                        🛍️
                      </button>
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