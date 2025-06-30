from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import docx
from PyPDF2 import PdfReader
import re

app = FastAPI()

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from io import BytesIO

async def extract_text_from_file(file: UploadFile):
    content = ""
    if file.filename.endswith(".pdf"):
        bytes_data = await file.read()
        reader = PdfReader(BytesIO(bytes_data))
        for page in reader.pages:
            content += page.extract_text() or ""
    elif file.filename.endswith(".docx"):
        bytes_data = await file.read()
        doc = docx.Document(BytesIO(bytes_data))
        content = "\n".join([p.text for p in doc.paragraphs])
    return content



def extract_section(content: str, heading_keywords: list):
    lines = content.splitlines()
    extracted = []
    capture = False
    for line in lines:
        line_lower = line.lower().strip()
        if any(h in line_lower for h in heading_keywords):
            capture = True
            continue
        elif capture and line.strip() == "":
            break
        elif capture:
            extracted.append(line.strip())
    return "\n".join(extracted).strip()


@app.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    content = await extract_text_from_file(file)


    # Header info
    email = re.findall(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", content)
    phone = re.findall(r"\b[789]\d{9}\b", content)
    name = content.split('\n')[0] if content else "Unknown"

    # Sections
    summary = extract_section(content, ["summary", "objective"])
    experience_raw = extract_section(content, ["experience", "work experience"])
    skills_raw = extract_section(content, ["skills", "technical skills"])

    # Parse skills into list
    skills_list = []
    if skills_raw:
        for item in re.split(r",|\n", skills_raw):
            cleaned = item.strip()
            if cleaned:
                skills_list.append({"name": cleaned, "level": ""})

    parsed_data = {
        "header": {
            "firstName": name.split()[0] if name else "",
            "surname": name.split()[1] if len(name.split()) > 1 else "",
            "email": email[0] if email else "",
            "phone": phone[0] if phone else "",
            "city": "",
            "country": "",
            "pinCode": ""
        },
        "summary": summary,
        "experience": [{"jobTitle": experience_raw[:100]}] if experience_raw else [],
        "education": [],
        "skills": skills_list
        
    }
    print("Parsed content:", parsed_data)

    return parsed_data
@app.post("/ai-enhance")
async def ai_enhance(payload: dict):
    section = payload.get("section")
    content = payload.get("content")

    # Simple mocked improvement logic
    improved = f"(AI Enhanced) {content.strip().capitalize()}"

    return {"improved_content": improved}
@app.post("/save-resume")
async def save_resume(payload: dict):
    with open("saved_resume.json", "w", encoding="utf-8") as f:
        import json
        json.dump(payload, f, ensure_ascii=False, indent=2)

    return {"message": "Resume saved successfully"}
