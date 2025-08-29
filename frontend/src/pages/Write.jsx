import "../styles/Write.css"

import React, {useContext, useState} from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import axios from "axios";
import {useLocation, useNavigate} from "react-router";
import moment from "moment";
import {UserContext} from "../App.jsx";


function Write() {
    const [currentUser, ] = useContext(UserContext)
    const navigate = useNavigate()
    const postState = useLocation().state
    const [value, setValue] = useState(postState?.description || '');
    const [title, setTitle] = useState(postState?.title || '');
    const [img, setImg ] = useState(null);
    const [category, setCategory] = useState(postState?.category || '');

    const Links = ["art", "science", "technology", "cinema", "design", "food"]

    const upload = async () => {
        try {
            const formData = new FormData();
            formData.append( "file", img)
            const res =  await axios.post("/api/upload", formData)
            return (res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit = async () => {
        const imgUrl = await upload()

        try {
            postState
                ? await axios.put(`/api/posts/${postState.id}`, {
                    title, description:value, category, img:img ? imgUrl : ""
                }, {headers: {'Authorization': `Bearer ${currentUser.token}`}})
                : await axios.post(`/api/posts`, {
                    title, description:value, category, img:img ? imgUrl : "", date:moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
                }, {headers: {'Authorization': `Bearer ${currentUser.token}`}})
            navigate("/")
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <main className="write-container">

            <section className="editor-container">

                <label><input id="title" type="text" placeholder="Title..." value={title} onChange={(e) => setTitle(e.target.value)}/></label>

                <div className="textarea-container">
                    <ReactQuill className="textarea" theme="snow" value={value} onChange={setValue} />
                </div>
            </section>

            <section className="right-container">

                <div className="item-one">
                    <h2>Publish</h2>
                    <span><b>Status : </b> Draft</span>
                    <span><b>Visibility : </b> Public</span>
                    <label><input id="image" name="file" type="file" onChange={(e) => setImg(e.target.files[0])}/></label>
                    <button type="button" onClick={handleSubmit}>Publish</button>
                </div>

                <div className="item-two">
                    <h2>Category</h2>
                    {
                        Links.map((link, index) => (
                            <div key={`${link}-${index}`} className="radio-container">
                                <input id={link} type="radio" checked={category === link} name="category" value={link} onChange={(e) => setCategory(e.target.value)} />
                                <label htmlFor={link}>{link.toUpperCase()}</label>
                            </div>
                        ))
                    }
                </div>
            </section>
        </main>
    )
}

export default Write