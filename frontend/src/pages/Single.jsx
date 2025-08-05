import "../styles/Single.css"
import {Link, useLocation, useNavigate} from "react-router";
import Menu from "../components/Menu.jsx";
import {useContext, useEffect, useState} from "react";
import {UserContext} from "../App.jsx";
import axios from "axios";
import moment from "moment";

function Single() {

    const [post, setPost] = useState([])
    const [currentUser, ] = useContext(UserContext)
    const navigate = useNavigate()

    const location = useLocation()
    const postId = location.pathname.split("/")[2]

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`/api/posts/${postId}`, {
                    headers: {'Authorization': `Bearer ${currentUser.token}`}
                })
                return setPost(res.data)
            } catch (error) {
                console.error("Erreur détecté lors de la récupération des données : ", error)
            }
        }
        fetchData()
    }, [postId]);

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/posts/${postId}`, {
                headers: {'Authorization': `Bearer ${currentUser.token}`}
            })
            navigate("/")
        } catch (error) {
            console.error("Erreur détecté lors de la suppression des données : ", error)
        }
    }

    return (
        <main className="single-container">
            <section className="content-container">
                <img srcSet={post?.img} alt="image post"/>
                <div className="content-user">
                    <img srcSet={post?.userImg} alt=""></img>
                    <div className="info">
                        <h2>{post.username}</h2>
                        <p>Posted {moment(post.date).fromNow()} </p>
                    </div>
                    {
                        currentUser.username === post.username
                        && (
                            <div className="edit">
                                <Link to={`/write?edit=${postId}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="m21.561 5.318l-2.879-2.879A1.5 1.5 0 0 0 17.621 2c-.385 0-.768.146-1.061.439L13 6H4a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1v-9l3.561-3.561c.293-.293.439-.677.439-1.061s-.146-.767-.439-1.06M11.5 14.672L9.328 12.5l6.293-6.293l2.172 2.172zm-2.561-1.339l1.756 1.728L9 15zM16 19H5V8h6l-3.18 3.18c-.293.293-.478.812-.629 1.289c-.16.5-.191 1.056-.191 1.47V17h3.061c.414 0 1.108-.1 1.571-.29c.464-.19.896-.347 1.188-.64L16 13zm2.5-11.328L16.328 5.5l1.293-1.293l2.171 2.172z"/></svg>
                                </Link>
                                <svg onClick={handleDelete} xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M18 7h-1V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v1H5a1 1 0 0 0 0 2v8c0 2.206 1.794 4 4 4h5c2.206 0 4-1.794 4-4V9a1 1 0 0 0 0-2M8 6h7v1H8zm8 11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9h9zm-7.5-6.5c-.275 0-.5.225-.5.5v6c0 .275.225.5.5.5s.5-.225.5-.5v-6c0-.275-.225-.5-.5-.5m2 0c-.275 0-.5.225-.5.5v6c0 .275.225.5.5.5s.5-.225.5-.5v-6c0-.275-.225-.5-.5-.5m2 0c-.275 0-.5.225-.5.5v6c0 .275.225.5.5.5s.5-.225.5-.5v-6c0-.275-.225-.5-.5-.5m2 0c-.275 0-.5.225-.5.5v6c0 .275.225.5.5.5s.5-.225.5-.5v-6c0-.275-.225-.5-.5-.5"/></svg>
                            </div>
                        )
                    }
                </div>
                <div className="content-post">
                    <h1>{post.title}</h1>
                    {post.description}
                </div>
            </section>

            <Menu category={post.category} postId={postId} />

        </main>
    )
}

export default Single