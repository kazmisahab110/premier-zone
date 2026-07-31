import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

function ProtectedRoute({ children }) {
    const {
        isAuthenticated,
        authLoading
    } = useAuth();

    const location = useLocation();

    if (authLoading) {
        return (
            <main className="page">
                <div className="message">
                    Checking your account...
                </div>
            </main>
        );
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    return children;
}

export default ProtectedRoute;