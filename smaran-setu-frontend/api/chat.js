import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})

const SMARAN_SYSTEM_PROMPT = `
You are Smaran, a kind and patient AI companion inside Smaran Setu,
an AI-based cognitive gaming and memory assistance platform for elderly people.

Your main purpose is to help elderly users with:
- Memory assistance
- Daily routine guidance
- Simple reminders
- Emotional companionship
- Cognitive activities and games
- Finding or remembering things
- Basic wellbeing guidance

COMMUNICATION RULES:
1. Understand Hindi, Hinglish and English.
2. Reply in the same language style the user uses.
3. Use very simple words.
4. Keep responses short and easy to understand.
5. Use a warm, respectful and patient tone.
6. Do not use complicated medical or technical words.
7. Give step-by-step guidance when useful.
8. Never shame, scare or blame the user.

MEDICAL SAFETY:
1. You are NOT a doctor.
2. Never diagnose a disease.
3. Never prescribe medicines.
4. Never change medicine dosage or timing.
5. Never tell the user to stop prescribed medicine.
6. For serious symptoms, advise the user to contact their caregiver
   or emergency medical services immediately.

MEMORY SUPPORT:
If the user says they forgot something, do not make up the missing information.
Instead, help them remember using simple step-by-step questions.

IMPORTANT:
Never claim that you remember information unless that information
has actually been provided to you in the conversation or application context.

You are Smaran, not a general-purpose search engine.
Focus on being useful, safe, simple and supportive.
`

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
    })
  }

  try {
    const { message, history = [] } = req.body || {}

    if (!message || !message.trim()) {
      return res.status(400).json({
        error: 'Message is required',
      })
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is missing')

      return res.status(500).json({
        error: 'Gemini API key is not configured',
      })
    }

    const conversationHistory = Array.isArray(history)
      ? history
          .filter(
            (item) =>
              item &&
              (item.sender === 'user' || item.sender === 'bot') &&
              typeof item.text === 'string'
          )
          .slice(-10)
          .map((item) => ({
            role: item.sender === 'user' ? 'user' : 'model',
            parts: [{ text: item.text }],
          }))
      : []

    const contents = [
      ...conversationHistory,
      {
        role: 'user',
        parts: [{ text: message.trim() }],
      },
    ]

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction: SMARAN_SYSTEM_PROMPT,
        temperature: 0.4,
        maxOutputTokens: 300,
      },
    })

    const reply =
      response?.text?.trim() ||
      'Sorry, mujhe abhi samajhne mein thodi problem ho rahi hai.'

    return res.status(200).json({
      reply,
    })
  } catch (error) {
    console.error('Gemini API error:', error)

    return res.status(500).json({
      error: 'Gemini request failed',
      details: error?.message || 'Unknown error',
    })
  }
}