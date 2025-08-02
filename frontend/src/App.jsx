import './styles/App.css'
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx"
import Single from "./pages/Single.jsx";
import Write from "./pages/Write.jsx";

import Navbar from "./components/Navbar.jsx"
import Footer from "./components/Footer.jsx"

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

function App() {

    return (
        <div className="app-container">
            <RouterProvider router={router}/>
        </div>
    )
}

export default App
