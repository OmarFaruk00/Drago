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
      {/* Header Section */}
      <div className="signin-header">
        <div className="signin-header-content">
          <h1 className="signin-main-title">Sign In</h1>
          <p className="signin-tagline">Enjoy worry-free shopping with fast, secure delivery.</p>
        </div>
        <div className="signin-header-shapes">
          <div className="shape-red"></div>
          <div className="shape-gray"></div>
        </div>
      </div>

      {/* Sign In Form */}
      <div className="signin-container">
        <div className="signin-form-wrapper">
          <p className="form-instruction">Give Your Email or Phone Number</p>
          
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
                  defaultChecked
                />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="forget-password">
                Forget Password
              </Link>
            </div>

            {/* Login Button */}
            <button type="submit" className="login-button">
              Log In <span>→</span>
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <div className="signin-footer">
          <span>Don't Have an Account? </span>
          <Link to="/signup" className="signup-link">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SignIn