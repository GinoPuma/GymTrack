import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const UsersTable = ({ users, onDelete, currentUserId }) => {
  return (
    <div className="table-responsive">
      <table className="table table-dark table-striped table-hover mt-3">
        <thead>
          <tr>
            <th scope="col">Usuario</th>
            <th scope="col">Email</th>
            <th scope="col">Rol</th>
            <th scope="col">Trainer ID</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <span
                  className={`badge ${
                    user.role === "admin"
                      ? "bg-danger"
                      : user.role === "trainer"
                      ? "bg-primary"
                      : "bg-success"
                  }`}
                >
                  {user.role}
                </span>
              </td>
              <td>
                {user.role === "trainer" || user.role === "admin"
                  ? user._id
                  : user.trainerId || "N/A"}
              </td>
              <td>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => onDelete(user._id, user.username)}
                    disabled={String(user._id) === String(currentUserId)} 
                  >
                    Eliminar
                  </button>
                  
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AdminDashboard = () => {
  const { userInfo, logout, loading: authLoading } = useAuth();
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loadingContent, setLoadingContent] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading || !userInfo) {
      if (!authLoading && !userInfo) {
        navigate("/login");
      }
      return;
    }

    if (userInfo.role !== "admin") {
      navigate("/");
      return;
    }

    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("/users");
        setUsers(data);
      } catch (err) {
        setError(
          "Error al cargar usuarios: " +
            (err.response?.data?.message || err.message)
        );
      } finally {
        setLoadingContent(false);
      }
    };

    fetchUsers();
  }, [userInfo, authLoading, navigate]);

  const handleDeleteUser = async (userId, username) => {
    if (
      window.confirm(
        `¿Estás seguro de eliminar a ${username}? Esta acción es irreversible.`
      )
    ) {
      try {
        await axios.delete(`/users/${userId}`);
        setUsers(users.filter((user) => user._id !== userId));
        alert(`${username} ha sido eliminado.`);
      } catch (err) {
        setError(
          "Error al eliminar usuario: " +
            (err.response?.data?.message || err.message)
        );
      }
    }
  };

  const getFilteredUsers = () => {
    switch (activeTab) {
      case "clients":
        return users.filter((user) => user.role === "client");
      case "trainers":
        return users.filter((user) => user.role === "trainer");
      case "all":
      default:
        return users.filter((user) => user.role !== "admin");
    }
  };

  if (authLoading || loadingContent) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="ms-3 lead text-primary">
          Cargando panel de administración...
        </p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          Error: {error}
        </div>
      </div>
    );
  }
  if (!userInfo) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning" role="alert">
          No se pudo cargar la información del usuario. Por favor, inicia sesión
          de nuevo.
        </div>
      </div>
    );
  }

  const filteredUsers = getFilteredUsers();

  return (
    <div className="dashboard-bg py-4">
      <div className="container bg-card shadow-lg rounded-lg p-4 my-4">
        <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-secondary">
          <h2 className="mb-0 text-white">Panel de Administración</h2>
          <button onClick={logout} className="btn btn-outline-danger btn-sm">
            Cerrar Sesión
          </button>
        </div>

        <div className="alert alert-info" role="alert">
          <h4 className="alert-heading">¡Administrador!</h4>
          <p>
            Desde aquí puedes ver y gestionar todos los usuarios del sistema.
          </p>
        </div>

        <ul className="nav nav-tabs nav-fill mb-4" id="userTabs" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${
                activeTab === "all"
                  ? "active bg-primary text-white"
                  : "text-primary"
              }`}
              onClick={() => setActiveTab("all")}
              type="button"
              role="tab"
              aria-selected={activeTab === "all"}
            >
              Todos ({users.filter((user) => user.role !== "admin").length})
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${
                activeTab === "clients"
                  ? "active bg-primary text-white"
                  : "text-primary"
              }`}
              onClick={() => setActiveTab("clients")}
              type="button"
              role="tab"
              aria-selected={activeTab === "clients"}
            >
              Clientes ({users.filter((u) => u.role === "client").length})
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${
                activeTab === "trainers"
                  ? "active bg-primary text-white"
                  : "text-primary"
              }`}
              onClick={() => setActiveTab("trainers")}
              type="button"
              role="tab"
              aria-selected={activeTab === "trainers"}
            >
              Entrenadores ({users.filter((u) => u.role === "trainer").length})
            </button>
          </li>
        </ul>

        {filteredUsers.length === 0 ? (
          <p className="text-muted text-center mt-5">
            No hay usuarios en esta categoría.
          </p>
        ) : (
          <UsersTable
            users={filteredUsers}
            onDelete={handleDeleteUser}
            currentUserId={userInfo._id}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
