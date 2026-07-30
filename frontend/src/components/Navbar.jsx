import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar({ fantasyCount }) {
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
            </nav>
        </header>
    );
}

export default Navbar;