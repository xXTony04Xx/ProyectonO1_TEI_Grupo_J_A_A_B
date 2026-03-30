const { askTutor } = require("../services/aiService");

const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({
        error: "El mensaje es obligatorio"
      });
    }

    const reply = await askTutor(message);

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("=== ERROR COMPLETO IA ===");
    console.error(error);

    if (error.status) {
      console.error("Status:", error.status);
    }

    if (error.message) {
      console.error("Message:", error.message);
    }

    if (error.response) {
      console.error("Response:", error.response);
    }

    if (error.error) {
      console.error("Error body:", error.error);
    }

    return res.status(500).json({
      error: "Ocurrió un error al consultar la IA"
    });
  }
};

module.exports = {
  sendMessage
};