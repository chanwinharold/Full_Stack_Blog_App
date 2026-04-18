import "../styles/Home.css"
import "../styles/animations.css"
import {Link, useLocation} from "react-router";
import {useEffect, useState, forwardRef} from "react";
import axios from "axios";
import { API_URL, UPLOAD_URL } from "../config";
import { useScrollReveal } from "../hooks/useScrollReveal";

function Home() {
    const [Posts, setPosts] = useState([])
    const [featuredPost, setFeaturedPost] = useState(null)
    const [loading, setLoading] = useState(true)
    const location = useLocation()
    const category = location.search

    useEffect(() => {
        setLoading(true)
        const fetchData = async () => {
            try {
                const res = await axios.get(`${API_URL}/posts${category}`)
                setPosts(res.data)
                if (res.data.length > 0 && !category) {
                    setFeaturedPost(res.data[0])
                    setPosts(res.data.slice(1))
                }
                setLoading(false)
            } catch (error) {
                console.error("Error fetching data: ", error)
                setLoading(false)
            }
        }
        fetchData()
    }, [category])

    const estimateReadTime = (text) => {
        if (!text) return '1 min'
        const words = text.split(/\s+/).length
        const minutes = Math.ceil(words / 200)
        return `${minutes} min read`
    }

    const formatDate = (dateString) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }

    const splitTitle = (title) => {
        if (!title) return null
        return title.split(' ').map((word, i) => (
            <span key={i} className="hero-title-word" style={{ animationDelay: `${i * 80}ms` }}>
                <span>{word} </span>
            </span>
        ))
    }

    if (loading) {
        return (
            <main className="home-container">
                <div className="home-posts">
                    <div className="skeleton-card skeleton-card--featured">
                        <div className="skeleton-card__image skeleton" />
                        <div className="skeleton-card__content">
                            <div className="skeleton-card__title skeleton" style={{ width: '70%', height: 48 }} />
                            <div className="skeleton-card__text skeleton" style={{ width: '100%', height: 20 }} />
                            <div className="skeleton-card__text skeleton" style={{ width: '80%', height: 20 }} />
                        </div>
                    </div>
                    {[1, 2, 3].map(i => (
                        <div key={i} className="skeleton-card skeleton-card--compact">
                            <div className="skeleton-card__image skeleton" style={{ height: 160 }} />
                            <div className="skeleton-card__title skeleton" style={{ width: '80%', height: 24, marginTop: 12 }} />
                        </div>
                    ))}
                </div>
            </main>
        )
    }

    return (
        <main className="home-container">
            {featuredPost && !category && (
                <section className="hero-section">
                    <span className="hero-label hero-badge">Featured</span>
                    <h1 className="hero-title">
                        <Link to={`post/${featuredPost.id}`}>
                            {splitTitle(featuredPost.title)}
                        </Link>
                    </h1>
                    <div className="hero-meta">
                        <span>{featuredPost.username}</span>
                        <span>{formatDate(featuredPost.date)}</span>
                        <span>{estimateReadTime(featuredPost.description)}</span>
                    </div>
                </section>
            )}

            <div className="home-posts">
                {Posts.map((post, index) => (
                    <RevealedCard 
                        key={post.id} 
                        post={post} 
                        index={index}
                        nextPost={Posts[index + 1]}
                        formatDate={formatDate}
                        estimateReadTime={estimateReadTime}
                    />
                ))}
            </div>
        </main>
    )
}

function RevealedCard({ post, index, nextPost, formatDate, estimateReadTime }) {
    const { ref, isVisible } = useScrollReveal(0.15)

    if (index % 3 === 0) {
        return (
            <section 
                ref={ref} 
                className={`post-card-featured card-reveal ${isVisible ? '' : 'card-reveal-delay-1'}`}
            >
                <div className="post-image">
                    <img srcSet={`${UPLOAD_URL}/${post?.img}`} alt=""/>
                    <span className="post-category">{post.category}</span>
                </div>
                <div className="post-card-content">
                    <Link to={`post/${post.id}`}>
                        <h2 className="card-title">{post.title}</h2>
                    </Link>
                    <p className="post-excerpt">{String(post.description).slice(0, 300)}...</p>
                    <div className="post-meta">
                        <span>{post.username}</span>
                        <span>•</span>
                        <span>{formatDate(post.date)}</span>
                        <span>•</span>
                        <span>{estimateReadTime(post.description)}</span>
                    </div>
                    <Link to={`post/${post.id}`} className="post-read-more">Read Article</Link>
                </div>
            </section>
        )
    }

    if (index % 3 === 1) {
        return (
            <section className="post-card-compact-row">
                {post && (
                    <RevealedCompactCard 
                        post={post} 
                        delay={index * 120} 
                        formatDate={formatDate}
                    />
                )}
                {nextPost && (
                    <RevealedCompactCard 
                        post={nextPost} 
                        delay={(index + 1) * 120} 
                        formatDate={formatDate}
                    />
                )}
            </section>
        )
    }

    return null
}

function RevealedCompactCard({ post, delay, formatDate }) {
    const { ref, isVisible } = useScrollReveal(0.15)

    return (
        <article 
            ref={ref}
            className={`post-card-compact card-reveal`}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="post-image">
                <img srcSet={`${UPLOAD_URL}/${post?.img}`} alt=""/>
                <span className="post-category">{post.category}</span>
            </div>
            <Link to={`post/${post.id}`}>
                <h2>{post.title}</h2>
            </Link>
            <p className="post-excerpt">{String(post.description).slice(0, 150)}...</p>
            <div className="post-meta">
                <span>{post.username}</span>
                <span>•</span>
                <span>{formatDate(post.date)}</span>
            </div>
        </article>
    )
}

export default Home