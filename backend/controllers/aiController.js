const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Health', 'Entertainment', 'Education', 'Bills', 'Other'];

const suggestCategory = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: `You are an expense categorization assistant. Given an expense title, respond with ONLY one word from this list: ${CATEGORIES.join(', ')}. No explanation, no punctuation, just the category word.`,
        },
        {
          role: 'user',
          content: `Categorize this expense: "${title}"`,
        },
      ],
      max_tokens: 10,
      temperature: 0.1,
    });

    const suggested = completion.choices[0]?.message?.content?.trim();
    const category = CATEGORIES.includes(suggested) ? suggested : 'Other';

    res.json({ category });
  } catch (error) {
    console.error('AI Error:', error.message);
    res.status(500).json({ message: 'AI categorization failed' });
  }
};

module.exports = { suggestCategory };