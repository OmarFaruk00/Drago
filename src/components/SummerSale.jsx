import React from 'react'
import './SummerSale.css'

const SummerSale = () => {
  return (
    <section className="summer-sale-banner">
      <div className="summer-sale-container">
        {/* Left Section - Produce Image */}
        <div className="summer-sale-image">
          <div className="produce-placeholder">
            <div className="produce-content">
              <span className="produce-icon">🥬🥦🥑</span>
              <p>Fresh Produce Image</p>
            </div>
          </div>
        </div>

        {/* Right Section - Text and CTA */}
        <div className="summer-sale-content">
          <div className="sale-text-small">SUMMER SALE</div>
          <div className="sale-headline">
            <span className="sale-percentage">37%</span>
            <span className="sale-off">OFF</span>
          </div>
          <div className="sale-description">
            Free on all your order, Free Shipping and 30 days money-back guarantee
          </div>
          <button className="summer-shop-button">Shop Now →</button>
        </div>
      </div>
    </section>
  )
}

export default SummerSale