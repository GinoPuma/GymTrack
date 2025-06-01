import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow">
      <div className="container-fluid">
        <Link
          className="navbar-brand d-flex align-items-center"
          to={
            userInfo
              ? userInfo.role === "trainer"
                ? "/trainer-dashboard"
                : userInfo.role === "client"
                ? "/client-dashboard"
                : "/admin-dashboard"
              : "/"
          }
        >
          <span className="h4 mb-0 text-white me-2">GYMTRACK</span>
          <span className="badge bg-primary rounded-pill">FIT</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {userInfo && userInfo.role === "trainer" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/trainer-dashboard">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/trainer/exercise-catalog">
                    Ejercicios
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/trainer/meal-catalog">
                    Comidas
                  </Link>
                </li>
              </>
            )}
            {userInfo && userInfo.role === "client" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/client-dashboard">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/client/progress">
                    Progreso
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/chatbot">
                    Chatbot
                  </Link>
                </li>
              </>
            )}
            {userInfo &&
              userInfo.role === "admin" && ( 
                <li className="nav-item">
                  <Link className="nav-link" to="/admin-dashboard">
                    Administración
                  </Link>
                </li>
              )}
          </ul>
          {userInfo ? (
            <ul className="navbar-nav">
              <li className="nav-item">
                <span className="nav-link text-white-50">
                  Hola, {userInfo.username}
                </span>
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-outline-light ms-2"
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </button>
              </li>
            </ul>
          ) : (
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="btn btn-outline-light me-2" to="/login">
                  Iniciar Sesión
                </Link>
              </li>
              <li className="nav-item">
                <Link className="btn btn-primary" to="/register">
                  Registrarse
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
