const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({
        error: "El mensaje es obligatorio"
      });
    }

    return res.status(200).json({
      reply: `Recibí tu pregunta: "${message}". Más adelante responderé como Tutor IA.`
    });
  } catch (error) {
    console.error("Error en chatController:", error);

    return res.status(500).json({
      error: "Ocurrió un error interno en el servidor"
    });
  }
};

module.exports = {
  sendMessage
};