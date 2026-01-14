import React from 'react'
import './SummerSale.css'

const SummerSale = () => {
  return (
    <section className="summer-sale-banner">
      <div className="banner-container">
        {/* Left Side - Produce Background */}
        <div className="banner-left">
          <div className="produce-background">
            <div className="produce-elements">
              <div className="produce-item broccoli">🥦</div>
              <div className="produce-item celery">🥬</div>
              <div className="produce-item pepper">🫑</div>
              <div className="produce-item beans">🫛</div>
              <div className="produce-item kiwi">🥝</div>
              <div className="produce-item leaves">🌿</div>
            </div>
          </div>
        </div>

        {/* Right Side - Text and CTA */}
        <div className="banner-right">
          <div className="banner-content">
            <div className="banner-subtitle">SUMMER SALE</div>
            <div className="banner-headline">
              <span className="discount-percent">37%</span>
              <span className="discount-text">OFF</span>
            </div>
            <div className="banner-description">
              Free on all your order, Free Shipping and 30 days money-back guarantee
            </div>
            <button className="shop-now-btn">Shop Now →</button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SummerSale