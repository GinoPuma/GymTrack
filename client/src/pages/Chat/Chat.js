import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import { useParams } from "react-router-dom";
import axios from "../../api/axiosInstance";

const Chat = () => {
  const { userInfo } = useAuth();
  const { socket, isConnected } = useSocket();
  const { otherUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [otherUser, setOtherUser] = useState(null);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let userEndpoint = "";
        if (userInfo.role === "trainer") {
          userEndpoint = `/users/clients/${otherUserId}`;
        } else if (
          userInfo.role === "client" &&
          String(userInfo.trainerId) === String(otherUserId)
        ) {
          userEndpoint = "/users/my-trainer";
        } else {
          console.error("Acceso a chat no autorizado o usuario no válido.");
          setError("Acceso no autorizado.");
          return;
        }

        const { data } = await axios.get(userEndpoint);
        setOtherUser(data);
      } catch (err) {
        setError(
          "Error al cargar usuario: " +
            (err.response?.data?.message || err.message)
        );
      }
    };

    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(`/chat/${otherUserId}`);
        setMessages(data);
        scrollToBottom();
      } catch (err) {
        setError(
          "Error al cargar mensajes: " +
            (err.response?.data?.message || err.message)
        );
      }
    };

    if (userInfo && otherUserId) {
      setError("");
      fetchUserData();
      fetchMessages();
    }
  }, [userInfo, otherUserId]);

  useEffect(() => {
    if (!socket) return;
    const handleReceiveMessage = (message) => {
      const isMessageForThisChat =
        (String(message.senderId._id) === String(otherUserId) &&
          String(message.receiverId._id) === String(userInfo._id)) ||
        (String(message.senderId._id) === String(userInfo._id) &&
          String(message.receiverId._id) === String(otherUserId));

      if (isMessageForThisChat) {
        setMessages((prevMessages) => {
          if (message._id) {
            const existingMessageIndex = prevMessages.findIndex(
              (m) =>
                String(m.content) === String(message.content) &&
                String(m.senderId._id) === String(message.senderId._id) &&
                !m._id
            );

            if (existingMessageIndex > -1) {
              const updatedMessages = [...prevMessages];
              updatedMessages[existingMessageIndex] = message;
              return updatedMessages;
            }
          }
          return [...prevMessages, message];
        });
      }
    };
    socket.on("receiveMessage", handleReceiveMessage);
    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket, messages, otherUserId, userInfo]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !socket || !isConnected) return;

    const msgToSend = {
      receiverId: otherUserId,
      content: newMessage.trim(),
      senderId: { _id: userInfo._id, username: userInfo.username },
      createdAt: new Date().toISOString(),
      status: "pending",
    };

    setMessages((prevMessages) => [...prevMessages, msgToSend]);
    socket.emit("sendMessage", {
      receiverId: otherUserId,
      content: newMessage.trim(),
    });
    setNewMessage("");
  };

  if (!userInfo)
    return (
      <div className="container mt-5">
        <div className="alert alert-warning text-center" role="alert">
          Inicia sesión.
        </div>
      </div>
    );
  if (!otherUser)
    return (
      <div className="container mt-5 text-center">
        <p className="lead text-muted">Cargando chat...</p>
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
        <h2 className="mb-4 text-white">Chat con {otherUser.username}</h2>

        {!isConnected && (
          <div className="alert alert-warning text-center my-3" role="alert">
            Conexión al chat perdida. Reintentando...
          </div>
        )}

        <div
          className="card bg-dark border-secondary shadow-lg mb-3"
          style={{ height: "500px", overflowY: "auto" }}
        >
          <div className="card-body p-3">
            {messages.length === 0 && (
              <p className="text-center text-muted">
                Inicia la conversación...
              </p>
            )}
            {messages.map((msg, index) => {
              const senderIdObj = msg.senderId || {};
              const isMyMessage =
                String(senderIdObj._id) === String(userInfo._id);

              return (
                <div
                  key={msg._id || index}
                  className={`d-flex ${
                    isMyMessage
                      ? "justify-content-end"
                      : "justify-content-start"
                  } mb-3`}
                >
                  <div
                    className={`p-3 rounded-3 shadow-sm ${
                      isMyMessage
                        ? "bg-primary text-white"
                        : "bg-secondary text-white"
                    } `}
                    style={{ maxWidth: "75%" }}
                  >
                    <small
                      className="fw-bold d-block mb-1 opacity-75"
                      style={{
                        color: isMyMessage
                          ? "rgba(255,255,255,0.7)"
                          : "rgba(255,255,255,0.7)",
                      }}
                    >
                      {isMyMessage
                        ? "Tú"
                        : senderIdObj.username || "Usuario Desconocido"}{" "}
                      <span className="small fst-italic ms-1 d-inline-block">
                        {new Date(
                          msg.createdAt || msg.timestamp
                        ).toLocaleTimeString()}
                      </span>
                    </small>
                    {msg.content}
                    {msg.status === "pending" && (
                      <span className="badge bg-warning ms-2">Enviando...</span>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} /> {/* Para el scroll automático */}
          </div>
        </div>

        <form onSubmit={handleSendMessage} className="d-flex mt-3 gap-2">
          <input
            type="text"
            className="form-control form-control-lg" 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe tu mensaje..."
            disabled={!isConnected}
          />
          <button
            type="submit"
            className="btn btn-primary btn-lg" 
            disabled={!isConnected}
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
