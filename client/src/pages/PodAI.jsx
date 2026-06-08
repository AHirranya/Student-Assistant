import { useState } from "react";
import API from "../services/api";

function PodAI() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async (e) => {
    e.preventDefault();

    if (!prompt.trim()) {
      alert("Please enter your question.");
      return;
    }

    try {
      setLoading(true);
      setReply("");

      const res = await API.post("/ai/ask", {
        prompt,
      });

      setReply(res.data.reply);
    } catch (error) {
      setReply(error.response?.data?.message || "POD AI failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>POD AI</h1>
      <p className="sub-text">
        Personal Organizer and Doubt Assistant for study planning, notes,
        internships, and resume improvement.
      </p>

      <form className="form-card" onSubmit={askAI}>
        <textarea
          placeholder="Ask POD AI, example: Make a study plan for my DBMS exam"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          required
        />

        <button type="submit">{loading ? "Thinking..." : "Ask POD AI"}</button>
      </form>

      {reply && (
        <div className="section-card">
          <h2>POD AI Response</h2>
          <pre className="ai-response">{reply}</pre>
        </div>
      )}
    </div>
  );
}

export default PodAI;