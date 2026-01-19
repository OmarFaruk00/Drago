import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Categories.css'

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState('Smartphones')

  const categories = [
    { id: 1, name: 'Smartphones', icon: '📱' },
    { id: 2, name: 'Laptops', icon: '💻' },
    { id: 3, name: 'Headphones', icon: '🎧' },
    { id: 4, name: 'Smart Watches', icon: '⌚' },
    { id: 5, name: 'Tablets', icon: '📱' },
    { id: 6, name: 'Cameras', icon: '📷' },
    { id: 7, name: 'Speakers', icon: '🔊' },
    { id: 8, name: 'Gaming', icon: '🎮' },
    { id: 9, name: 'Accessories', icon: '🔌' },
    { id: 10, name: 'TV & Audio', icon: '📺' },
    { id: 11, name: 'Smart Home', icon: '🏠' },
    { id: 12, name: 'Wearables', icon: '⌚' },
  ]

  return (
    <section className="categories-section">
      <div className="categories-container">
        <div className="section-header">
          <h2 className="section-title">Categories</h2>
          <Link to="/shop" className="view-all-link">View All →</Link>
        </div>
        
        <div className="categories-grid">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`category-card ${selectedCategory === category.name ? 'selected' : ''}`}
              onClick={() => setSelectedCategory(category.name)}
            >
              <div className="category-icon">{category.icon}</div>
              <div className="category-name">{category.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Categories