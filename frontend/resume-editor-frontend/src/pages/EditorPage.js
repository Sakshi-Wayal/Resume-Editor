import React, { useState, useEffect } from 'react';

import axios from 'axios';
import '../App.css';


function EditorPage() {
  const [resume, setResume] = useState(null);
  const [currentSection, setCurrentSection] = useState("name");
const sections = ["header", "summary", "experience", "education", "skills"];

const handleNext = () => {
  const currentIndex = sections.indexOf(currentSection);
  if (currentIndex < sections.length - 1) {
    setCurrentSection(sections[currentIndex + 1]);
  }
};

const handleBack = () => {
  const currentIndex = sections.indexOf(currentSection);
  if (currentIndex > 0) {
    setCurrentSection(sections[currentIndex - 1]);
  }
};

  useEffect(() => {
  const savedData = localStorage.getItem("resumeData");
  if (savedData) {
    setResume(JSON.parse(savedData));
  }
}, []);

  const handleUpload = (parsedData) => {
  if (!parsedData.header) {
    const addHeader = window.confirm("Your resume doesn't contain personal details. Do you want to add them?");
    if (addHeader) {
      parsedData.header = {
        firstName: "",
        surname: "",
        city: "",
        country: "",
        pinCode: "",
        phone: "",
        email: ""
      };
    }
  }

  // If you're mocking resume content manually (PDF parsing not set up):
  if (!parsedData.name) {
    parsedData.name = "Your Name";
    parsedData.summary = "Brief summary here...";
    parsedData.experience = ["Intern at Company A"];
    parsedData.education = ["B.Tech in CSE"];
    parsedData.skills = ["React", "JavaScript"];
  }

  setResume(parsedData);
};



  const enhanceSection = async (sectionName, content) => {
    try {
      const res = await axios.post("http://localhost:8000/ai-enhance", {
        section: sectionName,
        content,
      });

      let improved = res.data.improved_content;
      if (["experience", "education", "skills"].includes(sectionName)) {
        improved = improved.split('\n').filter(line => line.trim() !== '');
      }

      setResume({ ...resume, [sectionName]: improved });
    } catch (err) {
      console.error("Enhancement failed:", err);
      alert("Something went wrong.");
    }
  };

  const handleSave = async () => {
    try {
      await axios.post("http://localhost:8000/save-resume", resume);
      alert("Resume saved successfully!");
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save resume.");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(resume, null, 2)], {
      type: 'application/json',
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'resume.json';
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="app-wrapper">
      <div className="app-flex">
        <aside className="sidebar stepper-sidebar">
  <h3>Sections</h3>
  <div className="stepper">
    {sections.map((sec, index) => (
      <div
        key={sec}
        className={`step ${currentSection === sec ? 'active' : ''}`}
        onClick={() => {
          if (!resume) {
            alert("⚠️ Please upload a resume file first.");
          } else {
            setCurrentSection(sec);
          }
        }}
      >
        <div className="circle">{index + 1}</div>
        <span className="label">{sec.charAt(0).toUpperCase() + sec.slice(1)}</span>
        {index < sections.length - 1 && <div className="line" />}
      </div>
    ))}
  </div>
</aside>


        <main className="editor-area">
          <div className="container">
            <h1 className="resume-title">Resume Editor</h1>


            {resume && (
  <>
    {currentSection === "header" && (
  <div className="section-card">
  <h3>Personal Details</h3>

  <div className="input-row">
    <div className="input-group">
      <label>First Name</label>
      <input
        type="text"
        value={resume.header?.firstName || ""}
        onChange={(e) =>
          setResume({ ...resume, header: { ...resume.header, firstName: e.target.value } })
        }
      />
    </div>

    <div className="input-group">
      <label>Surname</label>
      <input
        type="text"
        value={resume.header?.surname || ""}
        onChange={(e) =>
          setResume({ ...resume, header: { ...resume.header, surname: e.target.value } })
        }
      />
    </div>
  </div>

  <div className="input-row">
    <div className="input-group">
      <label>City</label>
      <input
        type="text"
        value={resume.header?.city || ""}
        onChange={(e) =>
          setResume({ ...resume, header: { ...resume.header, city: e.target.value } })
        }
      />
    </div>

    <div className="input-group small-input">
  <label>Country</label>
  <input
    type="text"
    value={resume.header?.country || ""}
    onChange={(e) =>
      setResume({ ...resume, header: { ...resume.header, country: e.target.value } })
    }
  />
</div>

<div className="input-group small-input">
  <label>Pin Code</label>
  <input
    type="text"
    value={resume.header?.pinCode || ""}
    onChange={(e) =>
      setResume({ ...resume, header: { ...resume.header, pinCode: e.target.value } })
    }
  />
</div>

  </div>

  <div className="input-row">
    <div className="input-group">
      <label>Phone</label>
      <input
        type="text"
        value={resume.header?.phone || ""}
        onChange={(e) =>
          setResume({ ...resume, header: { ...resume.header, phone: e.target.value } })
        }
      />
    </div>

    <div className="input-group">
      <label>Email</label>
      <input
        type="email"
        value={resume.header?.email || ""}
        onChange={(e) =>
          setResume({ ...resume, header: { ...resume.header, email: e.target.value } })
        }
      />
    </div>
  </div>

  <div className="next-button-fixed">
  <button onClick={handleNext}>➡️ Next</button>
</div>
</div>
)}


    {currentSection === "summary" && (
  <div className="section-card">
    <h3>Summary</h3>
    <textarea
      value={resume.summary}
      onChange={(e) => setResume({ ...resume, summary: e.target.value })}
    />

    <div className="button-group">
      <button onClick={() => enhanceSection("summary", resume.summary)}>
        ✨ Enhance Summary
      </button>
    </div>

    <div className="button-group">
      {currentSection !== "name" && (
        <button onClick={handleBack}>⬅️ Back</button>
      )}
      <button onClick={handleNext}>➡️ Next</button>
    </div>
  </div>
)}


    {currentSection === "experience" && (
  <div className="section-card">
    <h3>Experience</h3>
    {resume.experience.map((exp, i) => (
      <input
        key={i}
        type="text"
        value={exp}
        onChange={(e) => {
          const updated = [...resume.experience];
          updated[i] = e.target.value;
          setResume({ ...resume, experience: updated });
        }}
      />
    ))}

    <div className="button-group">
      <button
        onClick={() =>
          enhanceSection("experience", resume.experience.join("\n"))
        }
      >
        ✨ Enhance Experience
      </button>
      <button
        onClick={() => {
          const updated = [...resume.experience, ""];
          setResume({ ...resume, experience: updated });
        }}
      >
        ➕ Add Experience
      </button>
    </div>

    <div className="button-group">
      {currentSection !== "name" && (
        <button onClick={handleBack}>⬅️ Back</button>
      )}
      <button onClick={handleNext}>➡️ Next</button>
    </div>
  </div>
)}


    {currentSection === "education" && (
  <div className="section-card">
    <h3>Education</h3>
    {resume.education.map((edu, i) => (
      <input
        key={i}
        type="text"
        value={edu}
        onChange={(e) => {
          const updated = [...resume.education];
          updated[i] = e.target.value;
          setResume({ ...resume, education: updated });
        }}
      />
    ))}

    <div className="button-group">
      <button
        onClick={() =>
          enhanceSection("education", resume.education.join("\n"))
        }
      >
        ✨ Enhance Education
      </button>
      <button
        onClick={() => {
          const updated = [...resume.education, ""];
          setResume({ ...resume, education: updated });
        }}
      >
        ➕ Add Education
      </button>
    </div>

    <div className="button-group">
      {currentSection !== "name" && (
        <button onClick={handleBack}>⬅️ Back</button>
      )}
      <button onClick={handleNext}>➡️ Next</button>
    </div>
  </div>
)}


    {currentSection === "skills" && (
  <div className="section-card">
    <h3>Skills</h3>
    {resume.skills.map((skill, i) => (
      <input
        key={i}
        type="text"
        value={skill}
        onChange={(e) => {
          const updated = [...resume.skills];
          updated[i] = e.target.value;
          setResume({ ...resume, skills: updated });
        }}
      />
    ))}

    {/* Enhance + Add buttons in a row */}
    <div className="button-group">
      <button
        onClick={() =>
          enhanceSection("skills", resume.skills.join(", "))
        }
      >
        ✨ Enhance Skills
      </button>

      <button
        onClick={() => {
          const updated = [...resume.skills, ""];
          setResume({ ...resume, skills: updated });
        }}
      >
        ➕ Add Skill
      </button>
    </div>

    {/* Back / Save / Download buttons */}
    <div className="button-group">
      {currentSection !== "name" && (
        <button onClick={handleBack}>⬅️ Back</button>
      )}
      <button onClick={handleSave}>💾 Save</button>
      <button onClick={handleDownload}>⬇️ Download</button>
    </div>
  </div>
)}

  </>
)}


          </div>
        </main>
      </div>
    </div>
  );
}

export default EditorPage;
