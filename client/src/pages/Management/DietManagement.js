import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom"; 
import axios from "../../api/axiosInstance";
import DietCard from "../../components/DietCard";

const DietManagement = () => {
  const { clientId } = useParams();
  const location = useLocation(); 
  const { clientName: propClientName } = location.state || {}; 

  const [dietPlans, setDietPlans] = useState([]);
  const [clientInfo, setClientInfo] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDietPlansAndClient = async () => {
      try {
        if (!propClientName) {
          const clientRes = await axios.get(`/users/clients/${clientId}`); 
          setClientInfo(clientRes.data);
        }

        const response = await axios.get(`/dietplans/client/${clientId}`);
        setDietPlans(response.data);
      } catch (err) {
        setError(
          "Error al cargar los planes de dieta: " +
            (err.response?.data?.message || err.message)
        );
      } finally {
        setLoading(false);
      }
    };
    fetchDietPlansAndClient();
  }, [clientId, propClientName]);

  const handleDeleteDietPlan = async (dietPlanId) => {
    if (
      window.confirm(
        "¿Estás seguro de que quieres eliminar este plan de dieta?"
      )
    ) {
      try {
        await axios.delete(`/dietplans/${dietPlanId}`);
        setDietPlans(
          dietPlans.filter((dietPlan) => dietPlan._id !== dietPlanId)
        );
        alert("Plan de dieta eliminado con éxito.");
      } catch (err) {
        setError(
          "Error al eliminar el plan de dieta: " +
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
          Cargando planes de dieta del cliente...
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
            Planes de Dieta para{" "}
            <span className="text-primary">
              {propClientName ||
                (clientInfo && clientInfo.username) ||
                `Cliente: ${clientId}`}
            </span>
          </h2>
          <Link
            to={`/trainer/clients/${clientId}/dietplans/add`}
            className="btn btn-primary btn-sm"
            state={{ clientName: propClientName || (clientInfo && clientInfo.username) || `Cliente: ${clientId}` }}
          >
            Añadir Nuevo Plan de Dieta
          </Link>
        </div>

        {dietPlans.length === 0 ? (
          <p className="text-muted">
            No hay planes de dieta asignados a este cliente.
          </p>
        ) : (
          <div className="row g-3">
            {dietPlans.map((dietPlan) => (
              <div className="col-md-6 col-lg-4" key={dietPlan._id}>
                <DietCard
                  dietPlan={dietPlan}
                  clientId={clientId}
                  onDelete={handleDeleteDietPlan}
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

export default DietManagement;
