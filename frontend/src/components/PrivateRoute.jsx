import { Navigate, useLocation } from "react-router";
import { useContext } from "react";
import { UserContext } from "../App.jsx";

// FIX: PrivateRoute component to protect admin routes
// This prevents access to protected routes without authentication
function PrivateRoute({ children }) {
    const [currentUser] = useContext(UserContext);
    const location = useLocation();

    // FIX: If not logged in, redirect to login
    if (!currentUser) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}

export default PrivateRoute;