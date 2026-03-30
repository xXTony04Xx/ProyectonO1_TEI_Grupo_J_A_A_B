const OpenAI = require("openai");
const systemPrompt = require("../prompts/systemPrompt");

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

const askTutor = async (message) => {
  const completion = await client.chat.completions.create({
    model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: message }
    ],
    temperature: 0.4
  });

  return completion.choices[0].message.content;
};

module.exports = {
  askTutor
};