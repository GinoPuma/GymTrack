import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "../../api/axiosInstance";
import { Link, useNavigate } from "react-router-dom";

const TrainerDashboard = () => {
  const { userInfo, logout, loading: authLoading } = useAuth();
  const [clients, setClients] = useState([]);
  const [loadingContent, setLoadingContent] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading || !userInfo) {
      if (!authLoading && !userInfo) {
        navigate("/login");
      }
      return;
    }

    if (userInfo.role !== "trainer") {
      navigate("/"); 
      return;
    }

    const fetchClients = async () => {
      try {
        const { data } = await axios.get("/users/clients"); 
        setClients(data);
      } catch (err) {
        setError(
          "Error al cargar clientes: " +
            (err.response?.data?.message || err.message)
        );
      } finally {
        setLoadingContent(false);
      }
    };

    fetchClients();
  }, [userInfo, authLoading, navigate]);

  if (authLoading || loadingContent) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="ms-3 lead text-primary">Cargando dashboard...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          Error: {error}
        </div>
      </div>
    );
  }
  if (!userInfo) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning" role="alert">
          No se pudo cargar la información del usuario. Por favor, intenta
          iniciar sesión de nuevo.
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-bg py-4">
      <div className="container bg-card shadow-lg rounded-lg p-4 my-4">
        <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-secondary">
          <h2 className="mb-0 text-white">
            Bienvenido, {userInfo.username} (Entrenador)
          </h2>
          <button onClick={logout} className="btn btn-outline-danger btn-sm">
            Cerrar Sesión
          </button>
        </div>

        <h3 className="h4 mb-3 text-info">Tus Clientes:</h3>
        {clients.length === 0 ? (
          <p className="text-muted">
            Aún no tienes clientes registrados bajo tu ID.
          </p>
        ) : (
          <div className="list-group mb-4">
            {clients.map((client) => (
              <div
                key={client._id}
                className="list-group-item list-group-item-action bg-dark text-white d-flex justify-content-between align-items-center flex-wrap border-secondary"
              >
                <div className="me-md-3 mb-2 mb-md-0">
                  <h5 className="mb-1 text-primary">{client.username}</h5>
                  <p className="mb-1 text-muted small">{client.email}</p>
                  <p className="mb-0 small">ID del Cliente: {client._id}</p>
                </div>
                <div className="d-flex flex-wrap gap-2 mt-2 mt-md-0">
                  <Link
                    to={`/trainer/clients/${client._id}/routines`}
                    state={{ clientName: client.username }}
                    className="btn btn-outline-info btn-sm"
                  >
                    Rutinas
                  </Link>
                  <Link
                    to={`/trainer/clients/${client._id}/dietplans`}
                    state={{ clientName: client.username }}
                    className="btn btn-outline-success btn-sm"
                  >
                    Dietas
                  </Link>
                  <Link
                    to={`/trainer/clients/${client._id}/progress`}
                    state={{ clientName: client.username }}
                    className="btn btn-outline-primary btn-sm"
                  >
                    Progreso
                  </Link>
                  <Link
                    to={`/chat/${client._id}`}
                    className="btn btn-outline-secondary btn-sm"
                  >
                    Chatear
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 pt-3 border-top border-secondary">
          <h3 className="h4 mb-3 text-info">Gestión General:</h3>
          <div className="d-flex flex-wrap gap-2">
            <Link to="/trainer/exercise-catalog" className="btn btn-warning">
              Gestionar Catálogo de Ejercicios
            </Link>
            <Link to="/trainer/meal-catalog" className="btn btn-warning">
              Gestionar Catálogo de Comidas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;
