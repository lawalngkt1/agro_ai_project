from fastapi import FastAPI
from pydantic import BaseModel
from omnivoice import OmniVoice
import soundfile as sf
import torch
import uuid
import os

app = FastAPI()

# Load model once (important)
model = OmniVoice.from_pretrained(
    "k2-fsa/OmniVoice",
    device_map="cuda:0" if torch.cuda.is_available() else "cpu",
    dtype=torch.float16 if torch.cuda.is_available() else torch.float32
)

class TTSRequest(BaseModel):
    text: str
    lang: str = "ha"  # Hausa

@app.post("/tts")
async def generate_tts(req: TTSRequest):
    filename = f"audio_{uuid.uuid4().hex}.wav"
    path = f"static/{filename}"

    # IMPORTANT: Hausa reference audio
    audio = model.generate(
    text=req.text,
    ref_audio="hausa_ref.wav" if req.lang.startswith("ha") else "english_ref.wav",
    ref_text="Sannu wannan murya ce ta Hausa." if req.lang.startswith("ha") else "This is an English voice sample."
)

    sf.write(path, audio[0], 24000)

    return {
        "audio_url": f"/static/{filename}"
    }