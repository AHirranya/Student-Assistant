import { useState } from "react";
import API from "../services/api";

function PodAI() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async (e) => {
    e.preventDefault();

    if (!prompt.trim()) {
      alert("Please enter a question.");
      return;
    }

    try {
      setLoading(true);
      setReply("");

      const res = await API.post("/ai/ask", { prompt });

      setReply(res.data.reply);
    } catch (error) {
      setReply(error.response?.data?.message || "AI response failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>POD AI</h1>
      <p className="sub-text">
        Personal Organizer and Doubt Assistant for study planning, internships,
        resume tips, and revision help.
      </p>

      <form className="form-card" onSubmit={askAI}>
        <textarea
          placeholder="Ask POD AI, example: Plan my study for DBMS exam in 5 days"
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