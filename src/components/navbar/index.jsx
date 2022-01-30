import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { updateDoc, doc, Timestamp } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
import { AuthContext } from "../../context/context";

export default function Navbar() {
  const { user } = useContext(AuthContext);
  
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-xl">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarTogglerDemo01"
          aria-controls="navbarTogglerDemo01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
          <Link className="navbar-brand" to="/">
            Social Media
          </Link>
          {!user ? (
            <div className="d-flex ms-auto">
              <Link to="signup" className="me-5">
                Sign Up
              </Link>
              <Link to="signin">Sign In</Link>
            </div>
          ) : (
            <div className="d-flex ms-auto align-items-center">
              <Link to="profile" className="me-5">Profile</Link>
              <button className="btn btn-secondary">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
