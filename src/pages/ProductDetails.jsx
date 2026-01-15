import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './ProductDetails.css'

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedMemory, setSelectedMemory] = useState('128GB')
  const [quantity, setQuantity] = useState(1)

  // Sample product data - in real app, fetch based on id
  const product = {
    id: id || 1,
    name: 'চীনা বাধাকপি',
    category: 'Fresh Vegetables',
    brand: 'Drago',
    sku: 'DRG-001',
    price: 24.99,
    originalPrice: 48.00,
    discount: 48,
    rating: 5,
    reviews: 4,
    inStock: true,
    description: 'তাজা চীনা বাধাকপি, খাওয়ার জন্য সম্পূর্ণ স্বাস্থ্যকর এবং পুষ্টিকর।',
    images: [
      '🥬',
      '🥬',
      '🥬',
      '🥬'
    ],
    tags: ['Vegetables', 'Healthy', 'Chinese Cabbage', 'Green Cabbage'],
    colors: [
      { name: 'সবুজ', value: 'green' },
      { name: 'তাজা সবুজ', value: 'fresh-green' },
      { name: 'গাঢ় সবুজ', value: 'dark-green' }
    ],
    relatedProducts: [
      { id: 2, name: 'বড় আলু', price: 24.99 },
      { id: 3, name: 'ভুট্টা', price: 24.99 },
      { id: 4, name: 'বেগুন', price: 24.99 }
    ]
  }

  const increaseQuantity = () => setQuantity(q => q + 1)
  const decreaseQuantity = () => setQuantity(q => Math.max(1, q - 1))

  return (
    <div className="product-details-page">
      <Navbar />
      <div className="product-details-content">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <div className="breadcrumb-container">
            <Link to="/" className="breadcrumb-link">Home</Link>
            <span className="breadcrumb-separator">/</span>
            <Link to="/shop" className="breadcrumb-link">Shop</Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">{product.category}</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">{product.name}</span>
          </div>
        </div>

        <div className="product-details-main">
          <div className="product-details-container">
            {/* Left Side - Product Images */}
            <div className="product-images-section">
              <div className="thumbnail-images">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <span className="thumbnail-icon">{img}</span>
                  </button>
                ))}
              </div>
              <div className="main-product-image">
                <div className="main-image-placeholder">
                  <span className="product-icon">{product.images[selectedImage]}</span>
                </div>
              </div>
            </div>

            {/* Right Side - Product Info */}
            <div className="product-info-section">
              <div className="product-header">
                <h1 className="product-title">{product.name}</h1>
                {product.inStock && (
                  <span className="stock-badge">In Stock</span>
                )}
              </div>

              <div className="product-rating">
                <div className="stars">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} className="star filled">★</span>
                  ))}
                </div>
                <span className="review-count">{product.reviews} Review</span>
              </div>

              <div className="product-sku">SKU: {product.sku}</div>

              <div className="product-pricing">
                <span className="original-price">৳{product.originalPrice.toFixed(2)}</span>
                <span className="current-price">৳{product.price.toFixed(2)}</span>
                <span className="discount-badge">{product.discount}% Off</span>
              </div>

              <div className="product-brand">
                <div className="brand-logo">🛒</div>
                <span className="brand-name">{product.brand}</span>
              </div>

              <div className="share-section">
                <span className="share-label">Share Item:</span>
                <div className="share-buttons">
                  <a href="#facebook" className="share-btn facebook">f</a>
                  <a href="#twitter" className="share-btn twitter">🐦</a>
                  <a href="#pinterest" className="share-btn pinterest">P</a>
                </div>
              </div>

              <div className="product-meta">
                <div className="meta-item">
                  <span className="meta-label">Category:</span>
                  <span className="meta-value">{product.category}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Tags:</span>
                  <div className="tags">
                    {product.tags.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>

              {product.colors && product.colors.length > 0 && (
                <div className="product-options">
                  <div className="option-group">
                    <label className="option-label">COLOR:</label>
                    <div className="color-options">
                      {product.colors.map((color, index) => (
                        <button
                          key={index}
                          className={`color-option ${selectedColor === color.value ? 'selected' : ''}`}
                          onClick={() => setSelectedColor(color.value)}
                        >
                          <span className="color-name">{color.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="quantity-section">
                <label className="quantity-label">Quantity:</label>
                <div className="quantity-selector">
                  <button className="quantity-btn" onClick={decreaseQuantity}>-</button>
                  <span className="quantity-value">{quantity}</span>
                  <button className="quantity-btn" onClick={increaseQuantity}>+</button>
                </div>
              </div>

              <div className="product-actions">
                <button className="add-to-cart-btn">
                  <span>🛍️</span>
                  Add to Cart
                </button>
                <button className="add-to-wishlist-btn">
                  <span>❤️</span>
                </button>
              </div>

              <div className="product-description">
                <h3>Description</h3>
                <p>{product.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="related-products-section">
          <div className="related-products-container">
            <h2 className="related-title">Related Products</h2>
            <div className="related-products-grid">
              {product.relatedProducts.map((related) => (
                <div
                  key={related.id}
                  className="related-product-card"
                  onClick={() => navigate(`/product/${related.id}`)}
                >
                  <div className="related-product-image">
                    <span>🛒</span>
                  </div>
                  <div className="related-product-name">{related.name}</div>
                  <div className="related-product-price">৳{related.price.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default ProductDetails