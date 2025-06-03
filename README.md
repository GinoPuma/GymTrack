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
├── client/         # Frontend React
│   ├── public/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── pages/
│       └── App.js, index.js, App.css
├── server/         # Backend Node.js
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js, .env, package.json
└── README.md

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