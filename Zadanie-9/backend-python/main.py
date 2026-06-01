import random
import re
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

OPENINGS = [
    "Hi there! How can I help you with your shopping today?",
    "Welcome to our store! Are you looking for something specific, or just browsing?",
    "Good day! I'm your virtual shop assistant. How can I make your shopping easier?",
    "Hey! Do you have any questions about our products or your order? I'd be happy to help.",
    "Welcome! If you need any help picking the right items, just let me know."
]

SYSTEM_PROMPT = """You are a polite and helpful online store assistant. Respond VERY concisely, in maximum 2-3 SHORT sentences, strictly in English.

CRITICAL RULE FOR REASONING:
You MUST put all your internal reasoning, analysis, step-by-step thinking, and "thinking out loud" process inside explicit <think> and </think> tags.
Example: <think>The user said hello, I should greet them back.</think> Hi there!
The final response intended for the customer MUST be placed outside and AFTER the closing </think> tag. NEVER EVER output any reasoning outside of these tags. ONLY THE FINAL RESPONSE IS TO BE OUTSIDE OF <think></think> TAGS!

THE YOU RULE:
NEVER refer to the user as "user". Use "You" if you must.

CONVERSATION PROLONGING RULE:
Unless the CONVERSATION CLOSING RULE is triggered, you MUST always follow up your answer with a helpful question or a proactive suggestion to keep the conversation engaging and guide the customer (e.g., "Would you like to check available sizes?", "Do you need help with anything else?", "Are you looking for a specific brand?"). This follow-up must fit within your 2-3 sentence limit.

CRITICAL CONVERSATION CLOSING RULE:
ONLY WHEN the user says goodbye (e.g., "Goodbye", "Bye"), thanks you for your help (e.g., "Thanks, that's all", "Thank you for your help"), or explicitly signals the end of the conversation, your task is to end the chat. The CRITICAL RULE FOR REASONING also applies here. In this case, you MUST choose and use EXACTLY one of the closing phrases listed below and DO NOT add any other text or commentary:

1. "Thank you for chatting! I'm here if you have any more questions."
2. "Happy shopping! If you need me again, just drop a message."
3. "I hope I was helpful. Have a great day and enjoy your shopping!"
4. "Thanks for reaching out! Remember, you can jump back into this chat anytime."
5. "All clear? Awesome!!! I'll leave you to your shopping."
"""

@app.get("/api/welcome")
async def get_welcome():
    random_opening = random.choice(OPENINGS)
    return {"reply": random_opening}

@app.post("/api/chat")
async def chat_with_ollama(request: ChatRequest):
    try:
        response = ollama.chat(model='smallthinker', messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": request.message}
        ])
        raw_reply = response['message']['content']
        
        # cut out smallthinkers reasoning
        not_thinking_reply = re.sub(r'<think>.*?</think>', '', raw_reply, flags=re.DOTALL).strip()
        clean_reply = re.sub(r'<.*?>', '', not_thinking_reply, flags=re.DOTALL).strip()
        
        # fallback if cutting all
        final_reply = clean_reply if clean_reply else not_thinking_reply.strip()
        
        return {"reply": final_reply}

    except Exception as e:
        return {"reply": f"Error: {str(e)}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)