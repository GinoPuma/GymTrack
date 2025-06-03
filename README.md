# GYMTRACK 🏋️‍♂️

**GYMTRACK** es una aplicación web integral para la gestión de gimnasios y el seguimiento personalizado del progreso en el fitness. Permite a administradores gestionar usuarios, a entrenadores asignar rutinas y dietas, y a los clientes registrar su avance y comunicarse con su entrenador o un chatbot inteligente.

---

## 🚀 Características Principales

- **Autenticación y autorización por roles** (JWT): Administrador, Entrenador y Cliente.
- **Administrador:**
  - Ver y eliminar usuarios.
- **Entrenador:**
  - Ver clientes asignados.
  - Crear y gestionar rutinas y planes de dieta por cliente.
  - Gestionar catálogos globales de ejercicios y comidas.
  - Visualizar el progreso de cada cliente.
- **Cliente:**
  - Visualizar rutinas y dietas actuales y próximas.
  - Registrar peso, medidas, fotos, métricas, notas.
  - Consultar historial visual del progreso.
- **Chat en tiempo real:**
  - Chat 1:1 entre entrenador y cliente.
  - Chatbot inteligente con IA (Ollama).
- **Interfaz moderna y responsiva:** React.js + Bootstrap 5 (tema oscuro).

---

## 🧱 Tecnologías Utilizadas

### Backend

- Node.js + Express.js
- MongoDB + Mongoose
- Socket.IO
- Ollama (IA local)
- JWT + bcrypt.js
- dotenv, express-async-handler

### Frontend

- React.js + Context API
- React Router DOM
- Axios
- Bootstrap 5
- react-markdown

---

## ⚙️ Instalación Local

### 📦 Requisitos Previos

- Node.js (v14+)
- npm (v6+)
- MongoDB (local o Atlas)
- Ollama instalado y modelo `llama3.1:8b` cargado

---

### 🔧 Backend

```bash
git clone <url_de_tu_repositorio>
cd GYMTRACK/server

1. Crear archivo .env:
   Crea un archivo llamado .env en la raíz de la carpeta server con el siguiente contenido:

PORT=5000
MONGO_URI=tu_cadena_mongodb
JWT_SECRET=una_clave_segura
ADMIN_TRAINER_KEY=claveSecretaTrainer
OLLAMA_API_URL=http://localhost:11434/api/generate

2. Instalar dependencias:
   npm install

3. Iniciar el Servidor Backend:
   npm run dev
   El servidor se ejecutará en http://localhost:5000.
```

---

### 🔧 Frontend

```bash
cd ../client

1. Instalar dependencias:
   npm install && npm start
   La aplicación React se abrirá en tu navegador en http://localhost:3000.
```

---

## 🗺️ Estructura del Proyecto

```
GYMTRACK/
├── client/                     # Aplicación React (Frontend)
│   ├── public/                 # Archivos HTML, favicon, etc.
│   │   └── index.html          # Punto de entrada HTML (con enlaces a Bootstrap CDN)
│   └── src/                    # Código fuente de React
│       ├── api/                # Configuración de Axios
│       │   └── axiosInstance.js
│       ├── assets/             # Imágenes, iconos, etc. (vacío por defecto, útil para logos)
│       ├── components/         # Componentes React reutilizables (Cards, Header)
│       │   ├── DietCard.js
│       │   ├── Header.js
│       │   └── RoutineCard.js
│       ├── context/            # Contextos de React para estado global
│       │   ├── AuthContext.js  # Contexto de autenticación
│       │   └── SocketContext.js # Contexto para Socket.IO
│       ├── hooks/              # Custom Hooks de React
│       │   └── useAuth.js
│       ├── pages/              # Páginas principales de la aplicación (vistas de rutas)
│       │   ├── Auth/           # Páginas de autenticación
│       │   │   ├── Login.js
│       │   │   └── Register.js
│       │   ├── Chat/           # Páginas de chat
│       │   │   ├── Chat.js     # Chat 1:1
│       │   │   └── Chatbot.js  # Chat con IA
│       │   ├── Dashboard/      # Dashboards por rol
│       │   │   ├── AdminDashboard.js
│       │   │   ├── ClientDashboard.js
│       │   │   └── TrainerDashboard.js
│       │   ├── Management/     # Páginas de gestión y catálogos
│       │   │   ├── AddEditDietPlan.js
│       │   │   ├── AddEditRoutine.js
│       │   │   ├── DietManagement.js
│       │   │   ├── ExerciseCatalog.js
│       │   │   ├── MealCatalog.js
│       │   │   └── RoutineManagement.js
│       │   ├── Progress/       # Páginas de progreso
│       │   │   ├── ClientProgress.js
│       │   │   └── ViewProgress.js
│       │   └── NotFound.js     # Página 404
│       ├── App.css             # Estilos CSS globales y tema de gimnasio
│       ├── App.js              # Componente principal de la aplicación y rutas
│       ├── index.js            # Punto de entrada de la aplicación React
│       └── ...                 # Otros archivos de configuración de CRA
├── server/                     # Servidor Node.js (Backend)
│   ├── config/                 # Configuraciones de la base de datos y Socket.IO
│   │   ├── db.js               # Conexión a MongoDB
│   │   └── socket.js           # Configuración de Socket.IO
│   ├── controllers/            # Lógica de negocio para las rutas API
│   │   ├── authController.js
│   │   ├── chatbotController.js
│   │   ├── chatController.js
│   │   ├── dietController.js
│   │   ├── progressController.js
│   │   ├── routineController.js
│   │   └── userController.js
│   ├── middleware/             # Middlewares personalizados (autenticación, autorización)
│   │   └── authMiddleware.js
│   ├── models/                 # Definición de esquemas de MongoDB (Mongoose)
│   │   ├── DietPlan.js
│   │   ├── Exercise.js
│   │   ├── Meal.js
│   │   ├── Message.js
│   │   ├── Progress.js
│   │   ├── Routine.js
│   │   ├── User.js
│   │   └── ...
│   ├── routes/                 # Definición de rutas API
│   │   ├── authRoutes.js
│   │   ├── chatbotRoutes.js
│   │   ├── chatRoutes.js
│   │   ├── dietRoutes.js
│   │   ├── exerciseCatalogRoutes.js
│   │   ├── mealCatalogRoutes.js
│   │   ├── progressRoutes.js
│   │   ├── routineRoutes.js
│   │   └── userRoutes.js
│   ├── utils/                  # Utilidades (ej. generación de JWT)
│   │   └── jwt.js
│   ├── .env                    # Variables de entorno (¡NO SUBIR A GIT!)
│   ├── package.json            # Dependencias del backend
│   └── server.js               # Archivo principal del servidor
├── .gitignore                  # Ignorar archivos y carpetas (ej. node_modules, .env)
└── README.md                   # Este archivo
```

---

## 🔑 Usuarios de Prueba (Ejemplos)
Administrador
Email: admin@gym.com

Contraseña: adminpass

Se debe asignar rol admin manualmente en la base de datos.

Entrenador
Email: trainer@gym.com

Contraseña: trainerpass

Clave de acceso: definida en .env (ADMIN_TRAINER_KEY)

Cliente
Email: client@gym.com

Contraseña: clientpass

Entrenador asignado: trainer@gym.com (desde el panel de admin o entrenador)

🧠 Chatbot IA
El chatbot está conectado a Ollama con el modelo llama3.1:8b, puede responder preguntas sobre fitness, nutrición y el uso de la app. Mantiene el contexto y recuerda el historial de conversación.