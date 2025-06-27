import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  const [fileChosen, setFileChosen] = React.useState(false);
const [fileName, setFileName] = React.useState("");
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  const handleChooseFile = () => {
    document.getElementById("hiddenFileInput").click();
  };

  const handleFileChange = (e) => {
const file = e.target.files[0];
if (file && /.(pdf|docx)$/i.test(file.name)) {
setFileChosen(true);
setFileName(file.name); 
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

  
  const mockResume = {
    name: "Your Name",
    summary: "Enthusiastic developer with internship experience. (Enhanced by AI)",
    experience: [
      "Company A - Intern",
      "Company B - Volunteer (Enhanced by AI)"
    ],
    education: [
      "B.Tech in CSE - 2025"
    ],
    skills: [
      "React, Python, Git (Enhanced by AI)"
    ]
  };

  localStorage.setItem("resumeData", JSON.stringify(mockResume));

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

<p className="file-selected-msg"> ✅ You selected: <strong>{fileName}</strong> </p> )}
        
        {message && (
          <p
            style={{
              marginTop: "1rem",
              fontWeight: "bold",
              color: messageType === "success" ? "green" : "red",
              textAlign: "center",
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
