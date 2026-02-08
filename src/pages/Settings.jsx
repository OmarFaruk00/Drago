import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Settings.css'

const Settings = () => {
  const navigate = useNavigate()
  
  // Account Settings State
  const [accountSettings, setAccountSettings] = useState({
    firstName: 'Dianne',
    lastName: 'Russell',
    email: 'dianne.russell@gmail.com',
    phone: '(603) 555-0123'
  })

  // Billing Address State
  const [billingAddress, setBillingAddress] = useState({
    firstName: 'Dionne',
    lastName: 'Dionne',
    companyName: 'Zakinsoft',
    streetAddress: '4140 Port',
    country: 'United States',
    state: 'Washington DC',
    zipCode: '20033',
    email: 'dianne.russell@gmail.com',
    phone: '(603) 555-0123'
  })

  // Password State
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  const handleAccountChange = (e) => {
    const { name, value } = e.target
    setAccountSettings(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleBillingChange = (e) => {
    const { name, value } = e.target
    setBillingAddress(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswords(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const handleAccountSubmit = (e) => {
    e.preventDefault()
    // Handle account settings save
    console.log('Account settings saved:', accountSettings)
  }

  const handleBillingSubmit = (e) => {
    e.preventDefault()
    // Handle billing address save
    console.log('Billing address saved:', billingAddress)
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    // Handle password change
    console.log('Password changed')
  }

  return (
    <div className="settings-page">
      {/* Breadcrumb */}
      <div className="settings-breadcrumb">
        <div className="settings-breadcrumb-container">
          <Link to="/" className="breadcrumb-item">
            <span className="breadcrumb-icon">🏠</span>
            <span>Home</span>
          </Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-item">Account</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-item active">Settings</span>
        </div>
      </div>

      <div className="settings-container">
        {/* Left Sidebar Navigation */}
        <aside className="settings-sidebar">
          <h3 className="sidebar-title">Navigation</h3>
          <nav className="sidebar-nav">
            <Link to="/dashboard" className="nav-item">
              <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none"/>
                <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none"/>
                <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none"/>
                <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
              <span>Dashboard</span>
            </Link>
            <div className="nav-separator"></div>
            <Link to="/order-history" className="nav-item">
              <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4h16v2H4V4z" stroke="currentColor" strokeWidth="2" fill="none"/>
                <path d="M4 10h16v2H4v-2z" stroke="currentColor" strokeWidth="2" fill="none"/>
                <path d="M4 16h16v2H4v-2z" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
              <span>Order History</span>
            </Link>
            <div className="nav-separator"></div>
            <Link to="/wishlist" className="nav-item">
              <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
              <span>Wishlist</span>
            </Link>
            <div className="nav-separator"></div>
            <Link to="/cart" className="nav-item">
              <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" stroke="currentColor" strokeWidth="2" fill="none"/>
                <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2"/>
                <path d="M16 10a4 4 0 0 1-8 0" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
              <span>Shopping Cart</span>
            </Link>
            <div className="nav-separator"></div>
            <Link to="/settings" className="nav-item active">
              <img src={settingsIcon} alt="" className="nav-icon" />
              <span>Settings</span>
            </Link>
            <div className="nav-separator"></div>
            <Link to="/" className="nav-item" onClick={() => {
              // Handle logout logic here
              navigate('/')
            }}>
              <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" fill="none"/>
                <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="2" fill="none"/>
                <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>Log-out</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="settings-main">
          {/* Account Settings Section */}
          <div className="settings-card">
            <h3 className="settings-card-title">Account Settings</h3>
            <form onSubmit={handleAccountSubmit} className="settings-form">
              <div className="account-form-grid">
                <div className="form-column">
                  <div className="form-group">
                    <label className="form-label">First name</label>
                    <input
                      type="text"
                      name="firstName"
                      className="form-input"
                      value={accountSettings.firstName}
                      onChange={handleAccountChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      className="form-input"
                      value={accountSettings.lastName}
                      onChange={handleAccountChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-input"
                      value={accountSettings.email}
                      onChange={handleAccountChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-input"
                      value={accountSettings.phone}
                      onChange={handleAccountChange}
                    />
                  </div>
                </div>
                <div className="form-column profile-image-column">
                  <div className="profile-image-wrapper">
                    <img 
                      src="https://i.pravatar.cc/150?img=12" 
                      alt="Profile" 
                      className="profile-image-large"
                    />
                    <button type="button" className="choose-image-btn">
                      Choose image
                    </button>
                  </div>
                </div>
              </div>
              <button type="submit" className="settings-submit-btn">
                Save Changes
              </button>
            </form>
          </div>

          {/* Billing Address Section */}
          <div className="settings-card">
            <h3 className="settings-card-title">Billing Address</h3>
            <form onSubmit={handleBillingSubmit} className="settings-form">
              <div className="form-group">
                <label className="form-label">First name</label>
                <input
                  type="text"
                  name="firstName"
                  className="form-input"
                  value={billingAddress.firstName}
                  onChange={handleBillingChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Last name</label>
                <input
                  type="text"
                  name="lastName"
                  className="form-input"
                  value={billingAddress.lastName}
                  onChange={handleBillingChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Company Name <span className="optional">[optional]</span></label>
                <input
                  type="text"
                  name="companyName"
                  className="form-input"
                  value={billingAddress.companyName}
                  onChange={handleBillingChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Street Address</label>
                <input
                  type="text"
                  name="streetAddress"
                  className="form-input"
                  value={billingAddress.streetAddress}
                  onChange={handleBillingChange}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Country / Region</label>
                  <select
                    name="country"
                    className="form-input"
                    value={billingAddress.country}
                    onChange={handleBillingChange}
                  >
                    <option value="United States">United States</option>
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="India">India</option>
                    <option value="UK">UK</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <select
                    name="state"
                    className="form-input"
                    value={billingAddress.state}
                    onChange={handleBillingChange}
                  >
                    <option value="Washington DC">Washington DC</option>
                    <option value="California">California</option>
                    <option value="New York">New York</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Zip Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    className="form-input"
                    value={billingAddress.zipCode}
                    onChange={handleBillingChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    value={billingAddress.email}
                    onChange={handleBillingChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-input"
                    value={billingAddress.phone}
                    onChange={handleBillingChange}
                  />
                </div>
              </div>
              <button type="submit" className="settings-submit-btn">
                Save Changes
              </button>
            </form>
          </div>

          {/* Change Password Section */}
          <div className="settings-card">
            <h3 className="settings-card-title">Change Password</h3>
            <form onSubmit={handlePasswordSubmit} className="settings-form">
              <div className="form-group password-group">
                <label className="form-label">Current Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    name="currentPassword"
                    className="form-input"
                    placeholder="Password"
                    value={passwords.currentPassword}
                    onChange={handlePasswordChange}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => togglePasswordVisibility('current')}
                  >
                    {showPasswords.current ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>
              <div className="form-group password-group">
                <label className="form-label">New Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    name="newPassword"
                    className="form-input"
                    placeholder="Password"
                    value={passwords.newPassword}
                    onChange={handlePasswordChange}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => togglePasswordVisibility('new')}
                  >
                    {showPasswords.new ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>
              <div className="form-group password-group">
                <label className="form-label">Confirm Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    name="confirmPassword"
                    className="form-input"
                    placeholder="Password"
                    value={passwords.confirmPassword}
                    onChange={handlePasswordChange}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => togglePasswordVisibility('confirm')}
                  >
                    {showPasswords.confirm ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>
              <button type="submit" className="settings-submit-btn">
                Change Password
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Settings
