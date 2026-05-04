
```javascript
import Anthropic from "@anthropic-ai/sdk";
import * as readline from "readline";

const client = new Anthropic();

// Crear interfaz para lectura de entrada del usuario
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function analyzeText(text) {
  console.log("\n📊 Analizando texto con Claude...\n");

  const systemPrompt = `Eres un analizador de texto experto. Cuando recibas un texto, debes proporcionar:
1. Conteo de palabras totales
2. Conteo de oraciones
3. Conteo de párrafos
4. Palabras únicas y su frecuencia (top 10)
5. Longitud promedio de palabras
6. Palabras más frecuentes con sus porcentajes
7. Análisis de sentimiento (positivo/negativo/neutral)
8. Complejidad del texto (simple/intermedio/avanzado)
9. Temas principales identificados
10. Sugerencias de mejora del texto

Presenta los resultados de forma clara y estructurada.`;

  const userMessage = `Por favor, analiza el siguiente texto y proporciona estadísticas detalladas:

"${text}"

Incluye todas las métricas mencionadas en tu rol.`;

  try {
    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2048,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    // Extraer el contenido de la respuesta
    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    console.log("📈 ANÁLISIS COMPLETO:\n");
    console.log(responseText);

    return responseText;
  } catch (error) {
    console.error("Error al analizar el texto:", error);
    throw error;
  }
}

async function getFollowUpAnalysis(text, previousAnalysis) {
  console.log("\n🔍 Realizando análisis adicional...\n");

  const userMessage = `Basándome en el análisis anterior del siguiente texto:

"${text}"

Análisis previo:
${previousAnalysis}

Por favor proporciona un análisis adicional sobre:
1. Patrones lingüísticos detectados
2. Estructura narrativa (si aplica)
3. Puntos de mejora específicos
4. Comparación con textos estándar
5. Recomendaciones para optimizar la claridad y impacto`;

  try {
    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    console.log("📊 ANÁLISIS ADICIONAL:\n");
    console.log(responseText);

    return responseText;
  } catch (error) {
    console.error("Error en análisis adicional:", error);
    throw error;
  }
}

async function main() {
  console.log("╔════════════════════════════════════════╗");
  console.log("║   ANALIZADOR AVANZADO DE TEXTOS 📝   ║");
  console.log("║   Powered by Claude AI                  ║");
  console.log("╚════════════════════════════════════════╝\n");

  let continueAnalyzing = true;

  while (continueAnalyzing) {
    console.log("Opciones:");
    console.log("1. Ingresar nuevo texto");
    console.log("2. Usar ejemplo de demostración");
    console.log("3. Salir\n");

    const option = await question("Selecciona una opción (1-3): ");

    let textToAnalyze = "";

    if (option === "1") {
      console.log("\n✏️  Ingresa el texto que deseas analizar:");
      console.log("(Para finalizar, presiona Enter dos veces):\n");

      let inputText = "";
      let emptyLineCount = 0;

      while (emptyLineCount < 1) {
        const line = await question("");
        if (line === "") {
          emptyLineCount++;
        } else {
          emptyLineCount = 0;
          inputText += (inputText ? " " : "") + line;
        }
      }

      textToAnalyze = inputText.trim();

      if (!textToAnalyze) {
        console.log("❌ No se ingresó texto. Intenta de nuevo.\n");
        continue;
      }
    } else if (option === "2") {
      // Texto de ejemplo para demostración
      textToAnalyze = `La inteligencia artificial ha revolucionado la forma en que trabajamos y nos comunicamos. 
Desde los asistentes virtuales hasta los sistemas de análisis predictivo, la IA está presente en casi todas las áreas de nuestras vidas. 
El aprendizaje automático permite a las máquinas aprender de los datos sin ser programadas explícitamente para cada tarea. 
Esto ha permitido avances significativos en medicina, educación, transporte y muchos otros campos. 
Sin embargo, también surge la pregunta sobre la ética y la responsabilidad en el desarrollo de estas tecnologías. 
Es crucial que la sociedad participe activamente en la definición de límites y estándares para el uso responsable de la IA. 