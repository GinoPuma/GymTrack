import React, { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";

const MealCatalog = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  });
  const [editingMealId, setEditingMealId] = useState(null);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await axios.get("/meal-catalog");
        setMeals(response.data);
      } catch (err) {
        setError(
          "Error al cargar el catálogo de comidas: " +
            (err.response?.data?.message || err.message)
        );
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? parseFloat(value) : value,
    });
  };

  const handleEdit = (meal) => {
    setEditingMealId(meal._id);
    setFormData({
      name: meal.name,
      description: meal.description,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fats: meal.fats,
    });
  };

  const handleCancelEdit = () => {
    setEditingMealId(null);
    setFormData({
      name: "",
      description: "",
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (editingMealId) {
        await axios.put(`/meal-catalog/${editingMealId}`, formData);
        setMeals(
          meals.map((meal) =>
            meal._id === editingMealId
              ? { ...formData, _id: editingMealId }
              : meal
          )
        );
        alert("Comida actualizada con éxito.");
      } else {
        const response = await axios.post("/meal-catalog", formData);
        setMeals([...meals, response.data]);
        alert("Comida añadida con éxito.");
      }
      setFormData({
        name: "",
        description: "",
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
      });
      setEditingMealId(null);
    } catch (err) {
      setError(
        "Error al guardar la comida: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (mealId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta comida?")) {
      try {
        await axios.delete(`/meal-catalog/${mealId}`);
        setMeals(meals.filter((meal) => meal._id !== mealId));
        alert("Comida eliminada con éxito.");
      } catch (err) {
        setError(
          "Error al eliminar la comida: " +
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
          Cargando catálogo de comidas...
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
        <h2 className="mb-4 text-white">Catálogo de Comidas/Ingredientes</h2>

        <div className="card shadow-sm p-4 mb-4 bg-dark">
          <h3 className="h5 mb-3 text-info">
            {editingMealId ? "Editar Comida" : "Añadir Nueva Comida"}
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
            <div className="row g-3 mb-3">
              <div className="col-md-3">
                <label htmlFor="calories" className="form-label text-muted">
                  Calorías:
                </label>
                <input
                  type="number"
                  id="calories"
                  name="calories"
                  className="form-control"
                  value={formData.calories}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="protein" className="form-label text-muted">
                  Proteínas (g):
                </label>
                <input
                  type="number"
                  id="protein"
                  name="protein"
                  className="form-control"
                  value={formData.protein}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="carbs" className="form-label text-muted">
                  Carbohidratos (g):
                </label>
                <input
                  type="number"
                  id="carbs"
                  name="carbs"
                  className="form-control"
                  value={formData.carbs}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="fats" className="form-label text-muted">
                  Grasas (g):
                </label>
                <input
                  type="number"
                  id="fats"
                  name="fats"
                  className="form-control"
                  value={formData.fats}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            </div>
            <div className="d-flex justify-content-end gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading
                  ? "Guardando..."
                  : editingMealId
                  ? "Actualizar Comida"
                  : "Añadir Comida"}
              </button>
              {editingMealId && (
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

        <h3 className="h4 mb-3 text-info">Comidas Existentes:</h3>
        {meals.length === 0 ? (
          <p className="text-muted">No hay comidas en el catálogo.</p>
        ) : (
          <div className="row g-3">
            {meals.map((meal) => (
              <div className="col-md-6 col-lg-4" key={meal._id}>
                <div className="card shadow-sm h-100 bg-dark">
                  <div className="card-body">
                    <h5 className="card-title text-primary">{meal.name}</h5>
                    <p className="card-text small text-muted">
                      {meal.description}
                    </p>
                    <ul className="list-group list-group-flush mb-2">
                      <li className="list-group-item bg-transparent text-white border-0 px-0 py-1">
                        <strong>Calorías:</strong> {meal.calories}
                      </li>
                      <li className="list-group-item bg-transparent text-white border-0 px-0 py-1">
                        <strong>Macros:</strong> P:{meal.protein} C:{meal.carbs}{" "}
                        G:{meal.fats}
                      </li>
                    </ul>
                  </div>
                  <div className="card-footer bg-transparent border-top border-secondary d-flex justify-content-end gap-2">
                    <button
                      onClick={() => handleEdit(meal)}
                      className="btn btn-outline-secondary btn-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(meal._id)}
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

export default MealCatalog;
