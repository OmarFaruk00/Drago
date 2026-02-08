import React from 'react'
import { Link } from 'react-router-dom'
import './SummerSale.css'

const SummerSale = () => {
  return (
    <section className="summer-sale-banner">
      <div className="summer-sale-container">
        {/* Left - Promotional Image */}
        <div className="summer-sale-image">
          <img
            src="https://images.unsplash.com/photo-1607082349566-187342175e2f?w=700&h=400&fit=crop"
            alt="Big Sale - Update Your Style"
            className="summer-product-img"
          />
        </div>

        {/* Right - Text & CTA */}
        <div className="summer-sale-content">
          <p className="sale-discount">Up to 70%</p>
          <h2 className="sale-headline">
            <span className="sale-headline-line1">Big Sale</span>
            <span className="sale-headline-line2">Update Your Style</span>
          </h2>
          <p className="sale-description">
            Discover exclusive offers on new arrivals and update your style effortlessly. Limited-time sale is live. Don&apos;t miss out!
          </p>
          <Link to="/shop" className="summer-shop-button">
            Shop now <span className="shop-arrow">→</span>
          </Link>
        </div>
      </div>
      <div className="sale-carousel-dots">
        <span className="dot active"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
    </section>
  )
}

export default SummerSale
