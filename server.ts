import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;

  // Initialize Gemini safely using lazy load check
  let aiInstance: GoogleGenAI | null = null;
  function getGenAI() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured in environment secrets. Please set it in Settings > Secrets.");
    }
    if (!aiInstance) {
      aiInstance = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return aiInstance;
  }

  // API Route: Translate and analyze text
  app.post("/api/translate", async (req, res) => {
    try {
      const { text, sourceLang, targetLang } = req.body;
      if (!text || !text.trim()) {
        return res.status(400).json({ error: "Text is required for translation." });
      }

      const ai = getGenAI();
      const prompt = `You are a professional linguistics and translation engine named LinguistPro.
Translate the following text into "${targetLang}".
The user-specified source language is "${sourceLang}". If it is "Detect language", auto-detect the language and identify it precisely.

Additionally, provide:
1. "detectedLanguage": Name of the source language (e.g. "English", "French", "German", "Spanish", "Japanese").
2. "detectedLanguageCode": ISO 639-1 code of the source language (e.g. "en", "fr", "de", "es", "ja").
3. "grammarNotes": A list of up to 3 helpful grammatical suggestions, tense corrections, style tips, or punctuation notes based on the input text. If the input is grammatically perfect, return an empty list.
4. "dictionary": A list of 1 to 3 key vocabulary words (either from the source or target) with their definitions, synonyms, and a clean usage example.

Input Text to Translate:
"""
${text}
"""`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              translatedText: {
                type: Type.STRING,
                description: "The complete, high-quality translation of the input text into the target language."
              },
              detectedLanguage: {
                type: Type.STRING,
                description: "The name of the detected source language."
              },
              detectedLanguageCode: {
                type: Type.STRING,
                description: "The ISO 639-1 code of the detected source language."
              },
              grammarNotes: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Grammar, tense, or punctuation suggestions. Empty array if none."
              },
              dictionary: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    word: { type: Type.STRING, description: "Key vocabulary word." },
                    definition: { type: Type.STRING, description: "Definition of the word." },
                    synonyms: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Synonyms of the word." },
                    usageExample: { type: Type.STRING, description: "An example sentence demonstrating correct usage." }
                  },
                  required: ["word", "definition"]
                },
                description: "Key dictionary terms from the translated content."
              }
            },
            required: ["translatedText", "detectedLanguage"]
          }
        }
      });

      const resultText = response.text;
      if (!resultText) {
        throw new Error("No response received from the translation model.");
      }

      const resultJson = JSON.parse(resultText);
      return res.json(resultJson);
    } catch (error: any) {
      console.error("Translation error:", error);
      return res.status(500).json({ error: error.message || "An unexpected translation error occurred." });
    }
  });

  // API Route: Fetch URL content for website translation
  app.post("/api/fetch-url", async (req, res) => {
    try {
      const { url } = req.body;
      if (!url) {
        return res.status(400).json({ error: "URL is required." });
      }

      let targetUrl = url.trim();
      if (!/^https?:\/\//i.test(targetUrl)) {
        targetUrl = 'http://' + targetUrl;
      }

      const response = await fetch(targetUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });

      if (!response.ok) {
        return res.status(400).json({ error: `Failed to fetch URL. Status: ${response.status}` });
      }

      const html = await response.text();
      
      // Extract title
      const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      const title = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '').trim() : "";

      // Extract readable paragraphs and headers
      const tagsToExtract = [
        /<p[^>]*>([\s\S]*?)<\/p>/gi,
        /<h1[^>]*>([\s\S]*?)<\/h1>/gi,
        /<h2[^>]*>([\s\S]*?)<\/h2>/gi
      ];

      const chunks: string[] = [];
      for (const regex of tagsToExtract) {
        let match;
        while ((match = regex.exec(html)) !== null) {
          const cleanText = match[1]
            .replace(/<[^>]*>/g, '') // strip nested HTML tags
            .replace(/\s+/g, ' ')
            .trim();
          if (cleanText.length > 30 && cleanText.length < 1000) {
            chunks.push(cleanText);
          }
        }
      }

      const distinctChunks = Array.from(new Set(chunks)).slice(0, 10);
      let extractedText = title ? `Title: ${title}\n\n` : "";
      extractedText += distinctChunks.join("\n\n");

      if (!extractedText.trim()) {
        // Fallback: strip tags from body
        const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        const bodyHtml = bodyMatch ? bodyMatch[1] : html;
        const fallbackText = bodyHtml
          .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
          .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, '')
          .replace(/<[^>]*>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        extractedText = fallbackText.substring(0, 1500);
      }

      return res.json({ text: extractedText });
    } catch (error: any) {
      console.error("URL fetch error:", error);
      return res.status(500).json({ error: `Could not fetch or parse URL: ${error.message}` });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
