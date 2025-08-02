import "../styles/Form.css"
import {useState} from "react";
import axios from "axios";

function Register() {
    const [inputs, setInputs] = useState({
        username : "",
        email : "",
        password : ""
    });

    const handleChange = (e) => {
        const {name, value } = e.target
        setInputs(prev => ({
            ...prev,
            [name] : value
        }))
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post("/auth/register", inputs)
            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="form-container">
            <h1>Register</h1>
            <form onSubmit={handleSubmit} className="form">
                <label><input id="username" type="text" name="username" placeholder="Enter an username..." value={inputs.username} onChange={handleChange} required/></label>
                <label><input id="email" type="email" name="email" placeholder="Enter an email..." value={inputs.email} onChange={handleChange} required/></label>
                <label><input id="password" type="password" name="password" placeholder="Enter a password..." value={inputs.password} onChange={handleChange} required/></label>
                <button type="submit">Register</button>
                <p>Enter a valid email.</p>
            </form>
            <p>You have already an account ? <a href="/login">Login</a></p>
        </div>
    )
}

export default Register