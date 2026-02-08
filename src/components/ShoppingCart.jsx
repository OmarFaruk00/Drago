import React from 'react'
import { Link } from 'react-router-dom'
import cartCheckIcon from '../images/icons/cart-check.svg'
import './ShoppingCart.css'

const ShoppingCart = ({ isOpen, onClose, cartItems, onRemoveItem }) => {
  if (!isOpen) return null

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <>
      <div className="cart-overlay" onClick={onClose}></div>
      <div className="shopping-cart-sidebar">
        <div className="cart-header">
          <div className="cart-header-left">
            <img src={cartCheckIcon} alt="" className="cart-title-icon" />
            <h3 className="cart-title">Shopping Cart ({totalItems})</h3>
          </div>
          <button className="cart-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="cart-items">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <p>Your cart is empty</p>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div key={index} className="cart-item">
                <div className="cart-item-image">
                  <div className="item-image-placeholder">
                    <span>🛒</span>
                  </div>
                </div>
                <div className="cart-item-details">
                  <h4 className="cart-item-name">{item.name}</h4>
                  <div className="cart-item-price-quantity">
                    <span>{item.quantity} kg × ৳{item.price.toFixed(2)}</span>
                  </div>
                </div>
                <button 
                  className="cart-item-remove"
                  onClick={() => onRemoveItem(index)}
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <>
            <div className="cart-summary">
              <span className="cart-summary-text">{totalItems} Product</span>
              <span className="cart-total">৳{totalPrice.toFixed(2)}</span>
            </div>

            <div className="cart-actions">
              <Link to="/checkout" className="checkout-btn" onClick={onClose}>
                Checkout
              </Link>
              <Link to="/cart" className="go-to-cart-btn" onClick={onClose}>
                Go To Cart
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default ShoppingCart
