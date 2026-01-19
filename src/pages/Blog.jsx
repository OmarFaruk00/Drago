import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Blog.css'

const Blog = () => {
  const [sortBy, setSortBy] = useState('Latest')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedTag, setSelectedTag] = useState('Review')

  const topCategories = [
    { name: 'Smartphones', count: 45 },
    { name: 'Laptops', count: 32 },
    { name: 'Gaming', count: 28 },
    { name: 'Reviews', count: 52 },
    { name: 'Tips & Tricks', count: 38 },
    { name: 'Accessories', count: 41 },
    { name: 'Tech News', count: 67 }
  ]

  const popularTags = ['Review', 'Gaming', 'Unboxing', 'Comparison', 'Best Buy', 'Tips', 'News', 'Tutorial', 'Smartphone', 'Laptop', 'Gadget']

  const blogPosts = [
    {
      id: 1,
      image: '📱',
      date: '18 NOV',
      category: 'Review',
      author: 'Admin',
      comments: 65,
      title: 'iPhone 15 Pro Review: Is It Worth the Upgrade?',
      excerpt: 'We take an in-depth look at Apple\'s latest flagship smartphone, testing its camera, performance, and new features.'
    },
    {
      id: 2,
      image: '💻',
      date: '18 NOV',
      category: 'Review',
      author: 'Admin',
      comments: 52,
      title: 'MacBook Pro M3: The Ultimate Laptop for Professionals',
      excerpt: 'Exploring the power and efficiency of Apple\'s M3 chip in the latest MacBook Pro series.'
    },
    {
      id: 3,
      image: '🎮',
      date: '17 NOV',
      category: 'Gaming',
      author: 'Admin',
      comments: 48,
      title: 'Best Gaming Laptops of 2024: Top Picks Reviewed',
      excerpt: 'Find the perfect gaming laptop for your needs with our comprehensive comparison and recommendations.'
    },
    {
      id: 4,
      image: '🎧',
      date: '17 NOV',
      category: 'Review',
      author: 'Admin',
      comments: 41,
      title: 'Sony WH-1000XM5 vs AirPods Pro: Which Should You Buy?',
      excerpt: 'A detailed comparison of two premium headphone options to help you make the right choice.'
    },
    {
      id: 5,
      image: '⌚',
      date: '16 NOV',
      category: 'Tips & Tricks',
      author: 'Admin',
      comments: 35,
      title: '10 Hidden Features in Apple Watch Series 9',
      excerpt: 'Discover amazing features you might not know about in your Apple Watch.'
    },
    {
      id: 6,
      image: '📷',
      date: '16 NOV',
      category: 'Tech News',
      author: 'Admin',
      comments: 42,
      title: 'Canon Announces Revolutionary New Camera Technology',
      excerpt: 'Breaking news about Canon\'s latest innovation in digital photography.'
    },
    {
      id: 7,
      image: '🔌',
      date: '15 NOV',
      category: 'Accessories',
      author: 'Admin',
      comments: 28,
      title: 'Best Wireless Chargers for 2024',
      excerpt: 'Our top picks for fast and reliable wireless charging solutions.'
    },
    {
      id: 8,
      image: '🚁',
      date: '15 NOV',
      category: 'Review',
      author: 'Admin',
      comments: 33,
      title: 'DJI Mini 4 Pro: Professional Drone for Everyone',
      excerpt: 'Reviewing DJI\'s latest compact drone with professional features.'
    }
  ]

  const galleryImages = [
    '📱', '💻', '🎧', '⌚', '🎮', '📷', '🔌', '🚁', '📺'
  ]

  const recentlyAdded = [
    { id: 1, image: '📱', title: 'iPhone 15 Pro Review: Complete Analysis' },
    { id: 2, image: '💻', title: 'MacBook Pro M3 Performance Testing' },
    { id: 3, image: '🎧', title: 'Top 5 Headphones for Music Lovers' }
  ]

  return (
    <div className="blog-page">
      <div className="blog-content">
        {/* Breadcrumb */}
        <div className="blog-breadcrumb">
          <div className="blog-breadcrumb-container">
            <Link to="/" className="breadcrumb-link">
              <span className="breadcrumb-icon">🏠</span>
              <span>Home</span>
            </Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">Blog</span>
          </div>
        </div>

        <div className="blog-main">
          <div className="blog-main-container">
            {/* Left Sidebar */}
            <aside className="blog-sidebar">
              {/* Filter Button */}
              <button className="filter-button">
                <span className="filter-icon">🔍</span>
                <span>Filter</span>
              </button>

              {/* Search */}
              <div className="sidebar-section search-section">
                <div className="search-input-wrapper">
                  <span className="search-icon">🔍</span>
                  <input type="text" placeholder="Search..." className="search-input" />
                </div>
              </div>

              {/* Top Categories */}
              <div className="sidebar-section">
                <h3 className="sidebar-title">Top Categories</h3>
                <ul className="category-list">
                  {topCategories.map((category, index) => (
                    <li key={index}>
                      <button
                        className={`category-item ${selectedCategory === category.name ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(category.name)}
                      >
                        {category.name} <span className="category-count">({category.count})</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Popular Tags */}
              <div className="sidebar-section">
                <h3 className="sidebar-title">Popular Tag</h3>
                <div className="tags-container">
                  {popularTags.map((tag, index) => (
                    <button
                      key={index}
                      className={`tag-button ${selectedTag === tag ? 'active' : ''}`}
                      onClick={() => setSelectedTag(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Our Gallery */}
              <div className="sidebar-section">
                <h3 className="sidebar-title">Our Gallery</h3>
                <div className="gallery-grid">
                  {galleryImages.map((image, index) => (
                    <div key={index} className="gallery-item">
                      <span className="gallery-image">{image}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recently Added */}
              <div className="sidebar-section">
                <h3 className="sidebar-title">Recently Added</h3>
                <div className="recently-added-list">
                  {recentlyAdded.map((item) => (
                    <div key={item.id} className="recent-item">
                      <div className="recent-image">
                        <span>{item.image}</span>
                      </div>
                      <div className="recent-content">
                        <p className="recent-title">{item.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="blog-posts-area">
              {/* Controls */}
              <div className="blog-controls">
                <div className="sort-dropdown">
                  <label>Sort by:</label>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="Latest">Latest</option>
                    <option value="Oldest">Oldest</option>
                    <option value="Popular">Popular</option>
                  </select>
                </div>
                <div className="results-found">{blogPosts.length} Results Found</div>
              </div>

              {/* Blog Posts Grid */}
              <div className="blog-posts-grid">
                {blogPosts.map((post) => (
                  <article key={post.id} className="blog-post-card">
                    <div className="post-image-container">
                      <div className="post-image">
                        <span className="post-image-icon">{post.image}</span>
                      </div>
                      <div className="post-date-overlay">
                        <span className="date-text">{post.date}</span>
                      </div>
                    </div>
                    <div className="post-content">
                      <div className="post-meta">
                        <span className="meta-item">
                          <span className="meta-icon">📝</span>
                          <span>{post.category}</span>
                        </span>
                        <span className="meta-item">
                          <span className="meta-icon">👤</span>
                          <span>By {post.author}</span>
                        </span>
                        <span className="meta-item">
                          <span className="meta-icon">💬</span>
                          <span>{post.comments} Comments</span>
                        </span>
                      </div>
                      <p className="post-excerpt">{post.excerpt}</p>
                      <Link to={`/blog/${post.id}`} className="read-more-link">
                        Read More →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Blog
