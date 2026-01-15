import React from 'react'
import './ReviewSection.css'

const ReviewSection = () => {
  const reviews = [
    {
      id: 1,
      text: "Aenean et nisl eget eros consectetur vestibulum vel id erat. Aliquam feugiat massa dui. Sed sagittis diam sit amet ante sodales semper. Aliquam commodo lorem laoreet ultricies ele.",
      name: "Jenny Wilson",
      role: "Customer",
      avatar: "👤"
    },
    {
      id: 2,
      text: "Proin sed neque nec tellus malesuada ultrices eget a justo. Nullam a nibh faucibus, semper risus ac, ultricies est. Maecenas eget purus in enim imperdiet dapibus in ac mi. Fusce faucibus lacus felis",
      name: "Guy Hawkins",
      role: "Customer",
      avatar: "👤"
    }
  ]

  return (
    <section className="review-section">
      <div className="review-section-container">
        <h2 className="review-section-title">Review Section</h2>
        
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review.id} className="review-block">
              {/* Review Bubble */}
              <div className="review-bubble">
                <div className="quote-icon">"</div>
                <p className="review-text">{review.text}</p>
                <div className="bubble-tail"></div>
              </div>

              {/* Customer Profile */}
              <div className="customer-profile">
                <div className="profile-picture">
                  <span className="avatar-icon">{review.avatar}</span>
                </div>
                <div className="customer-name">{review.name}</div>
                <div className="customer-role">{review.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ReviewSection