import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './SignUp.css'

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    division: '',
    password: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle sign up logic
    console.log('Sign up:', formData)
  }

  return (
    <div className="signup-page">
      {/* Header Section */}
      <div className="signup-header">
        <div className="signup-header-content">
          <h1 className="signup-main-title">Sign up</h1>
          <p className="signup-tagline">Secure shopping with fast delivery and reliable service</p>
        </div>
        <div className="signup-header-shapes">
          <div className="shape-red"></div>
          <div className="shape-gray"></div>
        </div>
      </div>

      {/* Sign Up Form */}
      <div className="signup-container">
        <div className="signup-form-wrapper">
          <form className="signup-form" onSubmit={handleSubmit}>
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

            {/* Create Button */}
            <button type="submit" className="create-button">
              Create <span>→</span>
            </button>
          </form>
        </div>

        {/* Social Sign Up */}
        <div className="social-signup">
          <p className="social-signup-text">Or Sign Up With</p>
          <div className="social-icons">
            <button type="button" className="social-icon-btn facebook-icon">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
            <button type="button" className="social-icon-btn google-icon">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </button>
            <button type="button" className="social-icon-btn apple-icon">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <div className="signup-footer">
          <span>Already Have an Account? </span>
          <Link to="/signin" className="signin-link">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SignUp
