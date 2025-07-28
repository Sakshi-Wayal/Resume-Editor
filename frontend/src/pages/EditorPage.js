import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

function EditorPage() {
  const [resume, setResume] = useState(null);
  const [currentSection, setCurrentSection] = useState("header");

  const sections = ["header", "summary", "experience", "education", "skills"];

  const updateExperience = (field, value) => {
    const updatedExp = [...resume.experience];
    if (!updatedExp[0]) updatedExp[0] = {};
    updatedExp[0][field] = value;
    setResume({ ...resume, experience: updatedExp });
  };

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

  if (!parsedData.skills || !Array.isArray(parsedData.skills)) {
    parsedData.skills = [{ name: "", level: "" }];
  }

  // Initialize dummy data if needed
  if (!parsedData.name) {
    parsedData.name = "Your Name";
    parsedData.summary = "Brief summary here...";
    parsedData.experience = [{ jobTitle: "", employer: "" }];
    parsedData.education = [];
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
                {/* HEADER */}
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
                      <div className="input-group">
                        <label>Country</label>
                        <input
                          type="text"
                          value={resume.header?.country || ""}
                          onChange={(e) =>
                            setResume({ ...resume, header: { ...resume.header, country: e.target.value } })
                          }
                        />
                      </div>
                      <div className="input-group">
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

                {/* SUMMARY */}
                {currentSection === "summary" && (
                  <div className="section-card">
                    <h3>Summary</h3>
                    <textarea
                      className="summary-textarea"
                      value={resume.summary}
                      onChange={(e) => setResume({ ...resume, summary: e.target.value })}
                    />
                    <div className="button-group">
                      <button onClick={() => enhanceSection("summary", resume.summary)}>✨ Enhance by AI</button>
                    </div>
                    <div className="navigation-buttons">
                      <button className="back-btn" onClick={handleBack}>⬅️ Back</button>
                      <button className="next-btn" onClick={handleNext}>➡️ Next</button>
                    </div>
                  </div>
                )}

                {/* EXPERIENCE */}
                {currentSection === "experience" && (
                  <div className="section-card">
                    <h3>Work Experience</h3>
                    <div className="input-row">
                      <div className="input-group" style={{ flex: "0 0 48%" }}>
                        <label>Job Title</label>
                        <input
                          type="text"
                          value={resume.experience?.[0]?.jobTitle || ""}
                          onChange={(e) => updateExperience("jobTitle", e.target.value)}
                        />
                      </div>
                      <div className="input-group" style={{ flex: "0 0 48%" }}>
                        <label>Employer</label>
                        <input
                          type="text"
                          value={resume.experience?.[0]?.employer || ""}
                          onChange={(e) => updateExperience("employer", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="input-row">
                      <div className="input-group" style={{ flex: "0 0 48%" }}>
                        <label>City</label>
                        <input
                          type="text"
                          value={resume.experience?.[0]?.city || ""}
                          onChange={(e) => updateExperience("city", e.target.value)}
                        />
                      </div>
                      <div className="input-group" style={{ flex: "0 0 48%" }}>
                        <label>Country</label>
                        <input
                          type="text"
                          value={resume.experience?.[0]?.country || ""}
                          onChange={(e) => updateExperience("country", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="input-row">
                      <div className="input-group" style={{ flex: "0 0 48%" }}>
                        <label>Start Date</label>
                        <input
                          type="month"
                          value={resume.experience?.[0]?.startDate || ""}
                          onChange={(e) => updateExperience("startDate", e.target.value)}
                        />
                      </div>
                      <div className="input-group" style={{ flex: "0 0 48%" }}>
                        <label>End Date</label>
                        <input
                          type="month"
                          value={resume.experience?.[0]?.endDate || ""}
                          onChange={(e) => updateExperience("endDate", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="checkbox-row">
                      <input
                        type="checkbox"
                        checked={resume.experience?.[0]?.current || false}
                        onChange={(e) => updateExperience("current", e.target.checked)}
                      />
                      <label>I currently work here</label>
                    </div>

                    <div className="button-nav-row">
                      <button onClick={handleBack}>⬅️ Back</button>
                      <button onClick={handleNext}>➡️ Next</button>
                    </div>
                  </div>
                )}

                {currentSection === "education" && (
  <div className="section-card">
    <h3>Update your education</h3>

    <div className="input-row">
      <div className="input-group" style={{ flex: "0 0 48%" }}>
        <label>School Name</label>
        <input
          type="text"
          value={resume.education?.[0]?.school || ""}
          onChange={(e) => {
            const updated = [...resume.education];
            if (!updated[0]) updated[0] = {};
            updated[0].school = e.target.value;
            setResume({ ...resume, education: updated });
          }}
        />
      </div>
      <div className="input-group" style={{ flex: "0 0 48%" }}>
        <label>School Location</label>
        <input
          type="text"
          value={resume.education?.[0]?.location || ""}
          onChange={(e) => {
            const updated = [...resume.education];
            if (!updated[0]) updated[0] = {};
            updated[0].location = e.target.value;
            setResume({ ...resume, education: updated });
          }}
        />
      </div>
    </div>

    <div className="input-row">
      <div className="input-group" style={{ flex: "0 0 48%" }}>
        <label>College Name</label>
        <input
          type="text"
          value={resume.education?.[0]?.college || ""}
          onChange={(e) => {
            const updated = [...resume.education];
            if (!updated[0]) updated[0] = {};
            updated[0].college = e.target.value;
            setResume({ ...resume, education: updated });
          }}
        />
      </div>
      <div className="input-group" style={{ flex: "0 0 48%" }}>
        <label>Degree</label>
        <input
          type="text"
          value={resume.education?.[0]?.degree || ""}
          onChange={(e) => {
            const updated = [...resume.education];
            if (!updated[0]) updated[0] = {};
            updated[0].degree = e.target.value;
            setResume({ ...resume, education: updated });
          }}
        />
      </div>
    </div>

    <div className="input-row">
      <div className="input-group" style={{ flex: "0 0 48%" }}>
        <label>Field of Study</label>
        <input
          type="text"
          value={resume.education?.[0]?.field || ""}
          onChange={(e) => {
            const updated = [...resume.education];
            if (!updated[0]) updated[0] = {};
            updated[0].field = e.target.value;
            setResume({ ...resume, education: updated });
          }}
        />
      </div>
      <div className="input-group" style={{ flex: "0 0 48%" }}>
        <label>Graduation Date</label>
        <input
          type="month"
          value={resume.education?.[0]?.gradDate || ""}
          onChange={(e) => {
            const updated = [...resume.education];
            if (!updated[0]) updated[0] = {};
            updated[0].gradDate = e.target.value;
            setResume({ ...resume, education: updated });
          }}
        />
      </div>
    </div>

    <div className="button-nav-row">
      <button onClick={handleBack}>⬅️ Back</button>
      <button onClick={handleNext}>➡️ Next</button>
    </div>
  </div>
)}
{currentSection === "skills" && (
  <div className="section-card">
    <h3>Skills</h3>

    {resume.skills?.map((skill, index) => (
      <div className="input-row" key={index}>
        <div className="input-group">
          <label>Skill Name</label>
          <input
            type="text"
            value={skill.name}
            onChange={(e) => {
              const updated = [...resume.skills];
              updated[index].name = e.target.value;
              setResume({ ...resume, skills: updated });
            }}
          />
        </div>
        <div className="input-group">
          <label>Proficiency Level</label>
          <select
            value={skill.level}
            onChange={(e) => {
              const updated = [...resume.skills];
              updated[index].level = e.target.value;
              setResume({ ...resume, skills: updated });
            }}
          >
            <option value="">Select</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>
    ))}

    {/* ➕ Add Skill - slightly upper */}
    <div style={{ marginTop: "1.5rem" }}>
      <button
        className="btn purple"
        onClick={() => {
          const updated = [...resume.skills, { name: "", level: "" }];
          setResume({ ...resume, skills: updated });
        }}
      >
        ➕ Add Skill
      </button>
    </div>

    {/* ⬇️ Bottom Navigation Buttons */}
    <div className="button-nav-row big-button-row">
  <button className="big-btn" onClick={handleBack}>⬅️ Back</button>
  <button className="big-btn" onClick={handleSave}>💾 Save</button>
  <button className="big-btn" onClick={handleDownload}>📥 Download</button>
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
