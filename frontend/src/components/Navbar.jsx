import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose, IoHome, IoCalendar, IoInformationCircle, IoLogOut, IoLogIn, IoSparkles, IoGrid } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const { isAuthenticated, setIsAuthenticated, user } = useContext(Context);

  const handleLogout = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/v1/user-demo/patient/logout-demo",
        {
          withCredentials: true,
        }
      );
      toast.success(res.data.message);
      setIsAuthenticated(false);
      setShow(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Logout failed");
    }
  };

  const navigateTo = useNavigate();

  const goToLogin = () => {
    setShow(false);
    navigateTo("/login");
  };

  const closeMenu = () => setShow(false);

  return (
    <>
      {/* Main Navbar */}
      <nav className="navbar-main">
        <div className="logo">
          <img src="/logo.svg" alt="MediCare Plus" className="logo-img" />
          <span className="logo-text">MediCare Plus</span>
        </div>
        
        {/* Desktop Links */}
        <div className="desktop-links">
          <Link to="/">Home</Link>
          {isAuthenticated && <Link to="/dashboard">Dashboard</Link>}
          <Link to="/appointment">Appointment</Link>
          <Link to={isAuthenticated ? "/ai-demo" : "/login"} className="ai-link">
            🧠 AI Analysis {!isAuthenticated && "🔒"}
          </Link>
          <Link to="/about">About Us</Link>
          {isAuthenticated ? (
            <button className="logoutBtn btn" onClick={handleLogout}>LOGOUT</button>
          ) : (
            <button className="loginBtn btn" onClick={goToLogin}>LOGIN</button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="hamburger" onClick={() => setShow(true)}>
          <GiHamburgerMenu />
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${show ? "active" : ""}`} onClick={closeMenu}></div>
      
      {/* Mobile Slide Menu */}
      <div className={`mobile-menu ${show ? "active" : ""}`}>
        <div className="mobile-menu-header">
          <div className="welcome-section">
            <span className="welcome-text">Welcome,</span>
            <span className="user-name">{user?.firstName || "Guest"}</span>
          </div>
          <button className="close-btn" onClick={closeMenu}>
            <IoClose />
          </button>
        </div>
        
        <div className="mobile-menu-content">
          <Link to="/" className="menu-item" onClick={closeMenu}>
            <IoHome className="menu-icon" />
            <span>Home</span>
          </Link>
          
          {isAuthenticated && (
            <Link to="/dashboard" className="menu-item" onClick={closeMenu}>
              <IoGrid className="menu-icon" />
              <span>Dashboard</span>
            </Link>
          )}
          
          <Link to="/appointment" className="menu-item" onClick={closeMenu}>
            <IoCalendar className="menu-icon" />
            <span>Appointment</span>
          </Link>
          
          <Link 
            to={isAuthenticated ? "/ai-demo" : "/login"} 
            className="menu-item ai-item" 
            onClick={closeMenu}
          >
            <IoSparkles className="menu-icon" />
            <span>AI Analysis {!isAuthenticated && "🔒"}</span>
          </Link>
          
          <Link to="/about" className="menu-item" onClick={closeMenu}>
            <IoInformationCircle className="menu-icon" />
            <span>About Us</span>
          </Link>
        </div>
        
        <div className="mobile-menu-footer">
          {isAuthenticated ? (
            <button className="menu-logout-btn" onClick={handleLogout}>
              <IoLogOut className="menu-icon" />
              <span>LOG OUT</span>
            </button>
          ) : (
            <button className="menu-login-btn" onClick={goToLogin}>
              <IoLogIn className="menu-icon" />
              <span>LOG IN</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
