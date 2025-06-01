import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom"; 
import axios from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";

const AddEditDietPlan = () => {
  const { clientId, dietPlanId } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); 
  const { clientName: propClientName } = location.state || {};

  const { userInfo, loading: authLoading } = useAuth();

  const [dietPlan, setDietPlan] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    meals: [],
  });
  const [mealsCatalog, setMealsCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [clientInfo, setClientInfo] = useState(null); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catalogResponse = await axios.get("/meal-catalog");
        setMealsCatalog(catalogResponse.data);

        if (!propClientName) {
          const clientRes = await axios.get(`/users/clients/${clientId}`); 
          setClientInfo(clientRes.data);
        }

        if (dietPlanId) {
          const dietPlanResponse = await axios.get(`/dietplans/${dietPlanId}`);
          const fetchedDietPlan = dietPlanResponse.data;

          fetchedDietPlan.startDate = fetchedDietPlan.startDate
            ? new Date(fetchedDietPlan.startDate).toISOString().split("T")[0]
            : "";
          fetchedDietPlan.endDate = fetchedDietPlan.endDate
            ? new Date(fetchedDietPlan.endDate).toISOString().split("T")[0]
            : "";

          setDietPlan(fetchedDietPlan);
        }
      } catch (err) {
        setError(
          "Error al cargar datos: " +
            (err.response?.data?.message || err.message)
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dietPlanId, clientId, propClientName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDietPlan({ ...dietPlan, [name]: value });
  };

  const handleMealChange = (index, e) => {
    const { name, value } = e.target;
    const updatedMeals = [...dietPlan.meals];
    updatedMeals[index] = { ...updatedMeals[index], [name]: value };
    setDietPlan({ ...dietPlan, meals: updatedMeals });
  };

  const handleAddMeal = () => {
    setDietPlan({
      ...dietPlan,
      meals: [
        ...dietPlan.meals,
        { mealId: "", quantity: "", notes: "", timeOfDay: "" },
      ],
    });
  };

  const handleRemoveMeal = (index) => {
    setDietPlan({
      ...dietPlan,
      meals: dietPlan.meals.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    if (authLoading) {
      setError("Cargando entrenador.");
      setSubmitting(false);
      return;
    }
    if (!userInfo || !userInfo._id) {
      setError("No se pudo identificar al entrenador.");
      setSubmitting(false);
      return;
    }

    try {
      const trainerIdToSend = userInfo._id;
      if (dietPlanId) {
        await axios.put(`/dietplans/${dietPlanId}`, {
          ...dietPlan,
          trainerId: trainerIdToSend,
        });
        alert("Plan de dieta actualizado con éxito!");
      } else {
        await axios.post(`/dietplans/${clientId}`, {
          ...dietPlan,
          trainerId: trainerIdToSend,
        });
        alert("Plan de dieta creado con éxito!");
      }
      navigate(`/trainer/clients/${clientId}/dietplans`);
    } catch (err) {
      setError(
        "Error al guardar: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="ms-3 lead text-primary">Cargando formulario...</p>
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
        <h2 className="mb-4 text-white">
          {dietPlanId ? "Editar" : "Añadir"} Plan de Dieta para{" "}
          <span className="text-primary">
            {propClientName ||
              (clientInfo && clientInfo.username) ||
              `Cliente: ${clientId}`}
          </span>
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label text-muted">
              Nombre del Plan:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              value={dietPlan.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label text-muted">
              Descripción:
            </label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              value={dietPlan.description}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label htmlFor="startDate" className="form-label text-muted">
                Fecha de Inicio:
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                className="form-control"
                value={dietPlan.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="endDate" className="form-label text-muted">
                Fecha de Fin:
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                className="form-control"
                value={dietPlan.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <h3 className="h5 mb-3 text-info">Comidas:</h3>
          {dietPlan.meals.length === 0 && (
            <p className="text-muted">Añade comidas a este plan de dieta.</p>
          )}
          {dietPlan.meals.map((meal, index) => (
            <div key={index} className="card p-3 mb-3 shadow-sm bg-dark">
              <div className="mb-3">
                <label className="form-label text-muted">
                  Comida/Ingrediente:
                </label>
                <select
                  name="mealId"
                  className="form-select"
                  value={meal.mealId?._id || meal.mealId || ""}
                  onChange={(e) => handleMealChange(index, e)}
                  required
                >
                  <option value="">Selecciona una comida</option>
                  {mealsCatalog.map((ml) => (
                    <option key={ml._id} value={ml._id}>
                      {ml.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-muted">
                    Cantidad (e.g., "200g", "1 serving"):
                  </label>
                  <input
                    type="text"
                    name="quantity"
                    className="form-control"
                    value={meal.quantity}
                    onChange={(e) => handleMealChange(index, e)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted">
                    Momento del día (e.g., "Desayuno", "Almuerzo"):
                  </label>
                  <input
                    type="text"
                    name="timeOfDay"
                    className="form-control"
                    value={meal.timeOfDay}
                    onChange={(e) => handleMealChange(index, e)}
                  />
                </div>
              </div>
              <div className="mb-3 mt-3">
                <label className="form-label text-muted">Notas:</label>
                <input
                  type="text"
                  name="notes"
                  className="form-control"
                  value={meal.notes}
                  onChange={(e) => handleMealChange(index, e)}
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveMeal(index)}
                className="btn btn-outline-danger btn-sm"
              >
                Quitar Comida
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddMeal}
            className="btn btn-outline-info mb-4"
          >
            Añadir Comida
          </button>

          <div className="d-flex justify-content-end gap-2">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={authLoading || submitting}
            >
              {authLoading || submitting ? "Guardando..." : "Guardar Plan"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-outline-secondary"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditDietPlan;
