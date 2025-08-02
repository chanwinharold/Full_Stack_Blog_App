import "../styles/Form.css"

function Register() {
    return (
        <div className="form-container">
            <h1>Register</h1>
            <form className="form">
                <label><input id="username" type="text" name="username" placeholder="Enter an username..." required/></label>
                <label><input id="email" type="email" name="email" placeholder="Enter an email..." required/></label>
                <label><input id="password" type="password" name="password" placeholder="Enter a password..." required/></label>
                <button type="submit">Register</button>
                <p>Enter a valid email.</p>
            </form>
            <p>You have already an account ? <a href="/login">Login</a></p>
        </div>
    )
}

export default Register