from fastapi import FastAPI
from app.core.cors import add_cors
from app.core.exceptions import global_exception_handler

from app.routes import crop, soil, plant, explain

app = FastAPI(title="AgroAI API", version="1.0.0")

# Health check route
@app.get("/health")
def health_check():
    return {"status": "ok"}

add_cors(app)
app.add_exception_handler(Exception, global_exception_handler)
app.include_router(crop.router)
app.include_router(soil.router)
app.include_router(plant.router)
app.include_router(explain.router)