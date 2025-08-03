import "../styles/Form.css"
import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router";

function Login() {
    const [errorMessage, setErrorMessage] = useState("")
    const [inputs, setInputs] = useState({
        username : "",
        password : ""
    });
    const navigate = useNavigate()

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
            navigate("/")
            console.log(res)
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