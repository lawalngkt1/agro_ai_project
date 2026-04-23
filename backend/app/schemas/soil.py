from pydantic import BaseModel

class SoilInput(BaseModel):
    N: float
    P: float
    K: float
    ph: float
    moisture: float