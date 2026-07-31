import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../auth/AuthContext";

function Navbar({ fantasyCount }) {

    const {
        user,
        isAuthenticated,
        logout
    } = useAuth();


    return (
        <header className="navbar">
            <NavLink to="/" className="brand">
                Premier Zone
            </NavLink>

            <nav className="nav-links">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/players">Players</NavLink>
                <NavLink to="/compare">Compare</NavLink>
                <NavLink to="/teams">Teams</NavLink>
                <NavLink to="/fantasy">
                    Fantasy Team
                    {fantasyCount > 0 && (
                        <span className="fantasy-nav-count">
      {fantasyCount}
    </span>
                    )}
                </NavLink>
                {isAuthenticated ? (
                    <>
                        <NavLink to="/account">
                            {user.displayName}
                        </NavLink>

                        <button
                            type="button"
                            className="navbar-logout"
                            onClick={logout}
                        >
                            Log Out
                        </button>
                    </>
                ) : (
                    <>
                        <NavLink to="/login">Log In</NavLink>
                        <NavLink to="/register">Register</NavLink>
                    </>
                )}

            </nav>
        </header>
    );
}

export default Navbar;