import './ErrorFallback.css';

function ErrorFallback({ error, onRetry }) {
  return (
    <div className="error-fallback-container">
      <div className="error-fallback-content">
        <div className="error-fallback-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h1 className="error-fallback-title">Quelque chose s'est mal passé</h1>
        <p className="error-fallback-message">
          Nous avons rencontré une erreur inattendue. Veuillez réessayer.
        </p>
        <button className="error-fallback-button" onClick={onRetry}>
          Recharger
        </button>
      </div>
    </div>
  );
}

export default ErrorFallback;