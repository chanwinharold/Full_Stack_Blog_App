import { useEffect, useState, useRef } from "react";
import "../styles/Navbar.css";
import { Link } from "react-router";
import { UserContext } from "../App.jsx";
import { useContext } from "react";

function Navbar() {
    const Links = ["art", "science", "technology", "cinema", "design", "food"];
    const [currentUser] = useContext(UserContext);
    const [isShrunk, setIsShrunk] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const indicatorRef = useRef(null);
    const linkRefs = useRef([]);
    const menuRef = useRef(null);
    const hamburgerRef = useRef(null);

    // Scroll handler
    useEffect(() => {
        let lastScrollY = window.scrollY;
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > 80 && currentScrollY > lastScrollY) {
                setIsShrunk(true);
            } else {
                setIsShrunk(false);
            }
            lastScrollY = currentScrollY;
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Escape key handler for mobile menu
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && mobileMenuOpen) {
                setMobileMenuOpen(false);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [mobileMenuOpen]);

    // Focus trap in mobile menu
    useEffect(() => {
        if (mobileMenuOpen && menuRef.current) {
            const firstFocusable = menuRef.current.querySelector('a, button');
            if (firstFocusable) {
                firstFocusable.focus();
            }
        }
    }, [mobileMenuOpen]);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
        if (!mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
        document.body.style.overflow = '';
    };

    const handleMouseEnter = (index) => {
        setActiveIndex(index);
        updateIndicator(index);
    };

    const handleMouseLeave = () => {
        setActiveIndex(-1);
        if (indicatorRef.current) {
            indicatorRef.current.style.width = '0';
        }
    };

    const updateIndicator = (index) => {
        const link = linkRefs.current[index];
        if (link && indicatorRef.current) {
            const rect = link.getBoundingClientRect();
            const parentRect = link.parentElement.getBoundingClientRect();
            indicatorRef.current.style.left = `${rect.left - parentRect.left}px`;
            indicatorRef.current.style.width = `${rect.width}px`;
        }
    };

    useEffect(() => {
        if (activeIndex === -1 && indicatorRef.current) {
            indicatorRef.current.style.width = '0';
        }
    }, [activeIndex]);

    return (
        <>
            <div className={`navbar-container ${isShrunk ? "navbar-shrink" : ""}`}>
                <Link to={"/"} className="navbar-logo" onClick={closeMobileMenu}>
                    chanwin.
                </Link>

                {/* Desktop Navigation */}
                <nav className="navbar-links hide-mobile">
                    <ul
                        className="navbar-categories"
                        onMouseLeave={handleMouseLeave}
                    >
                        <div
                            ref={indicatorRef}
                            className="nav-indicator"
                        />
                        {Links.map((link, i) => (
                            <li key={`${link}-${i}`}>
                                <Link
                                    to={`/?cat=${link}`}
                                    ref={(el) => (linkRefs.current[i] = el)}
                                    onMouseEnter={() => handleMouseEnter(i)}
                                >
                                    {link}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <ul className="navbar-others">
                        <li>{currentUser ? currentUser.username : ""}</li>
                        <li>
                            {currentUser ? (
                                <Link to={`/login`} onClick={() => { localStorage.removeItem("resData"); closeMobileMenu(); }}>
                                    Logout
                                </Link>
                            ) : (
                                <Link to={`/login`}>Login</Link>
                            )}
                        </li>
                        <li>{currentUser ? <Link to="/write">Write</Link> : null}</li>
                    </ul>
                </nav>

                {/* Mobile Hamburger Button */}
                <button
                    className="hamburger hide-desktop tap-highlight-transparent"
                    onClick={toggleMobileMenu}
                    aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={mobileMenuOpen}
                    ref={hamburgerRef}
                >
                    <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`} />
                    <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`} />
                    <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`} />
                </button>
            </div>

            {/* Mobile Overlay Menu */}
            {mobileMenuOpen && (
                <div
                    className="mobile-menu-overlay"
                    ref={menuRef}
                >
                    <button
                        className="mobile-menu-close tap-highlight-transparent"
                        onClick={closeMobileMenu}
                        aria-label="Close menu"
                    >
                        ✕
                    </button>
                    <nav className="mobile-menu-nav">
                        {Links.map((link, i) => (
                            <Link
                                key={`${link}-${i}`}
                                to={`/?cat=${link}`}
                                className={`mobile-menu-link stagger-${i + 1}`}
                                onClick={closeMobileMenu}
                            >
                                {link}
                            </Link>
                        ))}
                        <div className="mobile-menu-divider" />
                        {currentUser ? (
                            <>
                                <Link
                                    to="/write"
                                    className="mobile-menu-link stagger-7"
                                    onClick={closeMobileMenu}
                                >
                                    Write
                                </Link>
                                <button
                                    className="mobile-menu-link stagger-8"
                                    onClick={() => { localStorage.removeItem("resData"); closeMobileMenu(); }}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="mobile-menu-link stagger-7"
                                    onClick={closeMobileMenu}
                                >
                                    Login
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            )}
        </>
    );
}

export default Navbar;