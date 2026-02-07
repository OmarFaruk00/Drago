import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import flashsaleBanner from '../images/flashsale.png'
import './FlashSale.css'

const FlashSale = () => {
  const navigate = useNavigate()
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 10,
    minutes: 30,
    seconds: 45
  })
  const productsContainerRef = useRef(null)
  const [currentSlide, setCurrentSlide] = useState(0)

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
    { id: 1, name: 'Smart Watch Series X', price: 19.99, salePrice: 9.99, giftOffer: true, freeDelivery: false },
    { id: 2, name: 'USB-C Multiport Hub', price: 45, salePrice: 29.99, giftOffer: false, freeDelivery: true },
    { id: 3, name: 'Gaming Headset Pro', price: 75, salePrice: 59.99, giftOffer: true, freeDelivery: false },
    { id: 4, name: 'Bluetooth Earbuds', price: 25, salePrice: 14.99, giftOffer: true, freeDelivery: false },
    { id: 5, name: 'XINJI PX1 Portable Projector', price: 20000, salePrice: 17000, giftOffer: true, freeDelivery: false },
    { id: 6, name: 'MacBook Pro M3', price: 180000, salePrice: 150000, giftOffer: true, freeDelivery: false },
  ]

  const scrollSlider = (direction) => {
    if (productsContainerRef.current) {
      const cardWidth = 312 + 24 // card width 312px + gap 1.5rem
      const scrollAmount = cardWidth * 2 // scroll 2 cards at a time
      
      if (direction === 'left') {
        productsContainerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
      } else {
        productsContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
      }
    }
  }

  const formatTime = (value) => {
    return String(value).padStart(2, '0')
  }

  const totalSlides = Math.max(1, Math.ceil(allProducts.length / 4))

  const goToSlide = (index) => {
    setCurrentSlide(index)
    if (productsContainerRef.current) {
      const cardWidth = 312 + 24
      productsContainerRef.current.scrollTo({ left: index * cardWidth * 4, behavior: 'smooth' })
    }
  }

  return (
    <section className="flash-sale">
      <div className="flash-sale-header">
        <div className="flash-sale-banner">
          <img
            src={flashsaleBanner}
            alt="Flash Sale"
            className="flash-sale-banner-img"
          />
        </div>
        <div className="countdown-timer">
          <div className="timer-segment">
            <div className="timer-box">{formatTime(timeLeft.days)}</div>
            <div className="timer-label">Day</div>
          </div>
          <div className="timer-segment">
            <div className="timer-box">{formatTime(timeLeft.minutes)}</div>
            <div className="timer-label">Min</div>
          </div>
          <div className="timer-segment">
            <div className="timer-box">{formatTime(timeLeft.hours)}</div>
            <div className="timer-label">Hour</div>
          </div>
          <div className="timer-segment">
            <div className="timer-box">{formatTime(timeLeft.seconds)}</div>
            <div className="timer-label">Sec</div>
          </div>
        </div>
      </div>

      <div className="flash-sale-content">
        <button className="slider-arrow slider-arrow-left" onClick={() => scrollSlider('left')}>
          ←
        </button>
        <div className="products-container" ref={productsContainerRef}>
          {allProducts.map((product) => (
            <div 
              key={product.id}
              className="product-card"
              onClick={() => navigate(`/product/${product.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="product-badges">
                <span className="badge badge-sale">Sale 10%</span>
              </div>
              <div className="product-image-container">
                <div className="product-image-placeholder">
                  <span>📱</span>
                </div>
                <div className="product-badges-on-image">
                  {product.freeDelivery ? (
                    <span className="badge badge-free-delivery">Free Delivery</span>
                  ) : (
                    <span className="badge badge-gift-offer">Gift Offer</span>
                  )}
                </div>
              </div>
              <div className="product-info">
                <div className="product-name">{product.name}</div>
                <div className="product-pricing-row">
                  <div className="price-section">
                    <div className="price-container">
                      <span className="sale-price">
                        {product.salePrice < 500 ? `$${Number(product.salePrice).toFixed(2)}` : `৳${product.salePrice.toLocaleString('en-IN')}`}
                      </span>
                      {product.price && (
                        <span className="original-price">
                          {product.price < 500 ? `$${Number(product.price).toFixed(2)}` : `৳${product.price.toLocaleString('en-IN')}`}
                        </span>
                      )}
                    </div>
                    <div className="product-rating">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span key={i} className="star filled">★</span>
                      ))}
                    </div>
                  </div>
                  <button 
                    className="add-to-cart-icon-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                    aria-label="Add to cart"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 4V2C7 1.44772 7.44772 1 8 1H16C16.5523 1 17 1.44772 17 2V4H20C20.5523 4 21 4.44772 21 5C21 5.55228 20.5523 6 20 6H19V19C19 20.1046 18.1046 21 17 21H7C5.89543 21 5 20.1046 5 19V6H4C3.44772 6 3 5.55228 3 5C3 4.44772 3.44772 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                      <path d="M9 9V17H11V9H9ZM13 9V17H15V9H13Z" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="slider-arrow slider-arrow-right" onClick={() => scrollSlider('right')}>
          →
        </button>
      </div>

      <div className="flash-sale-dots">
        {Array.from({ length: totalSlides }, (_, i) => (
          <button
            key={i}
            type="button"
            className={`dot ${i === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
      <div className="flash-sale-footer">
        <Link to="/shop" className="see-all-button">See All Products →</Link>
      </div>
    </section>
  )
}

export default FlashSale