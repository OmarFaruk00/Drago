import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './AllFiltersPanel.css'

const FILTER_OPTIONS = {
  storage: ['12/128GB', '12/1TB', '12/256GB', '12/512GB', '12GB', '8GB'],
  type: ['Exynos 5G', 'Inactives', 'Regular Box', 'Slim Box', 'Snapdragon 5G'],
  sim: ['Dual', 'Single', 'Regular Box', 'E-Sim'],
  region: ['AUS', 'BD Official', 'CN', 'CN Global'],
  brands: ['Apple', 'Google', 'HONOR', 'OnePlus', 'Samsung', 'Xiaomi']
}

const MAIN_MENU_ITEMS = [
  'Mobile Phone',
  'Tablet',
  'Air pods',
  'Headphone',
  'Wired Headphone',
  'Smart pen',
  'Power Adapter',
  'Hubs & Docks',
  'Home Appliances'
]

const AllFiltersPanel = ({ isOpen, onClose }) => {
  const [priceRange, setPriceRange] = useState([50, 1500])
  const [expandedFilters, setExpandedFilters] = useState({
    price: true,
    storage: true,
    type: true,
    sim: true,
    region: true,
    brands: true
  })
  const [checked, setChecked] = useState({
    storage: [],
    type: [],
    sim: [],
    region: [],
    brands: []
  })

  const toggleFilter = (key) => {
    setExpandedFilters((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const toggleCheck = (filterKey, value) => {
    setChecked((prev) => {
      const arr = prev[filterKey] || []
      const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]
      return { ...prev, [filterKey]: next }
    })
  }

  if (!isOpen) return null

  return (
    <div className="all-filters-overlay" onClick={onClose}>
      <div className="all-filters-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <header className="all-filters-header">
          <span className="all-filters-title">All filters</span>
          <button type="button" className="all-filters-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>

        <div className="all-filters-body">
          {/* Main Menu - Left */}
          <aside className="all-filters-main-menu">
            <div className="main-menu-header">
              <span>Main Menu</span>
              <button type="button" className="main-menu-close" onClick={onClose} aria-label="Close">
                ✕
              </button>
            </div>
            <ul className="main-menu-list">
              {MAIN_MENU_ITEMS.map((item) => (
                <li key={item}>
                  <Link to="/shop" className="main-menu-link" onClick={onClose}>
                    {item}
                    <span className="main-menu-arrow">›</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="main-menu-nav">
              <Link to="/" className="main-menu-nav-link" onClick={onClose}>Home</Link>
              <Link to="/blog" className="main-menu-nav-link" onClick={onClose}>Blog</Link>
              <Link to="/about" className="main-menu-nav-link" onClick={onClose}>About Us</Link>
              <Link to="/contact" className="main-menu-nav-link" onClick={onClose}>Contact Us</Link>
            </div>
          </aside>

          {/* Filters - Right */}
          <section className="all-filters-section">
            <h3 className="filters-heading">Filters</h3>

            {/* Price Range */}
            <div className="filter-block">
              <button
                type="button"
                className="filter-block-title"
                onClick={() => toggleFilter('price')}
              >
                Price
                <span className="filter-chevron">{expandedFilters.price ? '∧' : '∨'}</span>
              </button>
              {expandedFilters.price && (
                <div className="filter-block-content">
                  <div className="price-range-slider-wrap">
                    <input
                      type="range"
                      min="0"
                      max="2000"
                      value={priceRange[0]}
                      onChange={(e) => {
                        const v = Number(e.target.value)
                        setPriceRange([v, v > priceRange[1] ? v : priceRange[1]])
                      }}
                      className="price-range-input price-range-min"
                    />
                    <input
                      type="range"
                      min="0"
                      max="2000"
                      value={priceRange[1]}
                      onChange={(e) => {
                        const v = Number(e.target.value)
                        setPriceRange([v < priceRange[0] ? v : priceRange[0], v])
                      }}
                      className="price-range-input price-range-max"
                    />
                    <div
                      className="price-range-track"
                      style={{
                        left: `${(priceRange[0] / 2000) * 100}%`,
                        width: `${((priceRange[1] - priceRange[0]) / 2000) * 100}%`
                      }}
                    />
                  </div>
                  <p className="price-range-label">
                    Price: {priceRange[0]}-{priceRange[1]}
                  </p>
                </div>
              )}
            </div>

            {/* Storage */}
            <div className="filter-block">
              <button
                type="button"
                className="filter-block-title"
                onClick={() => toggleFilter('storage')}
              >
                Storage
                <span className="filter-chevron">{expandedFilters.storage ? '∧' : '∨'}</span>
              </button>
              {expandedFilters.storage && (
                <div className="filter-block-content">
                  <ul className="filter-check-list">
                    {FILTER_OPTIONS.storage.map((opt) => (
                      <li key={opt}>
                        <label className="filter-check-label">
                          <input
                            type="checkbox"
                            checked={(checked.storage || []).includes(opt)}
                            onChange={() => toggleCheck('storage', opt)}
                            className="filter-checkbox"
                          />
                          <span className="filter-check-text">{opt}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Type */}
            <div className="filter-block">
              <button
                type="button"
                className="filter-block-title"
                onClick={() => toggleFilter('type')}
              >
                Type
                <span className="filter-chevron">{expandedFilters.type ? '∧' : '∨'}</span>
              </button>
              {expandedFilters.type && (
                <div className="filter-block-content">
                  <ul className="filter-check-list">
                    {FILTER_OPTIONS.type.map((opt) => (
                      <li key={opt}>
                        <label className="filter-check-label">
                          <input
                            type="checkbox"
                            checked={(checked.type || []).includes(opt)}
                            onChange={() => toggleCheck('type', opt)}
                            className="filter-checkbox"
                          />
                          <span className="filter-check-text">{opt}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* SIM */}
            <div className="filter-block">
              <button
                type="button"
                className="filter-block-title"
                onClick={() => toggleFilter('sim')}
              >
                SIM
                <span className="filter-chevron">{expandedFilters.sim ? '∧' : '∨'}</span>
              </button>
              {expandedFilters.sim && (
                <div className="filter-block-content">
                  <ul className="filter-check-list">
                    {FILTER_OPTIONS.sim.map((opt) => (
                      <li key={opt}>
                        <label className="filter-check-label">
                          <input
                            type="checkbox"
                            checked={(checked.sim || []).includes(opt)}
                            onChange={() => toggleCheck('sim', opt)}
                            className="filter-checkbox"
                          />
                          <span className="filter-check-text">{opt}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Region */}
            <div className="filter-block">
              <button
                type="button"
                className="filter-block-title"
                onClick={() => toggleFilter('region')}
              >
                Region
                <span className="filter-chevron">{expandedFilters.region ? '∧' : '∨'}</span>
              </button>
              {expandedFilters.region && (
                <div className="filter-block-content">
                  <ul className="filter-check-list">
                    {FILTER_OPTIONS.region.map((opt) => (
                      <li key={opt}>
                        <label className="filter-check-label">
                          <input
                            type="checkbox"
                            checked={(checked.region || []).includes(opt)}
                            onChange={() => toggleCheck('region', opt)}
                            className="filter-checkbox"
                          />
                          <span className="filter-check-text">{opt}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Brands */}
            <div className="filter-block">
              <button
                type="button"
                className="filter-block-title"
                onClick={() => toggleFilter('brands')}
              >
                Brands
                <span className="filter-chevron">{expandedFilters.brands ? '∧' : '∨'}</span>
              </button>
              {expandedFilters.brands && (
                <div className="filter-block-content">
                  <ul className="filter-check-list">
                    {FILTER_OPTIONS.brands.map((opt) => (
                      <li key={opt}>
                        <label className="filter-check-label">
                          <input
                            type="checkbox"
                            checked={(checked.brands || []).includes(opt)}
                            onChange={() => toggleCheck('brands', opt)}
                            className="filter-checkbox"
                          />
                          <span className="filter-check-text">{opt}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default AllFiltersPanel
