import json
import os
from pathlib import Path
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from dotenv import load_dotenv


# Cargar variables de entorno
load_dotenv()

app = Flask(__name__)
CORS(app)  # Permite que tu frontend se comunique con el backend

# Inicializar cliente de OpenAI
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

system_prompt_path = Path(__file__).resolve().parent / "data" / "system" / "system_promt.json"
with system_prompt_path.open(encoding="utf-8") as system_prompt_file:
    system_promt = json.load(system_prompt_file)["system_prompt"]

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get("message", "")

    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    try:
        # Aquí usamos el modelo más barato: gpt-4o-mini
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_promt},
                {"role": "user", "content": user_message}
            ],
            max_tokens=500,
            temperature=0.3
        )

        answer = response.choices[0].message.content
        return jsonify({"response": answer})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)