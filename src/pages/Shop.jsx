import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import AllFiltersPanel from '../components/AllFiltersPanel'
import './Shop.css'

const Shop = () => {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [selectedRating, setSelectedRating] = useState(null)
  const [allFiltersOpen, setAllFiltersOpen] = useState(false)

  // Update breadcrumb in Navbar when category changes
  useEffect(() => {
    localStorage.setItem('selectedCategory', selectedCategory)
    window.dispatchEvent(new Event('categoryChanged'))
  }, [selectedCategory])

  const categories = [
    { name: 'All Categories', count: 120 },
    { name: 'Smartphones', count: 25 },
    { name: 'Laptops', count: 18 },
    { name: 'Headphones', count: 22 },
    { name: 'Smart Watches', count: 15 },
    { name: 'Tablets', count: 12 },
    { name: 'Cameras', count: 10 },
    { name: 'Speakers', count: 14 },
    { name: 'Gaming', count: 16 },
    { name: 'Accessories', count: 20 },
    { name: 'TV & Audio', count: 12 },
    { name: 'Smart Home', count: 8 },
    { name: 'Wearables', count: 10 }
  ]

  const ratings = [
    { stars: 5, percent: 9.1 },
    { stars: 4, percent: 8.2 },
    { stars: 3, percent: 6.4 },
    { stars: 2, percent: 3.6 },
    { stars: 1, percent: 1.8 }
  ]

  const popularTags = ['Smart', 'Premium', 'Wireless', 'Gaming', 'Latest', 'Best Seller', 'New Arrival', 'Sale', 'Gadgets', 'Tech']

  const saleProducts = [
    { name: 'iPhone 15 Pro', originalPrice: 120000.00, salePrice: 100000.00, rating: 5 },
    { name: 'MacBook Pro M3', originalPrice: 180000.00, salePrice: 150000.00, rating: 5 },
    { name: 'AirPods Pro', originalPrice: 25000.00, salePrice: 20000.00, rating: 5 }
  ]

  const allProducts = [
    // Smartphones
    { id: 1, name: 'iPhone 15 Pro', price: 120000, category: 'Smartphones' },
    { id: 2, name: 'Samsung Galaxy S24', price: 95000, category: 'Smartphones' },
    { id: 3, name: 'Xiaomi 14 Pro', price: 65000, category: 'Smartphones' },
    { id: 4, name: 'OnePlus 12', price: 75000, category: 'Smartphones' },
    { id: 5, name: 'Google Pixel 8', price: 85000, category: 'Smartphones' },
    { id: 6, name: 'OPPO Find X7', price: 70000, category: 'Smartphones' },
    { id: 7, name: 'Vivo X100', price: 68000, category: 'Smartphones' },
    { id: 8, name: 'Realme GT 6', price: 45000, category: 'Smartphones' },
    
    // Laptops
    { id: 9, name: 'MacBook Pro M3', price: 180000, category: 'Laptops' },
    { id: 10, name: 'Dell XPS 15', price: 140000, category: 'Laptops' },
    { id: 11, name: 'HP Spectre x360', price: 120000, category: 'Laptops' },
    { id: 12, name: 'Lenovo ThinkPad X1', price: 130000, category: 'Laptops' },
    { id: 13, name: 'ASUS ROG Strix', price: 110000, category: 'Laptops' },
    { id: 14, name: 'MSI Gaming Laptop', price: 95000, category: 'Laptops' },
    
    // Headphones
    { id: 15, name: 'Sony WH-1000XM5', price: 35000, category: 'Headphones' },
    { id: 16, name: 'Bose QuietComfort 45', price: 32000, category: 'Headphones' },
    { id: 17, name: 'Apple AirPods Pro 2', price: 25000, category: 'Headphones' },
    { id: 18, name: 'JBL Tune 770NC', price: 8000, category: 'Headphones' },
    { id: 19, name: 'Sennheiser HD 450BT', price: 12000, category: 'Headphones' },
    
    // Smart Watches
    { id: 20, name: 'Apple Watch Series 9', price: 45000, category: 'Smart Watches' },
    { id: 21, name: 'Samsung Galaxy Watch 6', price: 28000, category: 'Smart Watches' },
    { id: 22, name: 'Garmin Forerunner 265', price: 40000, category: 'Smart Watches' },
    { id: 23, name: 'Fitbit Versa 4', price: 20000, category: 'Smart Watches' },
    
    // Tablets
    { id: 24, name: 'iPad Pro 12.9"', price: 110000, category: 'Tablets' },
    { id: 25, name: 'Samsung Galaxy Tab S9', price: 75000, category: 'Tablets' },
    { id: 26, name: 'Microsoft Surface Pro 9', price: 95000, category: 'Tablets' },
    
    // Cameras
    { id: 27, name: 'Canon EOS R6 Mark II', price: 280000, category: 'Cameras' },
    { id: 28, name: 'Sony Alpha 7 IV', price: 250000, category: 'Cameras' },
    { id: 29, name: 'Nikon Z6 III', price: 240000, category: 'Cameras' },
    
    // Speakers
    { id: 30, name: 'Sonos Era 300', price: 55000, category: 'Speakers' },
    { id: 31, name: 'JBL Flip 6', price: 12000, category: 'Speakers' },
    { id: 32, name: 'Bose SoundLink Flex', price: 18000, category: 'Speakers' },
    
    // Gaming
    { id: 33, name: 'PlayStation 5', price: 55000, category: 'Gaming' },
    { id: 34, name: 'Xbox Series X', price: 50000, category: 'Gaming' },
    { id: 35, name: 'Nintendo Switch OLED', price: 35000, category: 'Gaming' },
    
    // Accessories
    { id: 36, name: 'Wireless Charger', price: 2500, category: 'Accessories' },
    { id: 37, name: 'USB-C Hub', price: 3500, category: 'Accessories' },
    { id: 38, name: 'Phone Case', price: 1500, category: 'Accessories' },
    { id: 39, name: 'Screen Protector', price: 800, category: 'Accessories' },
    
    // TV & Audio
    { id: 40, name: 'Samsung 55" QLED TV', price: 120000, category: 'TV & Audio' },
    { id: 41, name: 'LG OLED 65"', price: 180000, category: 'TV & Audio' },
    
    // Smart Home
    { id: 42, name: 'Amazon Echo Dot', price: 5000, category: 'Smart Home' },
    { id: 43, name: 'Google Nest Hub', price: 8000, category: 'Smart Home' },
    
    // Wearables
    { id: 44, name: 'Fitbit Charge 6', price: 12000, category: 'Wearables' },
    { id: 45, name: 'Oura Ring Gen 3', price: 35000, category: 'Wearables' }
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
      <AllFiltersPanel isOpen={allFiltersOpen} onClose={() => setAllFiltersOpen(false)} />
      <div className="shop-content">
        {/* Header Section */}
        <div className="shop-header">
          <div className="shop-header-container">
            <div className="categories-dropdown">
              <button
                className="categories-btn"
                onClick={() => setAllFiltersOpen(true)}
              >
                All filters
              </button>
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
    </div>
  )
}

export default Shop