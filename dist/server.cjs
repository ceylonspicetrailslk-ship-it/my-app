var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_config = require("dotenv/config");
var import_genai = require("@google/genai");
var ai = new import_genai.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
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
      const formattedMessages = messages.map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }]
      }));
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: formattedMessages,
        config: {
          systemInstruction,
          responseMimeType: "application/json"
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
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
