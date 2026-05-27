import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI Chat Endpoint
  app.post("/api/assessment", async (req, res) => {
    try {
      const { messages, state } = req.body;
      
      const systemInstruction = `You are a professional Canadian Entrepreneur Immigration consultant AI for "CPORT IMMIGRATION AI".
Your goal is to assess the user's eligibility for Canadian Provincial Nominee Program (PNP) entrepreneur streams.
Maintain a premium, trustworthy, and corporate tone. Do not guarantee visas or provide legal advice.
Ask ONE question at a time to gather the following:
- Country of citizenship & current residence
- Age
- Education level
- English/French language ability (CLB level ideally)
- Business ownership and/or senior management experience (years)
- Personal net worth (CAD)
- Available investment amount (CAD)
- Industry/business type
- Preferred Canadian province
- Family members accompanying
- Previous visa refusals
- Interest in purchasing vs starting a business
- Timeline

Current Extracted State: ${JSON.stringify(state)}

Respond with a JSON object ONLY, containing:
{
  "reply": "Your conversational reply to the user, asking the next question or confirming information.",
  "extractedData": {
    // any NEW or UPDATED fields you extracted from their latest message. Match these keys precisely:
    "citizenship": "...", "residence": "...", "age": 0, "education": "...", "language": "...",
    "businessExperience": "...", "managementExperience": "...", "netWorth": 0, "investment": 0,
    "industry": "...", "province": "...", "family": "...", "refusals": "...", "buyOrStart": "...", "timeline": "..."
  }
}
`;

      const formattedMessages = messages.map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: formattedMessages,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
        }
      });

      const responseText = response.text || "{}";
      const parsedResponse = JSON.parse(responseText);

      res.json(parsedResponse);
    } catch (error) {
      console.error("AI Error:", error);
      res.status(500).json({ error: "Failed to process chat" });
    }
  });

  // Setup Vite Middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
