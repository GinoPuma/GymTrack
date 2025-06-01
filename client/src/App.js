import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import Header from "./components/Header";

// Importar todas las páginas
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import TrainerDashboard from "./pages/Dashboard/TrainerDashboard";
import ClientDashboard from "./pages/Dashboard/ClientDashboard";
import AdminDashboard from "./pages/Dashboard/AdminDashboard"; // <-- NUEVO Dashboard Admin
import Chat from "./pages/Chat/Chat";
import Chatbot from "./pages/Chat/Chatbot";
import RoutineManagement from "./pages/Management/RoutineManagement";
import AddEditRoutine from "./pages/Management/AddEditRoutine";
import DietManagement from "./pages/Management/DietManagement";
import AddEditDietPlan from "./pages/Management/AddEditDietPlan";
import ViewProgress from "./pages/Progress/ViewProgress";
import ClientProgress from "./pages/Progress/ClientProgress";
import ExerciseCatalog from "./pages/Management/ExerciseCatalog";
import MealCatalog from "./pages/Management/MealCatalog";

const ProtectedRoute = ({ children, roles }) => {
  const { userInfo, loading } = useAuth();
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="ms-3 lead text-primary">Cargando autenticación...</p>
      </div>
    );
  }
  if (!userInfo) return <Navigate to="/login" replace />;

  if (userInfo.role === "admin") return children;

  if (roles && !roles.includes(userInfo.role))
    return <Navigate to="/unauthorized" replace />;

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <div className="App d-flex flex-column min-vh-100">
            <Header /> 
            <main className="flex-grow-1 pt-5">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/trainer-dashboard"
                  element={
                    <ProtectedRoute roles={["trainer"]}>
                      {" "}
                      <TrainerDashboard />{" "}
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/client-dashboard"
                  element={
                    <ProtectedRoute roles={["client"]}>
                      {" "}
                      <ClientDashboard />{" "}
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin-dashboard"
                  element={
                    <ProtectedRoute roles={["admin"]}>
                      {" "}
                      <AdminDashboard />{" "}
                    </ProtectedRoute>
                  }
                />{" "}
                <Route
                  path="/trainer/clients/:clientId/routines"
                  element={
                    <ProtectedRoute roles={["trainer"]}>
                      {" "}
                      <RoutineManagement />{" "}
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/trainer/clients/:clientId/routines/add"
                  element={
                    <ProtectedRoute roles={["trainer"]}>
                      {" "}
                      <AddEditRoutine />{" "}
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/trainer/clients/:clientId/routines/edit/:routineId"
                  element={
                    <ProtectedRoute roles={["trainer"]}>
                      {" "}
                      <AddEditRoutine />{" "}
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/trainer/clients/:clientId/dietplans"
                  element={
                    <ProtectedRoute roles={["trainer"]}>
                      {" "}
                      <DietManagement />{" "}
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/trainer/clients/:clientId/dietplans/add"
                  element={
                    <ProtectedRoute roles={["trainer"]}>
                      {" "}
                      <AddEditDietPlan />{" "}
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/trainer/clients/:clientId/dietplans/edit/:dietPlanId"
                  element={
                    <ProtectedRoute roles={["trainer"]}>
                      {" "}
                      <AddEditDietPlan />{" "}
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/trainer/clients/:clientId/progress"
                  element={
                    <ProtectedRoute roles={["trainer"]}>
                      {" "}
                      <ViewProgress />{" "}
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/trainer/exercise-catalog"
                  element={
                    <ProtectedRoute roles={["trainer"]}>
                      {" "}
                      <ExerciseCatalog />{" "}
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/trainer/meal-catalog"
                  element={
                    <ProtectedRoute roles={["trainer"]}>
                      {" "}
                      <MealCatalog />{" "}
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/client/progress"
                  element={
                    <ProtectedRoute roles={["client"]}>
                      {" "}
                      <ClientProgress />{" "}
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/chat/:otherUserId"
                  element={
                    <ProtectedRoute>
                      {" "}
                      <Chat />{" "}
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/chatbot"
                  element={
                    <ProtectedRoute roles={["client"]}>
                      {" "}
                      <Chatbot />{" "}
                    </ProtectedRoute>
                  }
                />
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route
                  path="/unauthorized"
                  element={
                    <div className="container mt-5">
                      <div
                        className="alert alert-warning text-center"
                        role="alert"
                      >
                        No tienes permiso para acceder a esta página.
                      </div>
                    </div>
                  }
                />
                <Route
                  path="*"
                  element={
                    <div className="container mt-5">
                      <div
                        className="alert alert-danger text-center"
                        role="alert"
                      >
                        Página no encontrada
                      </div>
                    </div>
                  }
                />
              </Routes>
            </main>
          </div>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
