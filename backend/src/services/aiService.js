const Groq = require("groq-sdk");
const systemPrompt = require("../prompts/systemPrompt");
// ESTA LÍNEA ES LA QUE TE FALTA O TIENE UN NOMBRE DISTINTO:
const documentosCurso = require("./contexto"); 

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function getChatResponse(userMessage) {
  try {
    const query = userMessage.toLowerCase();

    // Filtramos solo los documentos que tengan que ver con lo que el usuario pregunta
    // Si pregunta de arreglos, solo mandamos arreglos.
    const documentosFiltrados = documentosCurso.filter(doc => {
        const contenido = doc.text.toLowerCase();
        // Palabras clave para segmentar
        return contenido.includes(query) || 
               (query.includes("arreglo") && contenido.includes("arreglo")) ||
               (query.includes("lista") && contenido.includes("lista")) ||
               (query.includes("puntero") && contenido.includes("puntero")) ||
               (query.includes("polimorfismo") && contenido.includes("polimorfismo")) ||
               (query.includes("hashing") && contenido.includes("hash"));
    });

    // Si no encontró nada específico, mandamos los primeros 15 como contexto base
    const contextoFinal = documentosFiltrados.length > 0 
        ? documentosFiltrados.map(doc => doc.text).join("\n\n")
        : documentosCurso.slice(0, 15).map(doc => doc.text).join("\n\n");

    const superPrompt = `${systemPrompt}\n\nCONOCIMIENTO ESPECÍFICO DEL CURSO:\n${contextoFinal}`;

    const completion = await groq.chat.completions.create({
      "model": "llama-3.1-8b-instant",
      "messages": [
        { "role": "system", "content": superPrompt },
        { "role": "user", "content": userMessage }
      ],
      "temperature": 0.0,
      "max_completion_tokens": 500 // Bajamos esto para ahorrar espacio
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error en el servicio de IA:", error);
    throw error;
  }
}
module.exports = { getChatResponse };