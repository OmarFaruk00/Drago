import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './CreateAccountModal.css'

const CreateAccountModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    division: '',
    password: ''
  })
  const [acceptTerms, setAcceptTerms] = useState(false)

  if (!isOpen) return null

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle account creation
    onClose()
  }

  const handleSwitchToLogin = () => {
    onClose()
    if (onSwitchToLogin) {
      onSwitchToLogin()
    }
  }

  return (
    <div className="create-account-modal-overlay" onClick={handleOverlayClick}>
      <div className="create-account-modal-content">
        <button className="modal-close-btn" onClick={onClose}>×</button>
        
        <div className="create-account-modal">
          <h2 className="create-account-title">Create Account</h2>
          
          <form className="create-account-form" onSubmit={handleSubmit}>
            {/* Name Input */}
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="form-input"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Email Input */}
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="form-input"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Phone Input */}
            <div className="form-group">
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                className="form-input"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Address Input */}
            <div className="form-group">
              <input
                type="text"
                name="address"
                placeholder="Address"
                className="form-input"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Division Input */}
            <div className="form-group">
              <input
                type="text"
                name="division"
                placeholder="Division"
                className="form-input"
                value={formData.division}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Password Input */}
            <div className="form-group password-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="form-input"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>

            {/* Accept Terms Checkbox */}
            <div className="form-group">
              <label className="terms-checkbox">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  required
                />
                <span>Accept all terms & Conditions</span>
              </label>
            </div>

            {/* Create Account Button */}
            <button type="submit" className="create-account-button">
              Create Account
            </button>

            {/* Login Link */}
            <div className="login-link">
              <span>Already have account </span>
              <button
                type="button"
                className="login-link-text"
                onClick={handleSwitchToLogin}
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateAccountModal
