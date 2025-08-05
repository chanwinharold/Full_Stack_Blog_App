import "../styles/Menu.css"
import {useContext, useEffect, useState} from "react";
import {UserContext} from "../App.jsx";
import {Link, useLocation, useNavigate} from "react-router";
import axios from "axios";

function Menu({category, postId}) {

    const [Posts, setPost] = useState([])
    const [currentUser, ] = useContext(UserContext)

    const location = useLocation()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`/api/posts?cat=${category}`, {
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
                            <img srcSet={post.img} alt=""/>
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