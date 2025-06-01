import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom"; 
import axios from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";

const AddEditRoutine = () => {
  const { clientId, routineId } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); 
  const { clientName: propClientName } = location.state || {}; 

  const { userInfo, loading: authLoading } = useAuth();

  const [routine, setRoutine] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    exercises: [],
  });
  const [exercisesCatalog, setExercisesCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [clientInfo, setClientInfo] = useState(null); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catalogResponse = await axios.get("/exercise-catalog");
        setExercisesCatalog(catalogResponse.data);

        if (!propClientName) {
          const clientRes = await axios.get(`/users/clients/${clientId}`);
          setClientInfo(clientRes.data);
        }

        if (routineId) {
          const routineResponse = await axios.get(`/routines/${routineId}`);
          const fetchedRoutine = routineResponse.data;

          fetchedRoutine.startDate = fetchedRoutine.startDate
            ? new Date(fetchedRoutine.startDate).toISOString().split("T")[0]
            : "";
          fetchedRoutine.endDate = fetchedRoutine.endDate
            ? new Date(fetchedRoutine.endDate).toISOString().split("T")[0]
            : "";

          setRoutine(fetchedRoutine);
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
  }, [routineId, clientId, propClientName]); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoutine({ ...routine, [name]: value });
  };

  const handleExerciseChange = (index, e) => {
    const { name, value } = e.target;
    const updatedExercises = [...routine.exercises];
    updatedExercises[index] = { ...updatedExercises[index], [name]: value };
    setRoutine({ ...routine, exercises: updatedExercises });
  };

  const handleAddExercise = () => {
    setRoutine({
      ...routine,
      exercises: [
        ...routine.exercises,
        { exerciseId: "", sets: 0, reps: "", weight: "", notes: "" },
      ],
    });
  };

  const handleRemoveExercise = (index) => {
    setRoutine({
      ...routine,
      exercises: routine.exercises.filter((_, i) => i !== index),
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
      if (routineId) {
        await axios.put(`/routines/${routineId}`, {
          ...routine,
          trainerId: trainerIdToSend,
        });
        alert("Rutina actualizada con éxito!");
      } else {
        await axios.post("/routines", {
          ...routine,
          clientId: clientId,
          trainerId: trainerIdToSend,
        });
        alert("Rutina creada con éxito!");
      }
      navigate(`/trainer/clients/${clientId}/routines`);
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
          {routineId ? "Editar" : "Añadir"} Rutina para{" "}
          <span className="text-primary">
            {propClientName ||
              (clientInfo && clientInfo.username) ||
              `Cliente: ${clientId}`}
          </span>
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label text-muted">
              Nombre de la Rutina:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              value={routine.name}
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
              value={routine.description}
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
                value={routine.startDate}
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
                value={routine.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <h3 className="h5 mb-3 text-info">Ejercicios:</h3>
          {routine.exercises.length === 0 && (
            <p className="text-muted">Añade ejercicios a esta rutina.</p>
          )}
          {routine.exercises.map((exercise, index) => (
            <div key={index} className="card p-3 mb-3 shadow-sm bg-dark">
              <div className="mb-3">
                <label className="form-label text-muted">Ejercicio:</label>
                <select
                  name="exerciseId"
                  className="form-select"
                  value={exercise.exerciseId?._id || exercise.exerciseId || ""}
                  onChange={(e) => handleExerciseChange(index, e)}
                  required
                >
                  <option value="">Selecciona un ejercicio</option>
                  {exercisesCatalog.map((ex) => (
                    <option key={ex._id} value={ex._id}>
                      {ex.name} ({ex.muscleGroup} - {ex.equipment})
                    </option>
                  ))}
                </select>
              </div>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label text-muted">Series:</label>
                  <input
                    type="number"
                    name="sets"
                    className="form-control"
                    value={exercise.sets}
                    onChange={(e) => handleExerciseChange(index, e)}
                    min="0"
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-muted">
                    Repeticiones (e.g., "8-12", "AMRAP"):
                  </label>
                  <input
                    type="text"
                    name="reps"
                    className="form-control"
                    value={exercise.reps}
                    onChange={(e) => handleExerciseChange(index, e)}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-muted">
                    Peso (e.g., "50kg", "RPE 8"):
                  </label>
                  <input
                    type="text"
                    name="weight"
                    className="form-control"
                    value={exercise.weight}
                    onChange={(e) => handleExerciseChange(index, e)}
                  />
                </div>
              </div>
              <div className="mb-3 mt-3">
                <label className="form-label text-muted">Notas:</label>
                <input
                  type="text"
                  name="notes"
                  className="form-control"
                  value={exercise.notes}
                  onChange={(e) => handleExerciseChange(index, e)}
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveExercise(index)}
                className="btn btn-outline-danger btn-sm"
              >
                Quitar Ejercicio
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddExercise}
            className="btn btn-outline-info mb-4"
          >
            Añadir Ejercicio
          </button>

          <div className="d-flex justify-content-end gap-2">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={authLoading || submitting}
            >
              {authLoading || submitting ? "Guardando..." : "Guardar Rutina"}
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

export default AddEditRoutine;
