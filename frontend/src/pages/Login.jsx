import "../styles/Form.css"
import {useState, useContext} from "react";
import axios from "axios";
import {useNavigate} from "react-router";
import {UsernameContext} from "../App.jsx";

function Login({}) {
    const [ , setCurrentUser] = useContext(UsernameContext);
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
            const res = await axios.post("/api/auth/login", inputs)
            localStorage.setItem("resData", JSON.stringify(res.data))
            setCurrentUser(JSON.parse(localStorage.getItem("resData")))

            navigate("/")
        } catch (error) {
            setErrorMessage("Your username or password is incorrect !")
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