import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom"; // Importar useLocation
import axios from "../../api/axiosInstance";
import RoutineCard from "../../components/RoutineCard";

const RoutineManagement = () => {
  const { clientId } = useParams();
  const location = useLocation(); 
  const { clientName: propClientName } = location.state || {}; 

  const [routines, setRoutines] = useState([]);
  const [clientInfo, setClientInfo] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRoutinesAndClient = async () => {
      try {
        if (!propClientName) {
          const clientRes = await axios.get(`/users/clients/${clientId}`); 
          setClientInfo(clientRes.data);
        }

        const response = await axios.get(`/routines/client/${clientId}`);
        setRoutines(response.data);
      } catch (err) {
        setError(
          "Error al cargar las rutinas: " +
            (err.response?.data?.message || err.message)
        );
      } finally {
        setLoading(false);
      }
    };
    fetchRoutinesAndClient();
  }, [clientId, propClientName]);

  const handleDeleteRoutine = async (routineId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta rutina?")) {
      try {
        await axios.delete(`/routines/${routineId}`);
        setRoutines(routines.filter((routine) => routine._id !== routineId));
        alert("Rutina eliminada con éxito.");
      } catch (err) {
        setError(
          "Error al eliminar la rutina: " +
            (err.response?.data?.message || err.message)
        );
      }
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="ms-3 lead text-primary">
          Cargando rutinas del cliente...
        </p>
      </div>
    );
  if (error)
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          Error: {error}
        </div>
      </div>
    );

  return (
    <div className="dashboard-bg py-4">
      <div className="container bg-card shadow-lg rounded-lg p-4 my-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0 text-white">
            Rutinas para{" "}
            <span className="text-primary">
              {propClientName ||
                (clientInfo && clientInfo.username) ||
                `Cliente: ${clientId}`}
            </span>
          </h2>
          <Link
            to={`/trainer/clients/${clientId}/routines/add`}
            className="btn btn-primary btn-sm"
            state={{ clientName: propClientName || (clientInfo && clientInfo.username) || `Cliente: ${clientId}` }}
          >
            Añadir Nueva Rutina
          </Link>
        </div>

        {routines.length === 0 ? (
          <p className="text-muted">No hay rutinas asignadas a este cliente.</p>
        ) : (
          <div className="row g-3">
            {routines.map((routine) => (
              <div className="col-md-6 col-lg-4" key={routine._id}>
                <RoutineCard
                  routine={routine}
                  clientId={clientId}
                  onDelete={handleDeleteRoutine}
                  isTrainer={true}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoutineManagement;
