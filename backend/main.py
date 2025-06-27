from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class EnhanceRequest(BaseModel):
    section: str
    content: str

@app.post("/ai-enhance")
def ai_enhance(req: EnhanceRequest):
    improved = f"{req.content} (Enhanced by AI)"
    return {"improved_content": improved}


@app.post("/save-resume")
async def save_resume(request: Request):
    data = await request.json()
    with open("saved_resume.json", "w") as f:
        json.dump(data, f, indent=2)
    return {"message": "Resume saved successfully"}
