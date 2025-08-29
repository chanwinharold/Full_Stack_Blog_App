import "../styles/Home.css"
import {Link, useLocation} from "react-router";
import {useEffect, useState} from "react";
import axios from "axios";

function Home() {
    const [Posts, setPosts] = useState([])
    const location = useLocation()

    const category = location.search

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`/api/posts${category}`)
                return setPosts(res.data)
            } catch (error) {
                console.error("Erreur détecté lors de la récupération des données : ", error)
            }
        }
        fetchData()
    }, [category]);

    return (
        <main className="home-container">
            <div className="home-posts">
                {
                    Posts.map(post => (
                        <section key={post.id}>
                            <div className="post-image">
                                <img srcSet={`/uploads/${post?.img}`} alt=""/>
                            </div>
                            <div className="post-content">
                                <Link to={`post/${post.id}`}>
                                    <h2>{post.title}</h2>
                                </Link>
                                <p>{String(post.description).slice(0, 400)}...</p>
                                <Link to={`post/${post.id}`}>
                                    <button>Read More</button>
                                </Link>
                            </div>
                        </section>
                    ))
                }
            </div>
        </main>
    )
}

export default Home