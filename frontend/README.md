# Resume-Editor
Web-based Resume Editor with React and Fast API
# 📝 Resume Editor Web App

This is a web-based Resume Editor built using **React.js (Frontend)** and **FastAPI (Backend)** as part of an internship assignment.

It allows users to:
- Upload and auto-parse their resume (`.pdf` or `.docx`)
- Edit each resume section one-by-one (Header, Summary, Experience, Education, Skills)
- Enhance content using AI suggestions
- Save and Download the resume data (`.json` format)

---

## 🚀 Features

✅ Upload resume (.pdf/.docx)  
✅ Extract content and pre-fill fields  
✅ Section-wise editing with Next/Back navigation  
✅ Enhance sections with AI (mock FastAPI backend)  
✅ Add multiple skills or entries dynamically  
✅ Save resume data  
✅ Download resume as `.json`  

---

## 📂 Project Structure

Resume-Editor/
├── backend/ # FastAPI server
│ ├── main.py # API routes for upload, enhance, save
│ └── temp.pdf # Temporary uploaded resume file
├── frontend/
│ └── resume-editor-frontend/
│ ├── src/
│ │ ├── App.js
│ │ ├── App.css
│ │ └── pages/
│ │ ├── LandingPage.js
│ │ └── EditorPage.js
├── README.md


---

## 🛠️ Technologies

- Frontend: React.js, HTML, CSS, JavaScript
- Backend: FastAPI (Python)
- Axios (for HTTP requests)

---

## 📦 How to Run

### 1️⃣ Backend (FastAPI)
```bash
cd backend
pip install fastapi uvicorn python-multipart
uvicorn main:app --reload

2.Frontend React :

cd frontend
npm install
npm start

