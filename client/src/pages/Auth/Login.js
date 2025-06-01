import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Error al iniciar sesión. Intenta de nuevo."
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="card shadow-lg p-4 p-md-5 auth-form-container">
        <h2 className="text-center mb-4 text-primary">Inicia Sesión</h2>
        {error && (
          <div className="alert alert-danger text-center mb-3" role="alert">
            {error}
          </div>
        )}
        {loading && <p className="text-center text-muted">Cargando...</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="floatingEmail"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="floatingEmail">Correo electrónico</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="password"
              className="form-control"
              id="floatingPassword"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor="floatingPassword">Contraseña</label>
          </div>
          <div className="d-grid gap-2 mt-4">
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
            >
              {loading ? "Iniciando..." : "Iniciar Sesión"}
            </button>
          </div>
        </form>
        <p className="text-center mt-3 mb-0 text-muted">
          ¿No tienes una cuenta?{" "}
          <Link to="/register" className="text-decoration-none">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
