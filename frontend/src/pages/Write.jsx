import "../styles/Write.css"

import React, { useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';


function Write() {
    const [value, setValue] = useState('');
    const Links = ["art", "science", "technology", "cinema", "design", "food"]

    return (
        <main className="write-container">

            <section className="editor-container">

                <label><input id="title" type="text" placeholder="Title..."/></label>

                <div className="textarea-container">
                    <ReactQuill className="textarea" theme="snow" value={value} onChange={setValue} />
                </div>
            </section>

            <section className="right-container">

                <div className="item-one">
                    <h2>Publish</h2>
                    <span><b>Status : </b> Draft</span>
                    <span><b>Visibility : </b> Public</span>
                    <label><input id="image" type="file" /></label>
                </div>

                <div className="item-two">
                    <h2>Category</h2>
                    {
                        Links.map((link, index) => (
                            <div key={`${link}-${index}`} className="radio-container">
                                <input id={link} type="radio" name="category" value={link} />
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