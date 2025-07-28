import React, { useState } from 'react';

function UploadSection({ onUpload }) {
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.name.endsWith('.pdf') || file.name.endsWith('.docx'))) {
      setFileName(file.name);

      // Mocked parsed content from resume file
      const dummyResume = {
        name: "Your Name",
        summary: "Enthusiastic developer with internship experience.",
        experience: ["Company A - Intern", "Company B - Volunteer"],
        education: ["B.Tech in CSE - 2025"],
        skills: ["React", "Python", "Git"]
      };

      onUpload(dummyResume);  // send it to parent
    } else {
      alert('Please upload a .pdf or .docx file');
    }
  };

  return (
    <div style={{ marginBottom: '2rem' }}>
      <label>
        <strong>Select Resume File (.pdf or .docx):</strong>
        <input type="file" accept=".pdf,.docx" onChange={handleFileChange} />
      </label>
      {fileName && <p>Uploaded: {fileName}</p>}
    </div>
  );
}

export default UploadSection;
