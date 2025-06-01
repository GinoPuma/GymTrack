const axios = require("axios");

const getChatbotResponse = async (req, res) => {
  const { currentMessage, history } = req.body;

  if (!currentMessage) {
    return res.status(400).json({ message: "Se requiere un mensaje actual." });
  }

  // Define el contexto del sistema para el chatbot
  const systemContext = `Eres un asistente de chatbot para una aplicación de gestión de gimnasios y fitness llamada GYMTRACK.
Tu propósito es responder preguntas relacionadas con el gimnasio, el fitness, la nutrición, los planes de entrenamiento,
cómo usar las funcionalidades de la aplicación GYMTRACK, y el apoyo a usuarios (clientes y entrenadores).
Responde de forma útil, concisa y siempre manteniéndote en el contexto de nuestra aplicación y el fitness.
Evita hablar de temas que no estén relacionados con el gimnasio, el fitness o el uso de la aplicación.
Si te preguntan tu nombre, responde que eres el Asistente GYMTRACK.
Si el usuario pregunta algo fuera de tu alcance, puedes decirle: "Mi experiencia se centra en el fitness y el uso de la aplicación GYMTRACK. ¿Hay algo más relacionado con esto en lo que pueda ayudarte?".`;

  let fullPrompt = `<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n${systemContext}<|eot_id|>`;

  history.forEach((msg) => {
    if (msg.sender === "user") {
      fullPrompt += `<|start_header_id|>user<|end_header_id|>\n${msg.text}<|eot_id|> `;
    } else {
      // sender === "bot"
      fullPrompt += `<|start_header_id|>assistant<|end_header_id|>\n${msg.text}<|eot_id|> `;
    }
  });

  fullPrompt += `<|start_header_id|>user<|end_header_id|>\n${currentMessage}<|eot_id|><|start_header_id|>assistant<|end_header_id|>`;

  try {
    const response = await axios.post(process.env.OLLAMA_API_URL, {
      model: "llama3.1:8b",
      prompt: fullPrompt, 
      stream: false,
    });

    const botResponse = response.data.response;
    res.json({ reply: botResponse });
  } catch (error) {
    console.error(
      "Error al comunicarse con Ollama:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({
      message:
        "Error al conectar con el chatbot. Asegúrate de que Ollama está corriendo y el modelo está disponible.",
    });
  }
};

module.exports = { getChatbotResponse };
