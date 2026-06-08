const askPodAI = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({
        message: "Prompt is required",
      });
    }

    const reply = `
POD AI Response

You asked: ${prompt}

Suggested plan:
1. Check today's class topics.
2. Complete pending notes.
3. Review upcoming exams and reminders.
4. Track attendance and avoid low attendance.
5. Prepare resume and internship applications regularly.

This is a basic POD AI response. Advanced Gemini AI can be connected later.
`;

    res.json({ reply });
  } catch (error) {
    console.error("POD AI error:", error);
    res.status(500).json({
      message: "Error generating POD AI response",
    });
  }
};

module.exports = {
  askPodAI,
};