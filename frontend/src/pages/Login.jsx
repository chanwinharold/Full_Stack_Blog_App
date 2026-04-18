import "../styles/Form.css"
import {useState, useContext} from "react";
import axios from "axios";
import {useNavigate} from "react-router";
import {UserContext} from "../App.jsx";
import { API_URL } from "../config";

// FIX: Configure axios to send credentials (cookies) with requests
// This replaces localStorage token storage
axios.defaults.withCredentials = true

function Login({}) {
    const [, setCurrentUser] = useContext(UserContext);
    const navigate = useNavigate()
    const [errorMessage, setErrorMessage] = useState("")
    const [inputs, setInputs] = useState({
        username : "",
        password : ""
    });

    const handleChange = (e) => {
        const {name, value} = e.target
        setInputs(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            // FIX: Token now comes in httpOnly cookie, not in response body
            const res = await axios.post(`${API_URL}/auth/login`, inputs)

            // FIX: Store non-sensitive user data in context
            // The JWT is now in an httpOnly cookie, not in localStorage
            setCurrentUser({
                username: res.data.username,
                role: res.data.role
            })

            navigate("/")
        } catch (error) {
            if (error.response?.status === 429) {
                setErrorMessage("Too many attempts. Please try again later.")
            } else {
                setErrorMessage("Your username or password is incorrect!")
            }
        }
    }

    return (
        <div className="form-container">
            <h1>Login</h1>
            <form onSubmit={handleSubmit} className="form">
                <label><input id="username" type="text" name="username" placeholder="Enter your username..." onChange={handleChange} required/></label>
                <label><input id="password" type="password" name="password" placeholder="Enter your password..." onChange={handleChange} required/></label>
                <button type="submit">Login</button>
                <p>{errorMessage}</p>
            </form>
            <p>Do you have an account? <a href="/register">Register</a></p>
        </div>
    )
}

export default Login