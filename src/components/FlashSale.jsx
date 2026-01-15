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

  const formatTime = (value) => {
    return String(value).padStart(2, '0')
  }

  const products = [
    { id: 1, name: 'সবুজ আপেল', price: 20.00, salePrice: 16.00, discount: 20, rating: 4.5, hasGift: false },
    { id: 2, name: 'তাজা টমেটো', price: 20.00, salePrice: 16.00, discount: 20, rating: 4.5, hasGift: false },
    { id: 3, name: 'সবুজ মরিচ', price: 20.00, salePrice: 16.00, discount: 20, rating: 4.5, hasGift: false },
    { id: 4, name: 'বেগুন', price: 20.00, salePrice: 16.00, discount: 20, rating: 4.5, hasGift: false },
    { id: 5, name: 'ফুলকপি', price: 20.00, salePrice: 16.00, discount: 20, rating: 4.5, hasGift: true },
  ]

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
          {products.map((product) => (
            <div 
              key={product.id} 
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