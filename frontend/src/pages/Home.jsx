import "../styles/Home.css"
import {Link, useLocation} from "react-router";
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {UserContext} from "../App.jsx";

function Home() {
    const [Posts, setPosts] = useState([])
    const [currentUser, ] = useContext(UserContext)
    const location = useLocation()

    const category = location.search

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`/api/posts${category}`, {
                    headers: {'Authorization': `Bearer ${currentUser.token}`}
                })
                return setPosts(res.data)
            } catch (error) {
                console.error("Erreur détecté lors de la récupération des données : ", error)
            }
        }
        fetchData()
    }, [category]);

    // const Posts = [
    //     {
    //         id: 1,
    //         title: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
    //         desc: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. A possimus excepturi aliquid nihil cumque ipsam facere aperiam at! Ea dolorem ratione sit debitis deserunt repellendus numquam ab vel perspiciatis corporis!",
    //         img: "https://images.pexels.com/photos/7008010/pexels-photo-7008010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    //     },
    //     {
    //         id: 2,
    //         title: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
    //         desc: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. A possimus excepturi aliquid nihil cumque ipsam facere aperiam at! Ea dolorem ratione sit debitis deserunt repellendus numquam ab vel perspiciatis corporis!",
    //         img: "https://images.pexels.com/photos/6489663/pexels-photo-6489663.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    //     },
    //     {
    //         id: 3,
    //         title: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
    //         desc: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. A possimus excepturi aliquid nihil cumque ipsam facere aperiam at! Ea dolorem ratione sit debitis deserunt repellendus numquam ab vel perspiciatis corporis!",
    //         img: "https://images.pexels.com/photos/4230630/pexels-photo-4230630.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    //     },
    //     {
    //         id: 4,
    //         title: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
    //         desc: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. A possimus excepturi aliquid nihil cumque ipsam facere aperiam at! Ea dolorem ratione sit debitis deserunt repellendus numquam ab vel perspiciatis corporis!",
    //         img: "https://images.pexels.com/photos/6157049/pexels-photo-6157049.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    //     },
    // ];

    return (
        <main className="home-container">
            <div className="home-posts">
                {
                    Posts.map(post => (
                        <section key={post.id}>
                            <div className="post-image">
                                <img srcSet={post.img} alt=""/>
                            </div>
                            <div className="post-content">
                                <Link to={`post/${post.id}`}>
                                    <h2>{post.title}</h2>
                                </Link>
                                <p>{post.description}</p>
                                <button>Read More</button>
                            </div>
                        </section>
                    ))
                }
            </div>
        </main>
    )
}

export default Home