import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Dashboard.css'

const Dashboard = () => {
  const navigate = useNavigate()

  const orders = [
    { id: '#738', date: 'Jan 10, 2024', total: '$120.00', status: 'Processing' },
    { id: '#703', date: 'Jan 8, 2024', total: '$85.50', status: 'On the way' },
    { id: '#130', date: 'Jan 5, 2024', total: '$250.00', status: 'Completed' },
    { id: '#561', date: 'Jan 3, 2024', total: '$180.00', status: 'Completed' },
    { id: '#536', date: 'Jan 1, 2024', total: '$95.00', status: 'Completed' },
    { id: '#492', date: 'Dec 28, 2023', total: '$320.00', status: 'Completed' }
  ]

  const getStatusClass = (status) => {
    switch(status.toLowerCase()) {
      case 'processing':
        return 'status-processing'
      case 'on the way':
        return 'status-onway'
      case 'completed':
        return 'status-completed'
      default:
        return ''
    }
  }

  return (
    <div className="dashboard-page">
      {/* Breadcrumb */}
      <div className="dashboard-breadcrumb">
        <div className="dashboard-breadcrumb-container">
          <Link to="/" className="breadcrumb-item">
            <span>Home</span>
          </Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-item">Account</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-item active">Dashboard</span>
        </div>
      </div>

      <div className="dashboard-container">
        {/* Left Sidebar Navigation */}
        <aside className="dashboard-sidebar">
          <h3 className="sidebar-title">Navigation</h3>
          <nav className="sidebar-nav">
            <Link to="/dashboard" className="nav-item active">
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
            <Link to="/settings" className="nav-item">
              <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
                <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24" stroke="currentColor" strokeWidth="2"/>
              </svg>
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
        <main className="dashboard-main">
          {/* User Profile Card */}
          <div className="dashboard-card profile-card">
            <div className="profile-image-container">
              <img 
                src="https://i.pravatar.cc/150?img=12" 
                alt="Profile" 
                className="profile-image"
              />
            </div>
            <h3 className="profile-name">Dianne Russell</h3>
            <p className="profile-role">Customer</p>
            <Link to="/edit-profile" className="edit-link">Edit Profile</Link>
          </div>

          {/* Billing Address Card */}
          <div className="dashboard-card billing-card">
            <h3 className="card-title">BILLING ADDRESS</h3>
            <div className="billing-info">
              <p className="billing-name">Dainne Russell</p>
              <p className="billing-address">4140 Parker Rd. Allentown, New Mexico 31134</p>
              <p className="billing-email">dainne.ressell@gmail.com</p>
              <p className="billing-phone">(671) 555-0110</p>
            </div>
            <Link to="/edit-address" className="edit-link">Edit Address</Link>
          </div>

          {/* Recent Order History */}
          <div className="dashboard-card orders-card">
            <div className="orders-header">
              <h3 className="card-title">Recent Order History</h3>
              <Link to="/order-history" className="view-all-link">View All</Link>
            </div>
            <div className="orders-table-container">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>ORDER ID</th>
                    <th>DATE</th>
                    <th>TOTAL</th>
                    <th>STATUS</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={index}>
                      <td className="order-id">{order.id}</td>
                      <td className="order-date">{order.date}</td>
                      <td className="order-total">{order.total}</td>
                      <td>
                        <span className={`status-badge ${getStatusClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <Link to={`/order/${order.id}`} className="view-details-link">View Details</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
