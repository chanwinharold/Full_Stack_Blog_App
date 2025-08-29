import './styles/App.css'
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx"
import Single from "./pages/Single.jsx";
import Write from "./pages/Write.jsx";

import Navbar from "./components/Navbar.jsx"
import Footer from "./components/Footer.jsx"
import {createContext, useState} from "react";

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
                element: <Write/>
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
            <Navbar/>
            <Outlet/>
            <Footer/>
        </>
    )
}

export const UserContext = createContext()

function App() {
    const [currentUser, setCurrentUser] = useState( JSON.parse(localStorage.getItem("resData")) || null )

    return (
        <div className="app-container">
            <UserContext.Provider value={[currentUser, setCurrentUser]}>
                <RouterProvider router={router}/>
            </UserContext.Provider>
        </div>
    )
}

export default App
