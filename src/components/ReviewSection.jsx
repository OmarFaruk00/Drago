import React from 'react'
import './ReviewSection.css'

const ReviewSection = () => {
  const reviews = [
    {
      id: 1,
      name: 'Jenny Wilson',
      role: 'Customer',
      text: 'Aenean et nisl eget eros consectetur vestibulum vel id erat. Aliquam feugiat massa dui. Sed sagittis diam sit amet ante sodales semper. Aliquam commodo lorem laoreet ultricies ele.',
      avatar: '👨'
    },
    {
      id: 2,
      name: 'Guy Hawkins',
      role: 'Customer',
      text: 'Proin sed neque nec tellus malesuada ultrices eget a justo. Nullam a nibh faucibus, semper risus ac, ultricies est. Maecenas eget purus in enim imperdiet dapibus in ac mi. Fusce faucibus lacus felis',
      avatar: '👨'
    },
    {
      id: 3,
      name: 'Kathryn Murphy',
      role: 'Customer',
      text: 'Nam sed odio diam. Mauris sagittis sapien sed convallis cursus. Proin mattis ultrices urna ac eleifend. Cras vel nisi nec lectus sagittis venenatis. Curabitur laoreet leo sed lorem pulvina',
      avatar: '👨'
    }
  ]

  return (
    <section className="review-section">
      <div className="review-container">
        <h2 className="review-title">Review Section</h2>
        <div className="review-underline"></div>
        <div className="reviews-grid">
          {reviews.map((review) => (
            <div key={review.id} className="review-card-wrapper">
              <div className="review-card">
                <div className="quote-marks">"</div>
                <p className="review-text">{review.text}</p>
              </div>
              <div className="review-author">
                <div className="author-avatar">
                  <span>{review.avatar}</span>
                </div>
                <div className="author-info">
                  <h4 className="author-name">{review.name}</h4>
                  <p className="author-role">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ReviewSection
