import "../styles/Menu.css"
import {useContext, useEffect, useState} from "react";
import {UserContext} from "../App.jsx";
import {Link} from "react-router";
import axios from "axios";
import { API_URL, UPLOAD_URL } from "../config";

function Menu({category, postId}) {

    const [Posts, setPost] = useState([])
    const [currentUser, ] = useContext(UserContext)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${API_URL}/posts?cat=${category}`, {
                    headers: {'Authorization': `Bearer ${currentUser.token}`}
                })
                return setPost(res.data)
            } catch (error) {
                console.error("Erreur détecté lors de la récupération des données : ", error)
            }
        }
        fetchData()
    }, [category]);

    return (
        <section className="menu-container">
            <h2>Others posts you may like</h2>
            {

                Posts.map(post => (
                    (Number(post.id) !== Number(postId))
                    && (
                        <div key={post.id} className="post-container">
                            <img srcSet={`${UPLOAD_URL}/${post?.img}`} alt=""/>
                            <h3>{post.title}</h3>
                            <Link to={`/post/${post.id}`}>
                                <button>Read More</button>
                            </Link>
                        </div>
                    )

                ))
            }
        </section>
    )
}

export default Menu