import json
import os
import tempfile
from pathlib import Path
from threading import Lock
from flask import Flask, request, jsonify, Response
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
    system_prompt_data = json.load(system_prompt_file)

history_lock = Lock()


def build_system_prompt(prompt_data: dict) -> str:
    # Compatibilidad con formato anterior: {"system_prompt": "..."}
    if "system_prompt" in prompt_data and isinstance(prompt_data["system_prompt"], str):
        return prompt_data["system_prompt"]

    title = prompt_data.get("title", "")
    context = prompt_data.get("context", "")
    main_function = prompt_data.get("main_function", "")
    rules = prompt_data.get("rules", [])
    pedagogy = prompt_data.get("pedagogical_strategy", [])
    tone = prompt_data.get("tone_and_style", [])
    out_of_scope = prompt_data.get("out_of_scope_response", "")
    knowledge = prompt_data.get("knowledge", [])

    sections = [
        title,
        context,
        "TU FUNCION PRINCIPAL",
        main_function,
        "REGLAS DE CONTENIDO Y SEGURIDAD (CRITICO)",
    ]

    sections.extend([f"{idx + 1}. {rule}" for idx, rule in enumerate(rules)])
    sections.extend([
        "",
        "RESPUESTA OBLIGATORIA PARA TEMAS FUERA DE CONTENIDO",
        out_of_scope,
        "",
        "ESTRATEGIA PEDAGOGICA (APRENDIZAJE VISUAL-PRACTICO)",
    ])
    sections.extend([f"- {item}" for item in pedagogy])
    sections.extend([
        "",
        "TONO Y ESTILO",
    ])
    sections.extend([f"- {item}" for item in tone])
    sections.extend([
        "",
        "---",
        "CONOCIMIENTO ESPECÍFICO DEL CURSO",
        "(Esta es tu ÚNICA fuente de verdad.)",
        "",
    ])
    sections.extend([f"- {item}" for item in knowledge])

    return "\n".join([line for line in sections if line is not None])


system_promt = build_system_prompt(system_prompt_data)
chat_history: list[dict] = []

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json or {}
    user_message = (data.get("message", "") or "").strip()

    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    try:
        with history_lock:
            history_snapshot = list(chat_history)

        # Aquí usamos el modelo más barato: gpt-4o-mini
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_promt},
                *history_snapshot,
                {"role": "user", "content": user_message}
            ],
            max_tokens=500,
            temperature=0.5
        )

        answer = response.choices[0].message.content

        with history_lock:
            chat_history.append({"role": "user", "content": user_message})
            chat_history.append({"role": "assistant", "content": answer})

        return jsonify({"response": answer})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/tts', methods=['POST'])
def tts():
    data = request.json or {}
    text = (data.get("text", "") or "").strip()

    if not text:
        return jsonify({"error": "No text provided"}), 400

    # gpt-4o-mini-tts suele ser una opción económica para TTS.
    tts_model = os.getenv("OPENAI_TTS_MODEL", "gpt-4o-mini-tts")
    tts_voice = os.getenv("OPENAI_TTS_VOICE", "onyx")

    temp_path = None
    try:
        with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as temp_file:
            temp_path = temp_file.name

        with client.audio.speech.with_streaming_response.create(
            model=tts_model,
            voice=tts_voice,
            input=text
        ) as tts_response:
            tts_response.stream_to_file(temp_path)

        with open(temp_path, "rb") as audio_file:
            audio_bytes = audio_file.read()

        return Response(audio_bytes, mimetype="audio/mpeg")

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)

if __name__ == '__main__':
    app.run(debug=True, port=5000)