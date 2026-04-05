# ProyectonO1_TEI_Grupo_J_A_A_B# Proyecto Tutor IA - Programación Avanzada 🤖

Chavale: ya tengo sueño y hueva entonces aqui la dejo perooo ya esta mejor restringida. Preguntas fuera de tecnologia no responde ahora preguntas que tienen que ver con tecnología a vecesss le da por responder. Le pase 10 preguntas asi de IA, docker, c++ que no estan en el contenido pero estan como en el area, que no deberia de responder y solo respondio 3 de 12 entonces solo hay que afinar eso. 
Tambien hay que agregarlo lo del modulo de voz para preguntar por voz y fuera de eso no se que más deberiamos agregar. Tiene puesta que responda siempre con la misma estructura de definicion, analogia, ejemplo peroooo eso se me hace que lo querran cambiar o no se si les parece bien, ya ustedes sabran.

En contexto.js esta todo el contenido de las presentaciones. Esta todote mucha me tarde haciendo eso porque el chat monito hay que mandarle de una en una para que si agarre toda la info sino se pasa la mitad de la info por los huevos peroo igual nunca esta de mas corroborar que no se haya artado nada. Yo esperaria que no porque como les digo me fui de una en una. 

Los quiero, los amo, espero se saquen el bicho porque mañana no toi,
AGUANTEEEE TALLEREEEEEEEEEEEEEEEEE

BTW Aqui es lo que va en el venv. :
PORT=3001
GROQ_API_KEY= pidansela a tony porque no deja pushearla por ser secreta jajajaja
GROQ_MODEL=llama-3.1-8b-instant


Este proyecto es un tutor virtual especializado en el contenido de la clase del **Ing. Rojas**. Utiliza la API de **Groq** con el modelo `Llama-3.1-8b-instant` para ofrecer respuestas rápidas y precisas.

## 🚀 Estado Actual del Proyecto
Hemos implementado una arquitectura **RAG (Retrieval-Augmented Generation)** manual. Debido a restricciones de créditos y plan en Groq (Error 403/413), no se utilizó Fine-tuning. En su lugar, el conocimiento de las 22 presentaciones del curso se inyecta dinámicamente en cada consulta.

### Componentes Clave:
1.  **`backend/src/services/contexto.js`**: Contiene el "cerebro" del tutor con +100 líneas de conocimiento técnico extraído de los PDFs originales.
2.  **`backend/src/services/aiService.js`**: Posee un algoritmo de filtrado por palabras clave para enviar solo la información relevante a Groq, evitando saturar el límite de tokens (TPM).
3.  **`backend/src/prompts/systemPrompt.js`**: Define la personalidad "Dictadora" del tutor para que no responda temas ajenos al curso.

## 🛠️ Instalación y Uso

1.  **Variables de Entorno**: Crear un archivo `.env` en la carpeta `backend` con tu `GROQ_API_KEY`.
2.  **Instalar dependencias**:
    ```bash
    cd backend
    npm install
    ```
3.  **Correr el servidor**:
    ```bash
    npm start
    ```

## ⚠️ Reglas del Tutor
* **Temperatura 0.0**: Configurada para evitar alucinaciones. El tutor no debe inventar ejemplos.
* **Restricción de Temas**: Si el tema no está en `contexto.js`, el tutor tiene prohibido responder.





