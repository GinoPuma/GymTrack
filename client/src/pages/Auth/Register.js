import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "../../api/axiosInstance";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client"); 
  const [adminAccessKey, setAdminAccessKey] = useState("");

  const [trainerId, setTrainerId] = useState("");
  const [availableTrainers, setAvailableTrainers] = useState([]);
  const [loadingTrainers, setLoadingTrainers] = useState(false);
  const [trainersError, setTrainersError] = useState("");

  const [error, setError] = useState("");
  const { register, loading } = useAuth();

  useEffect(() => {
    if (role === "client") {
      if (availableTrainers.length === 0 || trainersError) {
        if (!loadingTrainers) {
          const fetchTrainers = async () => {
            try {
              setLoadingTrainers(true); 
              setTrainersError(""); 
              const { data } = await axios.get("/users/trainers");
              setAvailableTrainers(data);
            } catch (err) {
              setTrainersError(
                "Error al cargar la lista de entrenadores: " +
                  (err.response?.data?.message || err.message)
              );
              console.error("Error fetching trainers:", err);
            } finally {
              setLoadingTrainers(false);
            }
          };
          fetchTrainers();
        }
      }
    } else {
      setLoadingTrainers(false);
      setTrainersError("");
      setTrainerId(""); 
      setAvailableTrainers([]); 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, trainersError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (role === "client" && !trainerId) {
      setError("Por favor, selecciona un entrenador de la lista.");
      return;
    }
    if (role === "trainer" && !adminAccessKey.trim()) {
      setError("Por favor, introduce la clave de acceso de administrador.");
      return;
    }

    try {
      await register(
        username,
        email,
        password,
        role,
        role === "client" ? trainerId : null,
        role === "trainer" ? adminAccessKey : undefined 
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Error al registrarse. Intenta de nuevo."
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="card shadow-lg p-4 p-md-5 auth-form-container">
        <h2 className="text-center mb-4 text-primary">Regístrate</h2>
        {error && (
          <div className="alert alert-danger text-center mb-3" role="alert">
            {error}
          </div>
        )}
        {loading && <p className="text-center text-muted">Cargando...</p>}
        {trainersError && (
          <div className="alert alert-warning text-center mb-3" role="alert">
            {trainersError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="floatingUsername"
              placeholder="Nombre de Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label htmlFor="floatingUsername">Nombre de Usuario</label>
          </div>
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
          <div className="mb-3">
            <label htmlFor="roleSelect" className="form-label text-muted">
              Rol:
            </label>
            <select
              className="form-select"
              id="roleSelect"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="client">Cliente</option>
              <option value="trainer">Entrenador</option>
            </select>
          </div>

          {/* Sección de selección de entrenador solo si el rol es cliente */}
          {role === "client" && (
            <div className="mb-3">
              <label htmlFor="trainerSelect" className="form-label text-muted">
                Selecciona tu Entrenador:
              </label>
              {loadingTrainers ? (
                <p className="text-muted">Cargando entrenadores...</p>
              ) : availableTrainers.length === 0 ? (
                <div className="alert alert-warning" role="alert">
                  No hay entrenadores disponibles.
                </div>
              ) : (
                <select
                  className="form-select"
                  id="trainerSelect"
                  value={trainerId}
                  onChange={(e) => setTrainerId(e.target.value)}
                  required={role === "client"} 
                >
                  <option value="">-- Selecciona un entrenador --</option>
                  {availableTrainers.map((trainer) => (
                    <option key={trainer._id} value={trainer._id}>
                      {trainer.username} (Entrenador)
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Campo de clave de acceso de administrador, solo si el rol es entrenador */}
          {role === "trainer" && (
            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control"
                id="floatingAdminKey"
                placeholder="Clave de acceso de administrador"
                value={adminAccessKey}
                onChange={(e) => setAdminAccessKey(e.target.value)}
                required 
              />
              <label htmlFor="floatingAdminKey">
                Clave de acceso de administrador
              </label>
            </div>
          )}

          <div className="d-grid gap-2 mt-4">
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading || loadingTrainers}
            >
              {loading || loadingTrainers ? "Cargando..." : "Registrarse"}
            </button>
          </div>
        </form>
        <p className="text-center mt-3 mb-0 text-muted">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" className="text-decoration-none">
            Inicia Sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
