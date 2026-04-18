import { useState, useEffect } from "react";
import "./DemoCredentialsBanner.css";

const DEMO_CREDENTIALS = {
  username: "admin",
  password: "azertyazerty"
};

const STORAGE_KEY = "demo_banner_dismissed";

function DemoCredentialsBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(12);
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    const dismissed = sessionStorage.getItem(STORAGE_KEY);
    if (dismissed) return;

    setIsVisible(true);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleDismiss();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, "true");
    setIsVisible(false);
  };

  const handleCopy = async (field) => {
    const value = field === "username" ? DEMO_CREDENTIALS.username : DEMO_CREDENTIALS.password;
    await navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  if (!isVisible) return null;

  return (
    <div className="demo-banner">
      <div className="demo-banner__accent-bar" />
      <button className="demo-banner__close" onClick={handleDismiss} aria-label="Fermer">
        ✕
      </button>
      <h3 className="demo-banner__title">🔐 Accès Admin Démo</h3>
      <div className="demo-banner__credentials">
        <div className="demo-banner__row">
          <span className="demo-banner__label">Identifiant</span>
          <span className="demo-banner__value">
            {DEMO_CREDENTIALS.username}
            <button
              className={`demo-banner__copy ${copiedField === "username" ? "demo-banner__copy--copied" : ""}`}
              onClick={() => handleCopy("username")}
            >
              {copiedField === "username" ? "✓ Copié" : "📋"}
            </button>
          </span>
        </div>
        <div className="demo-banner__row">
          <span className="demo-banner__label">Mot de passe</span>
          <span className="demo-banner__value">
            {DEMO_CREDENTIALS.password}
            <button
              className={`demo-banner__copy ${copiedField === "password" ? "demo-banner__copy--copied" : ""}`}
              onClick={() => handleCopy("password")}
            >
              {copiedField === "password" ? "✓ Copié" : "📋"}
            </button>
          </span>
        </div>
      </div>
      <p className="demo-banner__hint">Cliquez sur 📋 pour copier puis allez sur Login</p>
      <div className="demo-banner__progress">
        <div
          className="demo-banner__progress-bar"
          style={{ animationDuration: `${timeLeft}s` }}
        />
      </div>
    </div>
  );
}

export default DemoCredentialsBanner;