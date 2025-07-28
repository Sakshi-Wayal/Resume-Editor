import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  const [fileChosen, setFileChosen] = useState(false);
  const [fileName, setFileName] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  const navigate = useNavigate();

  const handleChooseFile = () => {
    document.getElementById("hiddenFileInput").click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && /\.(pdf|docx)$/i.test(file.name)) {
      setFileChosen(true);
      setFileName(file.name);

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("http://localhost:8000/parse-resume", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Server Error Response:", errorText);
          throw new Error("Parsing failed");
        }

        const parsedData = await res.json();
        localStorage.setItem("resumeData", JSON.stringify(parsedData));
        setMessage("✅ Resume uploaded and parsed successfully!");
        setMessageType("success");
      } catch (error) {
        console.error("Failed to parse resume:", error);
        // Intentionally not showing any error message to user
      }
    } else {
      alert("⚠️ Only .pdf or .docx files are allowed.");
      setFileChosen(false);
      setFileName("");
    }
  };

  const handleEditClick = () => {
    if (!fileChosen) {
      alert("⚠️ Please choose a valid .pdf or .docx file before proceeding.");
      return;
    }

    navigate("/editor");
  };

  return (
    <div className="landing-page">
      <div className="landing-box">
        <h1>Welcome to Resume Editor</h1>
        <p className="tagline">Upload and enhance your resume with ease</p>

        <input
          id="hiddenFileInput"
          type="file"
          style={{ display: "none" }}
          onChange={handleFileChange}
          accept=".pdf,.docx"
        />

        <div className="button-group">
          <button onClick={handleChooseFile}>Choose File (.pdf or .docx)</button>
          <button onClick={handleEditClick}>Edit Resume</button>
        </div>

        {fileChosen && (
          <p className="file-selected-msg">
            ✅ You selected: <strong>{fileName}</strong>
          </p>
        )}

        {message && (
          <p
            style={{
              marginTop: "1rem",
              fontWeight: "bold",
              color: messageType === "success" ? "green" : "red",
              textAlign: "center"
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default LandingPage;
