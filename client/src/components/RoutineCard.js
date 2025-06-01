import React from "react";
import { Link } from "react-router-dom";

const RoutineCard = ({ routine, clientId, onDelete, isTrainer = false }) => {
  if (!routine) {
    return null;
  }

  const getExerciseName = (exercise) => {
    return (
      exercise.exerciseId?.name ||
      (typeof exercise.exerciseId === "string"
        ? exercise.exerciseId
        : "Ejercicio desconocido")
    );
  };

  return (
    <div className="card shadow-lg h-100 border border-primary">
      <div className="card-body">
        <h5 className="card-title text-primary">{routine.name}</h5>
        <p className="card-text text-muted">{routine.description}</p>
        <p className="card-text mb-2">
          <small className="text-muted">
            Periodo: {new Date(routine.startDate).toLocaleDateString()} -{" "}
            {new Date(routine.endDate).toLocaleDateString()}
          </small>
        </p>
        <h6 className="card-subtitle mb-2 text-info">Ejercicios:</h6>
        {routine.exercises.length === 0 ? (
          <p className="text-muted small">No hay ejercicios en esta rutina.</p>
        ) : (
          <ul className="list-group list-group-flush small">
            {routine.exercises.map((exercise, index) => (
              <li
                key={index}
                className="list-group-item bg-transparent text-white border-0 py-1"
              >
                - <strong>{getExerciseName(exercise)}</strong>: {exercise.sets}{" "}
                sets x {exercise.reps}{" "}
                {exercise.weight && `(${exercise.weight})`}{" "}
                {exercise.notes && `- ${exercise.notes}`}
              </li>
            ))}
          </ul>
        )}
      </div>
      {isTrainer && (
        <div className="card-footer bg-transparent border-top border-secondary d-flex justify-content-end gap-2">
          <Link
            to={`/trainer/clients/${clientId}/routines/edit/${routine._id}`}
          >
            <button className="btn btn-outline-info btn-sm">Editar</button>
          </Link>{" "}
          <button
            onClick={() => onDelete(routine._id)}
            className="btn btn-outline-danger btn-sm"
          >
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
};

export default RoutineCard;
