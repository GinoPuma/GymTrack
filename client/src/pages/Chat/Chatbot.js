import React, { useState, useRef, useEffect } from "react";
import axios from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import ReactMarkdown from "react-markdown";

const getChatHistoryKey = (userId) => `chatbot_history_${userId}`;

const Chatbot = () => {
  const { userInfo } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!userInfo || !userInfo._id) return;

    const savedHistory = localStorage.getItem(getChatHistoryKey(userInfo._id));
    if (savedHistory) {
      try {
        setMessages(JSON.parse(savedHistory));
      } catch (e) {
        console.error(
          "Error al parsear historial de chatbot desde localStorage:",
          e
        );
        localStorage.removeItem(getChatHistoryKey(userInfo._id)); 
      }
    }
    scrollToBottom();
  }, [userInfo]); 

  useEffect(() => {
    if (messages.length > 0 && userInfo && userInfo._id) {
      localStorage.setItem(
        getChatHistoryKey(userInfo._id),
        JSON.stringify(messages)
      );
    }
  }, [messages, userInfo]); 

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Esto ya estaba para el scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessageToChatbot = async (message) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: message },
    ]);
    setLoading(true);
    setError("");
    scrollToBottom();

    try {
      const { data } = await axios.post("/chatbot", {
        currentMessage: message,
        history: messages, 
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: data.reply },
      ]);
    } catch (err) {
      console.error(
        "Error communicating with chatbot:",
        err.response?.data?.message || err.message
      );
      setError(
        "Error al conectar con el chatbot. Inténtalo de nuevo más tarde."
      );
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "bot",
          text: "Lo siento, no pude procesar tu solicitud en este momento.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      sendMessageToChatbot(inputMessage);
      setInputMessage("");
    }
  };

  if (!userInfo)
    return (
      <div className="container mt-5">
        <div className="alert alert-warning text-center" role="alert">
          Inicia sesión.
        </div>
      </div>
    );

  return (
    <div className="dashboard-bg py-4">
      <div className="container bg-card shadow-lg rounded-lg p-4 my-4">
        <h2 className="mb-4 text-white">Chatbot Asistente</h2>

        {error && (
          <div className="alert alert-danger text-center my-3" role="alert">
            {error}
          </div>
        )}

        <div
          className="card bg-dark border-secondary shadow-sm mb-3"
          style={{ height: "500px", overflowY: "auto" }}
        >
          <div className="card-body p-3">
            {messages.length === 0 && (
              <p className="text-center text-muted">
                ¡Hola! Pregúntame sobre fitness, nutrición, o cualquier cosa.
              </p>
            )}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`d-flex ${
                  msg.sender === "user"
                    ? "justify-content-end"
                    : "justify-content-start"
                } mb-2`}
              >
                <div
                  className={`p-3 rounded-3 shadow-sm ${
                    msg.sender === "user"
                      ? "bg-primary text-white"
                      : "bg-secondary text-white"
                  } `}
                  style={{ maxWidth: "75%" }}
                >
                  {msg.sender === "user" ? (
                    msg.text
                  ) : (
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <p className="text-center text-muted fst-italic">
                <div
                  className="spinner-border spinner-border-sm text-primary me-2"
                  role="status"
                ></div>
                Escribiendo respuesta...
              </p>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="d-flex mt-3 gap-2">
          <input
            type="text"
            className="form-control"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Escribe tu mensaje..."
            disabled={loading}
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
