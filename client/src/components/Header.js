import React from "react";
import { NavLink } from "react-router-dom/cjs/react-router-dom";

function Header() {
    return (
        <div className="header">
            <div>
                <NavLink to="/login" exact>
                    Login
                </NavLink>
            </div>
            <div>
                <NavLink to="/get-started" exact>
                    Get Started
                </NavLink>
            </div>
        </div>
    );
}

export default Header;