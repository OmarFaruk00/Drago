import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './FlashSale.css'

const FlashSale = () => {
  const navigate = useNavigate()
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 10,
    minutes: 30,
    seconds: 45
  })
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev
        
        if (seconds > 0) {
          seconds--
        } else {
          seconds = 59
          if (minutes > 0) {
            minutes--
          } else {
            minutes = 59
            if (hours > 0) {
              hours--
            } else {
              hours = 23
              if (days > 0) {
                days--
              }
            }
          }
        }
        
        return { days, hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const allProducts = [
    { id: 1, name: 'iPhone 15 Pro', price: 120000, salePrice: 100000, discount: 17, rating: 4.8, hasGift: false },
    { id: 2, name: 'AirPods Pro 2', price: 25000, salePrice: 20000, discount: 20, rating: 4.7, hasGift: false },
    { id: 3, name: 'Samsung Galaxy S24', price: 95000, salePrice: 80000, discount: 16, rating: 4.6, hasGift: false },
    { id: 4, name: 'Sony WH-1000XM5', price: 35000, salePrice: 28000, discount: 20, rating: 4.9, hasGift: false },
    { id: 5, name: 'MacBook Pro M3', price: 180000, salePrice: 150000, discount: 17, rating: 4.8, hasGift: true },
    { id: 6, name: 'iPad Pro 12.9"', price: 110000, salePrice: 95000, discount: 14, rating: 4.7, hasGift: false },
    { id: 7, name: 'Apple Watch Series 9', price: 45000, salePrice: 38000, discount: 16, rating: 4.8, hasGift: false },
    { id: 8, name: 'PlayStation 5', price: 55000, salePrice: 48000, discount: 13, rating: 4.9, hasGift: false },
  ]

  // Get 3 products starting from currentIndex
  const getVisibleProducts = () => {
    const visible = []
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % allProducts.length
      visible.push(allProducts[index])
    }
    return visible
  }

  const products = getVisibleProducts()

  useEffect(() => {
    const productTimer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % allProducts.length)
    }, 3000)

    return () => clearInterval(productTimer)
  }, [])

  const formatTime = (value) => {
    return String(value).padStart(2, '0')
  }

  return (
    <section className="flash-sale">
      <div className="flash-sale-header">
        <div className="flash-sale-title">Flash Sale</div>
        <div className="countdown-timer">
          <div className="timer-segment">
            <div className="timer-box">{formatTime(timeLeft.days)}</div>
            <div className="timer-label">Day</div>
          </div>
          <div className="timer-segment">
            <div className="timer-box">{formatTime(timeLeft.hours)}</div>
            <div className="timer-label">Hour</div>
          </div>
          <div className="timer-segment">
            <div className="timer-box">{formatTime(timeLeft.minutes)}</div>
            <div className="timer-label">Min</div>
          </div>
          <div className="timer-segment">
            <div className="timer-box">{formatTime(timeLeft.seconds)}</div>
            <div className="timer-label">Sec</div>
          </div>
        </div>
      </div>

      <div className="flash-sale-content">
        <div className="products-container">
          {products.map((product, idx) => (
            <div 
              key={`${product.id}-${currentIndex}-${idx}`}
              className="product-card"
              onClick={() => navigate(`/product/${product.id}`)}
              style={{ cursor: 'pointer' }}
            >
              {product.hasGift && (
                <div className="gift-badge">Gift Offer</div>
              )}
              <div className="product-image-container">
                <div className="product-image-placeholder">
                  <span>👩</span>
                </div>
                <div className="discount-badge">-{product.discount}%</div>
              </div>
              <div className="product-info">
                <div className="product-header">
                  <div className="product-rating">
                    <span className="rating-value">{product.rating}</span>
                    <span className="star-icon">⭐</span>
                  </div>
                  <div className="product-name">{product.name}</div>
                  <div className="wishlist-icon">❤️</div>
                </div>
                <div className="product-pricing">
                  <span className="original-price">৳{product.price.toFixed(2).replace('.', ',')}</span>
                  <span className="sale-price">৳{product.salePrice.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flash-sale-footer">
        <Link to="/shop" className="see-all-button">See All Products →</Link>
      </div>
    </section>
  )
}

export default FlashSale