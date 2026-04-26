from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from omnivoice import OmniVoice
import soundfile as sf
import uuid

app = FastAPI()

# Allow frontend access (important)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten later in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/static", StaticFiles(directory="static"), name="static")

model = OmniVoice.from_pretrained(
    "k2-fsa/OmniVoice",
    device_map="cuda:0"
)

class TTSRequest(BaseModel):
    text: str
    lang: str = "ha-NG"

@app.post("/tts")
async def tts(req: TTSRequest):
    filename = f"{uuid.uuid4().hex}.wav"
    path = f"static/{filename}"

    ref_audio = "hausa_ref.wav" if "ha" in req.lang else "english_ref.wav"

    audio = model.generate(
        text=req.text,
        ref_audio=ref_audio,
        ref_text="Sannu wannan misali ne na Hausa murya"
    )

    sf.write(path, audio[0], 24000)

    return {
        "audio_url": f"http://localhost:8000/static/{filename}"
    }