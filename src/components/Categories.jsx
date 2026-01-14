import React, { useState } from 'react'
import './Categories.css'

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState('Fresh Vegetables')

  const categories = [
    { id: 1, name: 'Fresh Fruit', icon: '🍎' },
    { id: 2, name: 'Fresh Vegetables', icon: '🥬' },
    { id: 3, name: 'Meat & Fish', icon: '🥩' },
    { id: 4, name: 'Snacks', icon: '🍿' },
    { id: 5, name: 'Beverages', icon: '🥤' },
    { id: 6, name: 'Beauty & Health', icon: '💄' },
    { id: 7, name: 'Bread & Bakery', icon: '🥖' },
    { id: 8, name: 'Baking Needs', icon: '🧁' },
    { id: 9, name: 'Cooking', icon: '🍳' },
    { id: 10, name: 'Diabetic Food', icon: '🍬' },
    { id: 11, name: 'Dish Detergents', icon: '🧴' },
    { id: 12, name: 'Oil', icon: '🫒' },
  ]

  return (
    <section className="categories-section">
      <div className="categories-container">
        <div className="section-header">
          <h2 className="section-title">Categories</h2>
          <a href="#view-all" className="view-all-link">View All →</a>
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