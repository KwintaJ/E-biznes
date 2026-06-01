from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import ollama

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

@app.post("/api/chat")
async def chat_with_ollama(request: ChatRequest):
    try:
        response = ollama.chat(model='smallthinker', messages=[
            {"role": "system", "content": "You are an assistant in a e-commerce shop."},
            {"role": "user", "content": request.message}
        ])
        return {"reply": response['message']['content']}
    except Exception as e:
        return {"reply": f"Error: {str(e)}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)