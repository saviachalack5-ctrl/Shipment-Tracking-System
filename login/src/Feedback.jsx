import React, { useState } from "react";
import Navbar from "./Navbar";
import "./App.css";

const Feedback = () => {
  const [feedback, setFeedback] = useState("");

  return (
    <div style={{ width: "90%", paddingLeft: "20px" }}>
      <Navbar current="feedback" />

      <h3 style={{ textAlign: "left" }}>Please give us your feedback</h3>

      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Write here..."
        style={{
          width: "500px",
          height: "145px",
          outline: "0.8px solid #6f6fe5ff",
          fontSize: "1.06rem",
          borderRadius: "10px",
          border: "1px solid #bfb3f2",
          transition: "0.2s ease",
          marginTop: "18px",
          padding: "8px 12px",
          textAlign: "left",
          resize: "none",
        }}
      />
    </div>
  );
};

export default Feedback;
