import './SkeletonCard.css';

function SkeletonCard({ variant = 'featured' }) {
  if (variant === 'featured') {
    return (
      <div className="skeleton-card skeleton-card--featured">
        <div className="skeleton-card__image skeleton" />
        <div className="skeleton-card__content">
          <div className="skeleton-card__title skeleton" style={{ width: '70%', height: 24 }} />
          <div className="skeleton-card__text skeleton" style={{ width: '100%', height: 16 }} />
          <div className="skeleton-card__text skeleton" style={{ width: '80%', height: 16 }} />
          <div className="skeleton-card__meta skeleton" style={{ width: 120, height: 12 }} />
        </div>
      </div>
    );
  }

  return (
    <div className="skeleton-card skeleton-card--compact">
      <div className="skeleton-card__image skeleton" style={{ height: 160 }} />
      <div className="skeleton-card__title skeleton" style={{ width: '80%', height: 20, marginTop: 12 }} />
      <div className="skeleton-card__text skeleton" style={{ width: '60%', height: 14, marginTop: 8 }} />
    </div>
  );
}

export default SkeletonCard;