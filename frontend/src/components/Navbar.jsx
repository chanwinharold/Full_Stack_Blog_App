import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router";
import { UserContext } from "../App.jsx";
import { useContext } from "react";
import "./Navbar.css";

function Navbar() {
    const [currentUser] = useContext(UserContext);
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [scrolledUp, setScrolledUp] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const menuRef = useRef(null);
    const lastScrollY = useRef(0);

    const categories = [
        { name: "Accueil", path: "/" },
        { name: "Articles", path: "/" },
        { name: "Catégories", path: "/" },
        { name: "À propos", path: "/" }
    ];

    const getCategoryLinks = () => [
        { name: "art", path: "/?cat=art" },
        { name: "science", path: "/?cat=science" },
        { name: "technology", path: "/?cat=technology" },
        { name: "cinema", path: "/?cat=cinema" },
        { name: "design", path: "/?cat=design" },
        { name: "food", path: "/?cat=food" },
    ];

    const categoryLinks = getCategoryLinks();

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setIsScrolled(currentScrollY > 60);
            setScrolledUp(currentScrollY < lastScrollY.current && currentScrollY > 60);
            lastScrollY.current = currentScrollY;
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && mobileOpen) {
                setMobileOpen(false);
                document.body.style.overflow = "";
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [mobileOpen]);

    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = "hidden";
            menuRef.current?.querySelector("a")?.focus();
        } else {
            document.body.style.overflow = "";
        }
    }, [mobileOpen]);

    const closeMenu = () => {
        setMobileOpen(false);
        document.body.style.overflow = "";
    };

    const isActive = (path) => {
        if (path === "/") return location.pathname === "/";
        return location.search.includes(path.split("=")[1]);
    };

    return (
        <>
            <header className={`navbar ${isScrolled ? "scrolled" : ""} ${scrolledUp ? "scrolled-up" : ""}`}>
                <Link to="/" className="navbar-brand" onClick={closeMenu}>
                    <span className="brand-letter">c</span>
                    <span className="brand-text">hanwin.</span>
                </Link>

                <nav className="navbar-nav hide-mobile">
                    <ul className="nav-list">
                        {categoryLinks.map((link, i) => (
                            <li key={i} className="nav-item">
                                <Link
                                    to={link.path}
                                    className={`nav-link ${isActive(link.path) ? "active" : ""}`}
                                >
                                    <span className="link-number">{String(i + 1).padStart(2, '0')}</span>
                                    <span className="link-text">{link.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className="nav-actions">
                        {currentUser ? (
                            <>
                                <span className="user-name">{currentUser.username}</span>
                                <Link to="/write" className="nav-link nav-cta">Écrire</Link>
                                <button
                                    onClick={() => { localStorage.removeItem("resData"); window.location.reload(); }}
                                    className="nav-link"
                                >
                                    Déconnexion
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="nav-link">Connexion</Link>
                        )}
                    </div>
                </nav>

                <button
                    className={`hamburger hide-desktop ${mobileOpen ? "open" : ""}`}
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
                    aria-expanded={mobileOpen}
                >
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                </button>
            </header>

            {mobileOpen && (
                <div
                    className="mobile-panel"
                    ref={menuRef}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Menu de navigation"
                >
                    <div className="mobile-panel-accent" />
                    <nav className="mobile-panel-nav">
                        {categoryLinks.map((link, i) => (
                            <Link
                                key={i}
                                to={link.path}
                                className={`mobile-link stagger-${i + 1} ${isActive(link.path) ? "active" : ""}`}
                                onClick={closeMenu}
                            >
                                <span className="mobile-link-number">{String(i + 1).padStart(2, '0')}</span>
                                {link.name}
                            </Link>
                        ))}
                        <div className="mobile-divider" />
                        {currentUser ? (
                            <>
                                <Link to="/write" className="mobile-link stagger-7" onClick={closeMenu}>
                                    Écrire un article
                                </Link>
                                <button
                                    className="mobile-link stagger-8"
                                    onClick={() => { localStorage.removeItem("resData"); window.location.reload(); }}
                                >
                                    Déconnexion
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="mobile-link stagger-7" onClick={closeMenu}>
                                Connexion
                            </Link>
                        )}
                    </nav>
                </div>
            )}

            {mobileOpen && <div className="mobile-overlay" onClick={closeMenu} />}
        </>
    );
}

export default Navbar;