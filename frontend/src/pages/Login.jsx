import "../styles/Form.css"

function Login() {


    return (
        <div className="form-container">
            <h1>Login</h1>
            <form className="form">
                <label><input id="username" type="text" name="username" placeholder="Enter your username..." required/></label>
                <label><input id="password" type="password" name="password" placeholder="Enter your password..." required/></label>
                <button type="submit">Login</button>
                <p>Your username or password is incorrect.</p>
            </form>
            <p>Do you have an account? <a href="/register">Register</a></p>
        </div>
    )
}

export default Login