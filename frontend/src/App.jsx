import { useState } from "react";
import ChatContainer from "./components/ChatContainer";
import ChatInput from "./components/ChatInput";
import "./Styles/chat.css";
function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (message) => {
    const userMessage = { text: message, sender: "user" };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      });

      const data = await res.json();

      const botMessage = {
        text: data.reply || "No se recibió respuesta del servidor.",
        sender: "bot"
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);

      const errorMessage = {
        text: "Ocurrió un error al conectar con el servidor.",
        sender: "bot"
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="chat-card">
        <div className="chat-header">
          <h1>Tutor IA</h1>
          <p>Programación Avanzada</p>
        </div>

        <ChatContainer messages={messages} />
        <ChatInput onSend={sendMessage} loading={loading} />
      </div>
    </div>
  );
}

export default App;