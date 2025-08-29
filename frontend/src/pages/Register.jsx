import "../styles/Form.css"
import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router";

function Register() {
    const [errorMessage, setErrorMessage] = useState("")
    const [isDisabled, setIsDisabled] = useState(true)
    const [inputs, setInputs] = useState({
        username : "",
        email : "",
        password : ""
    });
    const navigate = useNavigate()

    const handleChange = (e) => {
        const {name, value } = e.target
        setInputs(prev => ({
            ...prev,
            [name] : value
        }))
    }

    const handleBlur = (e) => {
        const regex = new RegExp("^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$")
        if (e.target.value === inputs.username) {
            const error = inputs.username.length < 3 ? "Username too small !" : ""
            setErrorMessage(error); return;}
        if (e.target.value === inputs.email) {
            const error = !(regex.test(inputs.email)) ? "Email invalid !" : ""
            setErrorMessage(error); return;}
        if (e.target.value === inputs.password) {
            const error = inputs.password.length < 8 ? "Password should have more than 8 characters" : ""
            setErrorMessage(error)}
        if (inputs.username.length >= 3 && regex.test(inputs.email) && inputs.password.length >= 8) return setIsDisabled(false);
        return setIsDisabled(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post("/api/auth/register", inputs)
            navigate("/login")
        } catch (error) {
            if (error.status === 409) return setErrorMessage("User already exists !")
            return setErrorMessage("Operation failed ! Try again...")
        }
    }

    return (
        <div className="form-container">
            <h1>Register</h1>
            <form onSubmit={handleSubmit} className="form">
                <label><input id="username" type="text" name="username" placeholder="Enter an username..." value={inputs.username} onChange={handleChange} onBlur={handleBlur} max={50} required/></label>
                <label><input id="email" type="email" name="email" placeholder="example@example.xyz" value={inputs.email} onChange={handleChange} onBlur={handleBlur} max={50} required/></label>
                <label><input id="password" type="password" name="password" placeholder="Enter a password..." value={inputs.password} onChange={handleChange} onBlur={handleBlur} max={50} required/></label>
                <button type="submit" disabled={isDisabled}>Register</button>
                <p>{errorMessage}</p>
            </form>
            <p>You have already an account ? <a href="/login">Login</a></p>
        </div>
    )
}

export default Register