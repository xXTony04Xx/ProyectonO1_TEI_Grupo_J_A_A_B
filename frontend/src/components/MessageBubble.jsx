function MessageBubble({ text, sender }) {
  return (
    <div className={`message-row ${sender === "user" ? "user-row" : "bot-row"}`}>
      <div
        className={`message-bubble ${
          sender === "user" ? "user-bubble user-animate" : "bot-bubble bot-animate"
        }`}
      >
        {text}
      </div>
    </div>
  );
}

export default MessageBubble;