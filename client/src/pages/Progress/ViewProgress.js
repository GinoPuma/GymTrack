import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "../../api/axiosInstance";

const FIELD_TRANSLATIONS = {
  chest: "Pecho",
  waist: "Cintura",
  hips: "Caderas",
  arms: "Brazos",
  legs: "Piernas",
  benchPress1RM: "1RM Press Banca",
  squat1RM: "1RM Sentadilla",
  deadlift1RM: "1RM Peso Muerto",
  run5kTime: "Tiempo 5km",
};

const ViewProgress = () => {
  const { clientId } = useParams();
  const location = useLocation();
  const { clientName: propClientName } = location.state || {}; 
  const [progressData, setProgressData] = useState([]);
  const [clientInfo, setClientInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProgressAndClient = async () => {
      try {
        if (!propClientName) {
          const clientRes = await axios.get(`/users/clients/${clientId}`); 
          setClientInfo(clientRes.data);
        }

        const response = await axios.get(`/progress/${clientId}`);
        setProgressData(response.data);
      } catch (err) {
        setError(
          "Error al cargar el progreso del cliente: " +
            (err.response?.data?.message || err.message)
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProgressAndClient();
  }, [clientId, propClientName]);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="ms-3 lead text-primary">
          Cargando progreso del cliente...
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
        <h2 className="mb-4 text-white">
          Progreso de{" "}
          <span className="text-primary">
            {propClientName ||
              (clientInfo && clientInfo.username) ||
              `Cliente: ${clientId}`}
          </span>
        </h2>

        {progressData.length === 0 ? (
          <p className="text-muted">
            Este cliente aún no ha registrado ningún progreso.
          </p>
        ) : (
          <div className="row g-3">
            {progressData.map((entry) => (
              <div className="col-md-6 col-lg-4" key={entry._id}>
                <div className="card shadow-sm h-100 bg-dark">
                  <div className="card-body">
                    <h5 className="card-title text-info">
                      {new Date(entry.date).toLocaleDateString()}
                    </h5>
                    {entry.weight && (
                      <p className="card-text mb-1">
                        <strong>Peso:</strong> {entry.weight} kg
                      </p>
                    )}
                    {entry.measurements &&
                      Object.keys(entry.measurements).length > 0 && (
                        <div className="mb-1">
                          <small className="text-muted">Medidas (cm):</small>
                          <ul className="list-group list-group-flush small bg-transparent">
                            {Object.entries(entry.measurements).map(
                              ([key, value]) => (
                                <li
                                  className="list-group-item bg-transparent text-white border-0 px-0 py-1"
                                  key={key}
                                >
                                  {FIELD_TRANSLATIONS[key] ||
                                    key.charAt(0).toUpperCase() + key.slice(1)}
                                  : {value}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                    {entry.performanceMetrics &&
                      Object.keys(entry.performanceMetrics).length > 0 && (
                        <div className="mb-1">
                          <small className="text-muted">Rendimiento:</small>
                          <ul className="list-group list-group-flush small bg-transparent">
                            {Object.entries(entry.performanceMetrics).map(
                              ([key, value]) => (
                                <li
                                  className="list-group-item bg-transparent text-white border-0 px-0 py-1"
                                  key={key}
                                >
                                  {FIELD_TRANSLATIONS[key] ||
                                    key
                                      .replace(/([A-Z])/g, " $1")
                                      .replace(/^./, (str) =>
                                        str.toUpperCase()
                                      )}
                                  : {value}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                    {entry.photos && entry.photos.length > 0 && (
                      <div className="mt-2">
                        <p className="mb-1 small text-muted">Fotos:</p>
                        <div className="d-flex flex-wrap gap-1">
                          {entry.photos.map((photoUrl, idx) => (
                            <img
                              key={idx}
                              src={photoUrl}
                              alt={`Progreso ${entry.date}-${idx}`}
                              className="img-thumbnail bg-dark border-secondary"
                              style={{
                                width: "60px",
                                height: "60px",
                                objectFit: "cover",
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    {entry.notes && (
                      <p className="card-text mt-2 mb-0 small text-muted">
                        Notas: {entry.notes}
                      </p>
                    )}
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

export default ViewProgress;
