import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

export const generateAIResponse = async (message) => {
  const API_KEY = process.env.GOOGLE_AI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
  const payload = {
    contents: [{ parts: [{ text: message }] }]
  };
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`AI API Error ${response.status}: ${text}`);
  }
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't find an answer.";
};