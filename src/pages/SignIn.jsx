import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './SignIn.css'

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  return (
    <div className="signin-page">
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <Link to="/" className="breadcrumb-link">Home</Link>
        <span className="breadcrumb-separator"> &gt; </span>
        <span className="breadcrumb-link">Account</span>
        <span className="breadcrumb-separator"> &gt; </span>
        <span className="breadcrumb-active">Sign In</span>
      </div>

      {/* Sign In Modal */}
      <div className="signin-container">
        <div className="signin-modal">
          <h2 className="signin-title">Sign In</h2>
          
          <form className="signin-form">
            {/* Email or Phone Input */}
            <div className="form-group">
              <input
                type="text"
                placeholder="Email or Phone"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Input */}
            <div className="form-group password-group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>

            {/* Remember Me and Forget Password */}
            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="forget-password">
                Forget Password
              </Link>
            </div>

            {/* Login Button */}
            <button type="submit" className="login-button">
              Login
            </button>

            {/* Register Link */}
            <div className="register-link">
              <span>Don't have account? </span>
              <Link to="/register" className="register-link-text">
                Register
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignIn