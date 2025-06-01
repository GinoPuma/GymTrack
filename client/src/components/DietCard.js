import React from "react";
import { Link } from "react-router-dom";

const DietCard = ({ dietPlan, clientId, onDelete, isTrainer = false }) => {
  if (!dietPlan) {
    return null;
  }

  const getMealName = (meal) => {
    return (
      meal.mealId?.name ||
      (typeof meal.mealId === "string" ? meal.mealId : "Comida desconocida")
    );
  };

  return (
    <div className="card shadow-lg h-100 border border-primary">
      <div className="card-body">
        <h5 className="card-title text-primary">{dietPlan.name}</h5>
        <p className="card-text text-muted">{dietPlan.description}</p>
        <p className="card-text mb-2">
          <small className="text-muted">
            Periodo: {new Date(dietPlan.startDate).toLocaleDateString()} -{" "}
            {new Date(dietPlan.endDate).toLocaleDateString()}
          </small>
        </p>
        <h6 className="card-subtitle mb-2 text-info">Comidas:</h6>
        {dietPlan.meals.length === 0 ? (
          <p className="text-muted small">No hay comidas en este plan.</p>
        ) : (
          <ul className="list-group list-group-flush small">
            {dietPlan.meals.map((meal, index) => (
              <li
                key={index}
                className="list-group-item bg-transparent text-white border-0 py-1"
              >
                - <strong>{getMealName(meal)}</strong>: {meal.quantity} (
                {meal.timeOfDay}) {meal.notes && `- ${meal.notes}`}
              </li>
            ))}
          </ul>
        )}
      </div>
      {isTrainer && (
        <div className="card-footer bg-transparent border-top border-secondary d-flex justify-content-end gap-2">
          <Link
            to={`/trainer/clients/${clientId}/dietplans/edit/${dietPlan._id}`}
          >
            <button className="btn btn-outline-info btn-sm">Editar</button>
          </Link>{" "}
          <button
            onClick={() => onDelete(dietPlan._id)}
            className="btn btn-outline-danger btn-sm"
          >
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
};

export default DietCard;
