import React, { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";

const muscleGroupOptions = [
  "Chest",
  "Back",
  "Shoulders",
  "Biceps",
  "Triceps",
  "Legs",
  "Abs",
  "Cardio",
  "Full Body",
];

const ExerciseCatalog = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    muscleGroup: "",
    equipment: "",
    videoUrl: "",
  });
  const [editingExerciseId, setEditingExerciseId] = useState(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get("/exercise-catalog");
        setExercises(response.data);
      } catch (err) {
        setError(
          "Error al cargar el catálogo de ejercicios: " +
            (err.response?.data?.message || err.message)
        );
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = (exercise) => {
    setEditingExerciseId(exercise._id);
    setFormData({
      name: exercise.name,
      description: exercise.description,
      muscleGroup: exercise.muscleGroup,
      equipment: exercise.equipment || "",
      videoUrl: exercise.videoUrl || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingExerciseId(null);
    setFormData({
      name: "",
      description: "",
      muscleGroup: "",
      equipment: "",
      videoUrl: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (editingExerciseId) {
        await axios.put(`/exercise-catalog/${editingExerciseId}`, formData);
        setExercises(
          exercises.map((ex) =>
            ex._id === editingExerciseId
              ? { ...formData, _id: editingExerciseId }
              : ex
          )
        );
        alert("Ejercicio actualizado con éxito.");
      } else {
        const response = await axios.post("/exercise-catalog", formData);
        setExercises([...exercises, response.data]);
        alert("Ejercicio añadido con éxito.");
      }
      setFormData({
        name: "",
        description: "",
        muscleGroup: "",
        equipment: "",
        videoUrl: "",
      });
      setEditingExerciseId(null);
    } catch (err) {
      setError(
        "Error al guardar el ejercicio: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (exerciseId) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar este ejercicio?")
    ) {
      try {
        await axios.delete(`/exercise-catalog/${exerciseId}`);
        setExercises(exercises.filter((ex) => ex._id !== exerciseId));
        alert("Ejercicio eliminado con éxito.");
      } catch (err) {
        setError(
          "Error al eliminar el ejercicio: " +
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
          Cargando catálogo de ejercicios...
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
        <h2 className="mb-4 text-white">Catálogo de Ejercicios</h2>

        <div className="card shadow-sm p-4 mb-4 bg-dark">
          <h3 className="h5 mb-3 text-info">
            {editingExerciseId ? "Editar Ejercicio" : "Añadir Nuevo Ejercicio"}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label text-muted">
                Nombre:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={formData.name}
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
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="muscleGroup" className="form-label text-muted">
                Grupo Muscular:
              </label>
              <select
                id="muscleGroup"
                name="muscleGroup"
                className="form-select"
                value={formData.muscleGroup}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona un grupo muscular</option>
                {muscleGroupOptions.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="equipment" className="form-label text-muted">
                Equipo:
              </label>
              <input
                type="text"
                id="equipment"
                name="equipment"
                className="form-control"
                value={formData.equipment}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="videoUrl" className="form-label text-muted">
                URL Video:
              </label>
              <input
                type="url"
                id="videoUrl"
                name="videoUrl"
                className="form-control"
                value={formData.videoUrl}
                onChange={handleChange}
              />
            </div>
            <div className="d-flex justify-content-end gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading
                  ? "Guardando..."
                  : editingExerciseId
                  ? "Actualizar Ejercicio"
                  : "Añadir Ejercicio"}
              </button>
              {editingExerciseId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="btn btn-outline-secondary"
                >
                  Cancelar Edición
                </button>
              )}
            </div>
          </form>
        </div>

        <h3 className="h4 mb-3 text-info">Ejercicios Existentes:</h3>
        {exercises.length === 0 ? (
          <p className="text-muted">No hay ejercicios en el catálogo.</p>
        ) : (
          <div className="row g-3">
            {exercises.map((exercise) => (
              <div className="col-md-6 col-lg-4" key={exercise._id}>
                <div className="card shadow-sm h-100 bg-dark">
                  <div className="card-body">
                    <h5 className="card-title text-primary">{exercise.name}</h5>
                    <p className="card-text small text-muted">
                      {exercise.description}
                    </p>
                    <p className="mb-1 text-white">
                      <strong>Grupo Muscular:</strong> {exercise.muscleGroup}
                    </p>
                    <p className="mb-1 text-white">
                      <strong>Equipo:</strong> {exercise.equipment || "N/A"}
                    </p>
                    {exercise.videoUrl && (
                      <p className="mb-0">
                        <a
                          href={exercise.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-link btn-sm p-0 text-info"
                        >
                          Ver Video
                        </a>
                      </p>
                    )}
                  </div>
                  <div className="card-footer bg-transparent border-top border-secondary d-flex justify-content-end gap-2">
                    <button
                      onClick={() => handleEdit(exercise)}
                      className="btn btn-outline-secondary btn-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(exercise._id)}
                      className="btn btn-outline-danger btn-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseCatalog;
