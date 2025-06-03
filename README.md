GYMTRACK 🏋️‍♂️

GYMTRACK es una aplicación web integral diseñada para la gestión de gimnasios y el seguimiento de progreso personal en el fitness. Permite a administradores gestionar usuarios, a entrenadores asignar rutinas y planes de dieta personalizados a sus clientes, y a los clientes registrar su progreso y comunicarse con su entrenador y un chatbot inteligente.

📋 Características Principales
Autenticación y Autorización por Roles: Seguridad basada en JWT con roles de Administrador, Entrenador y Cliente.
Gestión de Usuarios (Admin): El administrador puede ver y eliminar usuarios (clientes, entrenadores).
Panel de Entrenador:
Listado de clientes asignados.
Asignación y gestión (CRUD) de rutinas y planes de dieta por cliente.
Gestión (CRUD) de catálogos globales de ejercicios y comidas.
Visualización del progreso del cliente.
Panel de Cliente:
Visualización de rutina y plan de dieta activos actualmente y próximos.
Registro detallado del progreso (peso, medidas, métricas de rendimiento, fotos, notas).
Historial visualizable del progreso.
Comunicación en Tiempo Real:
Chat 1:1: Entre entrenadores y sus clientes asignados.
Chatbot Asistente: Un asistente inteligente impulsado por Ollama (IA), entrenado para responder preguntas sobre fitness, nutrición y el uso de la aplicación. Mantiene el contexto de la conversación y recuerda el historial.
Diseño Moderno y Responsivo: Interfaz de usuario intuitiva y atractiva construida con React.js y Bootstrap 5, siguiendo un tema oscuro de gimnasio.
🚀 Tecnologías Utilizadas
Backend:
Node.js: Entorno de ejecución JavaScript.
Express.js: Framework web para Node.js.
MongoDB: Base de datos NoSQL.
Mongoose: ODM (Object Data Modeling) para MongoDB.
Socket.IO: Lbrería para comunicación bidireccional en tiempo real (WebSockets).
Ollama: Plataforma para ejecutar modelos de lenguaje grandes (LLMs) localmente.
JSON Web Tokens (JWT): Para autenticación segura.
Bcrypt.js: Para hashing de contraseñas.
dotenv: Para la gestión de variables de entorno.
express-async-handler: Para el manejo simplificado de errores asíncronos en Express.
Frontend:
React.js: Librería JavaScript para construir interfaces de usuario.
React Router Dom: Para la navegación en la aplicación de una sola página (SPA).
Axios: Cliente HTTP para realizar peticiones a la API del backend.
Bootstrap 5: Framework CSS para diseño responsivo y componentes de UI pre-estilizados.
react-markdown: Para renderizar contenido Markdown (respuestas del chatbot).
Context API: Para gestión de estado global de autenticación y sockets.
⚙️ Configuración y Ejecución del Proyecto
Sigue estos pasos para configurar y ejecutar GYMTRACK en tu entorno local.

Requisitos Previos
Node.js (v14 o superior)
npm (v6 o superior)
MongoDB (Instancia local o una base de datos en la nube como MongoDB Atlas)
Ollama (instalado y funcionando con el modelo llama3.1:8b descargado)

1. Clonar el Repositorio
   git clone <url_de_tu_repositorio>
   cd GYMTRACK
2. Configuración del Backend
   Navega a la carpeta server y configura tus variables de entorno.

cd server
Crear archivo .env:
Crea un archivo llamado .env en la raíz de la carpeta server con el siguiente contenido:

PORT=5000
MONGO_URI=your_mongodb_connection_string # Ej: mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=your_jwt_secret_key # Una cadena de texto larga y segura
ADMIN_TRAINER_KEY=your_admin_trainer_access_key # Clave secreta para registrar entrenadores (ej: 'claveSecretaTrainer')
OLLAMA_API_URL=http://localhost:11434/api/generate # Endpoint de la API de Ollama (ajusta si tu Ollama no está en local:11434)
¡Importante: No compartas tu archivo .env ni lo subas a repositorios públicos!

Instalar dependencias del Backend:

npm install
Iniciar el Servidor Backend:

npm start
El servidor se ejecutará en http://localhost:5000.

3. Configuración del Frontend
   Abre una nueva terminal, navega a la carpeta client.

cd ../client
Configurar Bootstrap:
Asegúrate de que Bootstrap es enlazado en client/public/index.html via CDN o instalado con npm (ver client/public/index.html para el CDN).

Instalar dependencias del Frontend:

npm install
Iniciar la Aplicación Frontend:

npm start
La aplicación React se abrirá en tu navegador en http://localhost:3000.

🗺️ Estructura del Proyecto
GYMTRACK/
├── client/ # Aplicación React (Frontend)
│ ├── public/ # Archivos HTML, favicon, etc.
│ │ └── index.html # Punto de entrada HTML (con enlaces a Bootstrap CDN)
│ └── src/ # Código fuente de React
│ ├── api/ # Configuración de Axios
│ │ └── axiosInstance.js
│ ├── assets/ # Imágenes, iconos, etc. (vacío por defecto, útil para logos)
│ ├── components/ # Componentes React reutilizables (Cards, Header)
│ │ ├── DietCard.js
│ │ ├── Header.js
│ │ └── RoutineCard.js
│ ├── context/ # Contextos de React para estado global
│ │ ├── AuthContext.js # Contexto de autenticación
│ │ └── SocketContext.js # Contexto para Socket.IO
│ ├── hooks/ # Custom Hooks de React
│ │ └── useAuth.js
│ ├── pages/ # Páginas principales de la aplicación (vistas de rutas)
│ │ ├── Auth/ # Páginas de autenticación
│ │ │ ├── Login.js
│ │ │ └── Register.js
│ │ ├── Chat/ # Páginas de chat
│ │ │ ├── Chat.js # Chat 1:1
│ │ │ └── Chatbot.js # Chat con IA
│ │ ├── Dashboard/ # Dashboards por rol
│ │ │ ├── AdminDashboard.js
│ │ │ ├── ClientDashboard.js
│ │ │ └── TrainerDashboard.js
│ │ ├── Management/ # Páginas de gestión y catálogos
│ │ │ ├── AddEditDietPlan.js
│ │ │ ├── AddEditRoutine.js
│ │ │ ├── DietManagement.js
│ │ │ ├── ExerciseCatalog.js
│ │ │ ├── MealCatalog.js
│ │ │ └── RoutineManagement.js
│ │ ├── Progress/ # Páginas de progreso
│ │ │ ├── ClientProgress.js
│ │ │ └── ViewProgress.js
│ │ └── NotFound.js # Página 404
│ ├── App.css # Estilos CSS globales y tema de gimnasio
│ ├── App.js # Componente principal de la aplicación y rutas
│ ├── index.js # Punto de entrada de la aplicación React
│ └── ... # Otros archivos de configuración de CRA
├── server/ # Servidor Node.js (Backend)
│ ├── config/ # Configuraciones de la base de datos y Socket.IO
│ │ ├── db.js # Conexión a MongoDB
│ │ └── socket.js # Configuración de Socket.IO
│ ├── controllers/ # Lógica de negocio para las rutas API
│ │ ├── authController.js
│ │ ├── chatbotController.js
│ │ ├── chatController.js
│ │ ├── dietController.js
│ │ ├── progressController.js
│ │ ├── routineController.js
│ │ └── userController.js
│ ├── middleware/ # Middlewares personalizados (autenticación, autorización)
│ │ └── authMiddleware.js
│ ├── models/ # Definición de esquemas de MongoDB (Mongoose)
│ │ ├── DietPlan.js
│ │ ├── Exercise.js
│ │ ├── Meal.js
│ │ ├── Message.js
│ │ ├── Progress.js
│ │ ├── Routine.js
│ │ ├── User.js
│ │ └── ...
│ ├── routes/ # Definición de rutas API
│ │ ├── authRoutes.js
│ │ ├── chatbotRoutes.js
│ │ ├── chatRoutes.js
│ │ ├── dietRoutes.js
│ │ ├── exerciseCatalogRoutes.js
│ │ ├── mealCatalogRoutes.js
│ │ ├── progressRoutes.js
│ │ ├── routineRoutes.js
│ │ └── userRoutes.js
│ ├── utils/ # Utilidades (ej. generación de JWT)
│ │ └── jwt.js
│ ├── .env # Variables de entorno (¡NO SUBIR A GIT!)
│ ├── package.json # Dependencias del backend
│ └── server.js # Archivo principal del servidor
├── .gitignore # Ignorar archivos y carpetas (ej. node_modules, .env)
└── README.md # Este archivo
🔑 Usuarios de Prueba (Ejemplos)
Para empezar a probar, puedes crear estos usuarios (ajustando las claves según tu .env):

Administrador:
Email: admin@gym.com
Contraseña: adminpass
Rol: admin (tendrá que asignarse manualmente en la DB o crear el primer admin con la clave directa).
Entrenador:
Email: trainer@gym.com
Contraseña: trainerpass
Rol: trainer
Clave de Acceso (ADMIN_TRAINER_KEY): La que definiste en tu .env.
Cliente: (Deberás registrarlo a través del formulario de registro y asignarle un entrenador).
Email: client@gym.com
Contraseña: clientpass
Rol: client
Entrenador asignado: trainer@gym.com (seleccionar de la lista).
