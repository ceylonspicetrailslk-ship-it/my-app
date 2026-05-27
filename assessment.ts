import { Handler } from '@netlify/functions';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.AIzaSyBT1cw-tcrg_re4e_tnC92kL4TSVO0V-U4 });

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { messages, state } = JSON.parse(event.body || '{}');

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

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsedResponse)
    };
  } catch (error) {
    console.error("AI Error:", error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: "Failed to process chat" })
    };
  }
};
