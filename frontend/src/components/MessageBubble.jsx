import ReactMarkdown from "react-markdown";

function MessageBubble({ text, sender }) {
  const speak = () => {
  if (!("speechSynthesis" in window)) return;

  const voices = window.speechSynthesis.getVoices();

  console.log(
    voices.map((voice) => ({
      name: voice.name,
      lang: voice.lang
    }))
  );

  const utterance = new SpeechSynthesisUtterance(text);

  const preferredVoice =
    voices.find((voice) => voice.lang === "es-ES") ||
    voices.find((voice) => voice.lang === "es-MX") ||
    voices.find((voice) => voice.lang.startsWith("es")) ||
    voices.find((voice) => voice.name.toLowerCase().includes("spanish"));

  if (preferredVoice) {
    utterance.voice = preferredVoice;
    utterance.lang = preferredVoice.lang;
  } else {
    utterance.lang = "es-ES";
  }

  utterance.rate = 0.95;
  utterance.pitch = 1;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
};

  return (
    <div className={`message-row ${sender === "user" ? "user-row" : "bot-row"}`}>
      <div
        className={`message-bubble ${
          sender === "user" ? "user-bubble user-animate" : "bot-bubble bot-animate"
        }`}
      >
        {sender === "bot" ? (
          <div className="markdown-content">
            <ReactMarkdown>{text}</ReactMarkdown>

            <button className="speak-button" onClick={speak}>
              🔊 Escuchar
            </button>
          </div>
        ) : (
          text
        )}
      </div>
    </div>
  );
}

export default MessageBubble;