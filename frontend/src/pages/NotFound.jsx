import { Link } from "react-router";

function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      color: '#ffffff',
      fontFamily: 'Instrument Sans, sans-serif',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{
        fontSize: '120px',
        fontFamily: 'DM Serif Display, serif',
        margin: '0',
        color: '#e94560'
      }}>404</h1>
      <h2 style={{
        fontSize: '24px',
        marginTop: '16px',
        fontWeight: '500'
      }}>Page Not Found</h2>
      <p style={{
        color: '#a0a0a0',
        marginTop: '8px',
        maxWidth: '400px'
      }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" style={{
        marginTop: '32px',
        padding: '14px 32px',
        background: '#e94560',
        color: '#ffffff',
        textDecoration: 'none',
        borderRadius: '8px',
        fontWeight: '600',
        transition: 'all 0.3s ease'
      }}>
        Back to Home
      </Link>
    </div>
  );
}

export default NotFound;