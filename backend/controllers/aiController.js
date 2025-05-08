import { generateAIResponse } from '../services/aiService.js';

export const askAI = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    const reply = await generateAIResponse(message);
    res.json({ reply });
  } catch (err) {
    console.error('AI Controller error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};