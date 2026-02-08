import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import flashsaleBanner from '../images/flashsale.png'
import cartCheckIcon from '../images/icons/cart-check.svg'
import starIcon from '../images/icons/star.png'
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
    { id: 1, name: 'Smart Watch Series X', price: 14.99, salePrice: 9.99, giftOffer: true, freeDelivery: false, rating: 4 },
    { id: 2, name: 'USB-C Multiport Hub', price: 45, salePrice: 29.99, giftOffer: false, freeDelivery: true, rating: 4 },
    { id: 3, name: 'Gaming Headset Pro', price: 79.99, salePrice: 59.99, giftOffer: true, freeDelivery: false, rating: 4 },
    { id: 4, name: 'Bluetooth Earbuds', price: 19.99, salePrice: 14.99, giftOffer: true, freeDelivery: false, rating: 4 },
    { id: 5, name: 'XINJI PX1 Portable Projector', price: 20000, salePrice: 17000, giftOffer: true, freeDelivery: false, rating: 4 },
    { id: 6, name: 'MacBook Pro M3', price: 180000, salePrice: 150000, giftOffer: true, freeDelivery: false, rating: 4 },
  ]

  const renderStars = (rating = 5) => {
    return Array.from({ length: 5 }, (_, i) => (
      <img key={i} src={starIcon} alt="" className={`star star-img ${i < rating ? 'filled' : ''}`} />
    ))
  }

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
            <span className="timer-label">Day</span>
            <div className="timer-box">{formatTime(timeLeft.days)}</div>
          </div>
          <div className="timer-segment">
            <span className="timer-label">Min</span>
            <div className="timer-box">{formatTime(timeLeft.minutes)}</div>
          </div>
          <div className="timer-segment">
            <span className="timer-label">Hour</span>
            <div className="timer-box">{formatTime(timeLeft.hours)}</div>
          </div>
          <div className="timer-segment">
            <span className="timer-label">Sec</span>
            <div className="timer-box">{formatTime(timeLeft.seconds)}</div>
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
                <span className="badge badge-sale">Sale 50%</span>
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
                        ৳{product.salePrice < 500 ? Number(product.salePrice).toFixed(2) : product.salePrice.toLocaleString('en-IN')}
                      </span>
                      {product.price && (
                        <span className="original-price">
                          ৳{product.price < 500 ? Number(product.price).toFixed(2) : product.price.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    <div className="product-rating">
                      {renderStars(product.rating)}
                    </div>
                  </div>
                  <button 
                    className="add-to-cart-icon-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                    aria-label="Add to cart"
                  >
                    <img src={cartCheckIcon} alt="" className="add-to-cart-icon-img" />
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