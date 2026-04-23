from pydantic import BaseModel

class PlantInput(BaseModel):
	image_url: str
