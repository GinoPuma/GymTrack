import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

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

const ClientProgress = () => {
  const { userInfo, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    weight: "",
    measurements: { chest: "", waist: "", hips: "", arms: "", legs: "" },
    performanceMetrics: {
      benchPress1RM: "",
      squat1RM: "",
      deadlift1RM: "",
      run5kTime: "",
    },
    photos: [],
    notes: "",
  });

  const [progressHistory, setProgressHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [submittingForm, setSubmittingForm] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  const clientId = userInfo?._id;

  useEffect(() => {
    if (authLoading || !userInfo) return;

    const fetchProgressHistory = async () => {
      try {
        const response = await axios.get(`/progress/${clientId}`);
        setProgressHistory(
          response.data.sort((a, b) => new Date(b.date) - new Date(a.date))
        );
      } catch (err) {
        setError(
          "Error al cargar el historial de progreso: " +
            (err.response?.data?.message || err.message)
        );
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchProgressHistory();
  }, [userInfo, authLoading, clientId, submittingForm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNestedChange = (parentKey) => (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [parentKey]: {
        ...prevData[parentKey],
        [name]: value,
      },
    }));
  };

  const handlePhotosChange = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      photos: value
        .split(",")
        .map((url) => url.trim())
        .filter((url) => url),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmittingForm(true);
    setFormError("");

    if (!userInfo || !userInfo._id) {
      setFormError(
        "No se pudo identificar tu ID de cliente. Por favor, intenta de nuevo."
      );
      setSubmittingForm(false);
      return;
    }

    try {
      const dataToSend = {
        clientId: userInfo._id,
        date: new Date().toISOString(),
        weight:
          formData.weight !== "" ? parseFloat(formData.weight) : undefined,
        measurements: Object.fromEntries(
          Object.entries(formData.measurements).filter(
            ([_, v]) => v !== "" && v !== null
          )
        ),
        performanceMetrics: Object.fromEntries(
          Object.entries(formData.performanceMetrics).filter(
            ([_, v]) => v !== "" && v !== null
          )
        ),
        photos: formData.photos.length > 0 ? formData.photos : undefined,
        notes: formData.notes || undefined,
      };

      if (Object.keys(dataToSend.measurements).length === 0)
        delete dataToSend.measurements;
      if (Object.keys(dataToSend.performanceMetrics).length === 0)
        delete dataToSend.performanceMetrics;
      if (dataToSend.photos && dataToSend.photos.length === 0)
        delete dataToSend.photos;
      if (dataToSend.notes === "") delete dataToSend.notes;
      if (dataToSend.weight === undefined) delete dataToSend.weight;

      if (
        dataToSend.weight === undefined &&
        dataToSend.measurements === undefined &&
        dataToSend.performanceMetrics === undefined &&
        dataToSend.notes === undefined &&
        dataToSend.photos === undefined
      ) {
        setFormError(
          "Debes registrar al menos tu peso, alguna medida, métrica de rendimiento, notas o fotos."
        );
        setSubmittingForm(false);
        return;
      }

      // eslint-disable-next-line no-unused-vars
      const res = await axios.post("/progress", dataToSend);
      alert("Progreso registrado con éxito!");

      setFormData({
        weight: "",
        measurements: { chest: "", waist: "", hips: "", arms: "", legs: "" },
        performanceMetrics: {
          benchPress1RM: "",
          squat1RM: "",
          deadlift1RM: "",
          run5kTime: "",
        },
        photos: [],
        notes: "",
      });
      setLoadingHistory(true);
    } catch (err) {
      setFormError(
        "Error al registrar el progreso: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setSubmittingForm(false);
    }
  };

  if (authLoading || !userInfo) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="ms-3 lead text-primary">
          Cargando información del usuario...
        </p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          Error general: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-bg py-4">
      <div className="container bg-card shadow-lg rounded-lg p-4 my-4">
        <button
          onClick={() => navigate("/client-dashboard")}
          className="btn btn-outline-secondary mb-4"
        >
          Volver al Dashboard
        </button>
        <h2 className="text-center mb-4 text-white">
          Registrar y Ver tu Progreso
        </h2>

        <div className="card shadow-sm p-4 mb-4 bg-dark">
          <h3 className="h5 mb-3 text-primary">Registrar Nuevo Progreso</h3>
          {formError && <div className="alert alert-danger">{formError}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="weight" className="form-label text-muted">
                Peso (kg):
              </label>
              <input
                type="number"
                id="weight"
                className="form-control"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="Ej: 75.5"
                step="0.1"
              />
            </div>

            <h4 className="h6 mt-4 mb-3 text-muted">Medidas (cm):</h4>
            <div className="row g-3 mb-3">
              {Object.keys(formData.measurements).map((key) => (
                <div className="col-md-4" key={key}>
                  <label htmlFor={key} className="form-label text-muted">
                    {FIELD_TRANSLATIONS[key] ||
                      key.charAt(0).toUpperCase() + key.slice(1)}
                    :
                  </label>
                  <input
                    type="number"
                    id={key}
                    className="form-control"
                    name={key}
                    value={formData.measurements[key]}
                    onChange={handleNestedChange("measurements")}
                    placeholder="Ej: 100"
                    step="0.1"
                  />
                </div>
              ))}
            </div>

            <h4 className="h6 mt-4 mb-3 text-muted">
              Métricas de Rendimiento:
            </h4>
            <div className="row g-3 mb-3">
              {Object.keys(formData.performanceMetrics).map((key) => (
                <div className="col-md-6" key={key}>
                  <label
                    htmlFor={`perf-${key}`}
                    className="form-label text-muted"
                  >
                    {FIELD_TRANSLATIONS[key] ||
                      key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                    :
                  </label>
                  <input
                    type={key.includes("Time") ? "text" : "number"}
                    id={`perf-${key}`}
                    className="form-control"
                    name={key}
                    value={formData.performanceMetrics[key]}
                    onChange={handleNestedChange("performanceMetrics")}
                    placeholder={key.includes("Time") ? "MM:SS" : "Ej: 100"}
                    step={key.includes("Time") ? "" : "0.1"}
                  />
                </div>
              ))}
            </div>

            <div className="mb-3">
              <label htmlFor="photos" className="form-label text-muted">
                URLs de Fotos (separadas por coma):
              </label>
              <input
                type="text"
                id="photos"
                className="form-control"
                name="photos"
                value={formData.photos.join(", ")}
                onChange={handlePhotosChange}
                placeholder="Ej: https://picsum.photos/200/300, https://picsum.photos/400/500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="notes" className="form-label text-muted">
                Notas Adicionales:
              </label>
              <textarea
                id="notes"
                className="form-control"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                placeholder="Cualquier observación relevante..."
              ></textarea>
            </div>

            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submittingForm}
              >
                {submittingForm ? "Guardando..." : "Registrar Progreso"}
              </button>
            </div>
          </form>
        </div>

        <h3 className="h4 mb-3 text-white">Tu Historial de Progreso</h3>
        {loadingHistory ? (
          <p className="text-center text-muted">Cargando historial...</p>
        ) : progressHistory.length === 0 ? (
          <p className="text-center text-muted">
            Aún no has registrado ningún progreso.
          </p>
        ) : (
          <div className="row g-3">
            {progressHistory.map((entry) => (
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

export default ClientProgress;
