import './styles/App.css'
import './styles/animations.css'
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx"
import Single from "./pages/Single.jsx";
import Write from "./pages/Write.jsx";

import Navbar from "./components/Navbar.jsx"
import Footer from "./components/Footer.jsx"
import PrivateRoute from "./components/PrivateRoute.jsx"
import DemoCredentialsBanner from "./components/DemoCredentialsBanner.jsx"
import Cursor from "./components/Cursor.jsx"
import {createContext, useState, useEffect} from "react";
import axios from "axios";
import { API_URL } from "./config";

axios.defaults.withCredentials = true

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout/>,
        children: [
            {
                path: "/",
                element: <Home/>,
            },
            {
                path: "/post/:id",
                element: <Single/>
            },
            {
                path: "/write",
                element: (
                    <PrivateRoute>
                        <Write/>
                    </PrivateRoute>
                )
            }
        ]
    },
    {
        path: "/login",
        element: <Login/>
    },
    {
        path: "/register",
        element: <Register/>
    }
]);

function Layout() {
    return (
        <>
            <Cursor />
            <Navbar/>
            <Outlet/>
            <Footer/>
        </>
    )
}

export const UserContext = createContext()

function App() {
    const [currentUser, setCurrentUser] = useState(null)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.get(`${API_URL}/auth/me`)
                setCurrentUser(res.data)
            } catch (error) {
                setCurrentUser(null)
            }
        }
        checkAuth()
    }, [])

    return (
        <div className="app-container">
            <DemoCredentialsBanner />
            <UserContext.Provider value={[currentUser, setCurrentUser]}>
                <RouterProvider router={router}/>
            </UserContext.Provider>
        </div>
    )
}

export default App