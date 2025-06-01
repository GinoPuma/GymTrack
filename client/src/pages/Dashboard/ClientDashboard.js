import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "../../api/axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import RoutineCard from "../../components/RoutineCard";
import DietCard from "../../components/DietCard";

const ClientDashboard = () => {
  const { userInfo, logout, loading: authLoading } = useAuth();
  const [allRoutines, setAllRoutines] = useState([]);
  const [allDietPlans, setAllDietPlans] = useState([]);
  const [trainerInfo, setTrainerInfo] = useState(null);
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

    if (userInfo.role !== "client") {
      navigate("/"); 
      return;
    }

    const fetchData = async () => {
      try {
        const clientId = userInfo._id; 
        const routinesRes = await axios.get(`/routines/client/${clientId}`);
        setAllRoutines(
          routinesRes.data.sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
          )
        ); 
        const dietPlansRes = await axios.get(`/dietplans/client/${clientId}`);
        setAllDietPlans(
          dietPlansRes.data.sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
          )
        ); 

        if (userInfo.trainerId) {
          const trainerRes = await axios.get("/users/my-trainer"); 
          setTrainerInfo(trainerRes.data);
        } else {
          setTrainerInfo(null);
        }
      } catch (err) {
        setError(
          "Error al cargar tus planes o entrenador: " +
            (err.response?.data?.message || err.message)
        );
      } finally {
        setLoadingContent(false); 
      }
    };
    fetchData();
  }, [userInfo, authLoading, navigate]); 

  if (authLoading || loadingContent) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="ms-3 lead text-primary">Cargando tu información...</p>
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
          No se pudo cargar la información del usuario. Por favor, inicia sesión
          de nuevo.
        </div>
      </div>
    );
  }

  const now = new Date();
  
  const activeRoutines = allRoutines.filter(
    (r) => new Date(r.startDate) <= now && new Date(r.endDate) >= now
  );
  const upcomingRoutines = allRoutines.filter(
    (r) => new Date(r.startDate) > now
  ); 
  
  const activeDietPlans = allDietPlans.filter(
    (d) => new Date(d.startDate) <= now && new Date(d.endDate) >= now
  );
  const upcomingDietPlans = allDietPlans.filter(
    (d) => new Date(d.startDate) > now
  ); 

  return (
    <div className="dashboard-bg py-4">
      {" "}
      <div className="container bg-card shadow-lg rounded-lg p-4 my-4">
        <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-secondary">
          <h2 className="mb-0 text-white">
            Bienvenido, {userInfo.username} (Cliente)
          </h2>
          <button onClick={logout} className="btn btn-outline-danger btn-sm">
            Cerrar Sesión
          </button>
        </div>

        {/* Sección de Entrenador Asignado */}
        <div className="card bg-dark text-white mb-4 shadow-lg border border-primary">
          {" "}
          <div className="card-body">
            <h3 className="card-title h5 text-primary mb-3">
              Tu Entrenador Asignado:
            </h3>
            {trainerInfo ? (
              <>
                <p className="card-text mb-1">
                  Nombre: <strong>{trainerInfo.username}</strong>
                </p>
                <p className="card-text mb-3">Correo: {trainerInfo.email}</p>
                <Link
                  to={`/chat/${trainerInfo._id}`}
                  className="btn btn-primary btn-sm"
                >
                  Chatear con {trainerInfo.username}
                </Link>
              </>
            ) : (
              <div className="alert alert-info mt-3" role="alert">
                No tienes un entrenador asignado. Tu ID es:{" "}
                <strong>{userInfo._id}</strong>
              </div>
            )}
          </div>
        </div>

        {/* SECCIÓN DE RUTINAS */}
        <div className="card bg-dark text-white mb-4 shadow-sm">
          <div className="card-body">
            <h3 className="card-title h5 text-primary mb-3">Tus Rutinas:</h3>
            <div className="row">
              {/* Columna para Rutina Activa */}
              <div className="col-md-6 mb-3 mb-md-0">
                <h4 className="h6 text-primary mb-2">Activa Actualmente:</h4>
                {activeRoutines.length > 0 ? (
                  <RoutineCard
                    routine={activeRoutines[0]} 
                    clientId={userInfo._id}
                    onDelete={() =>
                      alert("Solo tu entrenador puede eliminar rutinas.")
                    }
                    isTrainer={false} 
                  />
                ) : (
                  <p className="text-muted small">
                    No tienes una rutina activa en este momento.
                  </p>
                )}
              </div>
              {/* Columna para Rutinas Próximas */}
              <div className="col-md-6">
                <h4 className="h6 text-info mb-2">Próximas Rutinas:</h4>
                {upcomingRoutines.length > 0 ? (
                  <div className="list-group list-group-flush small">
                    {upcomingRoutines.map((routine) => (
                      <div
                        className="list-group-item bg-transparent text-white border-secondary py-2"
                        key={routine._id}
                      >
                        <strong>{routine.name}</strong> - Inicia:{" "}
                        {new Date(routine.startDate).toLocaleDateString()}
                        <p className="mb-0 text-muted small">
                          {routine.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted small">
                    No tienes rutinas próximas agendadas.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN DE PLANES DE DIETA */}
        <div className="card bg-dark text-white mb-4 shadow-sm">
          <div className="card-body">
            <h3 className="card-title h5 text-primary mb-3">
              Tus Planes de Dieta:
            </h3>
            <div className="row">
              {/* Columna para Dieta Activa */}
              <div className="col-md-6 mb-3 mb-md-0">
                <h4 className="h6 text-primary mb-2">Activo Actualmente:</h4>
                {activeDietPlans.length > 0 ? (
                  <DietCard
                    dietPlan={activeDietPlans[0]} 
                    clientId={userInfo._id}
                    onDelete={() =>
                      alert(
                        "Solo tu entrenador puede eliminar planes de dieta."
                      )
                    }
                    isTrainer={false} 
                  />
                ) : (
                  <p className="text-muted small">
                    No tienes un plan de dieta activo en este momento.
                  </p>
                )}
              </div>
              {/* Columna para Dietas Próximas */}
              <div className="col-md-6">
                <h4 className="h6 text-info mb-2">Próximos Planes de Dieta:</h4>
                {upcomingDietPlans.length > 0 ? (
                  <div className="list-group list-group-flush small">
                    {upcomingDietPlans.map((dietPlan) => (
                      <div
                        className="list-group-item bg-transparent text-white border-secondary py-2"
                        key={dietPlan._id}
                      >
                        <strong>{dietPlan.name}</strong> - Inicia:{" "}
                        {new Date(dietPlan.startDate).toLocaleDateString()}
                        <p className="mb-0 text-muted small">
                          {dietPlan.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted small">
                    No tienes planes de dieta próximos agendados.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Opciones Rápidas */}
        <div className="card bg-dark text-white mb-4 shadow-sm">
          <div className="card-body">
            <h3 className="card-title h5 text-primary mb-3">
              Opciones Rápidas:
            </h3>
            <div className="d-flex flex-wrap gap-2">
              <Link to={`/client/progress`} className="btn btn-primary btn-lg">
                Registrar y Ver Mi Progreso
              </Link>
              <Link to="/chatbot" className="btn btn-secondary btn-lg">
                Chatear con Asistente Virtual
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
