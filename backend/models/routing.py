from pydantic import BaseModel, field_validator

class Coordinates(BaseModel):
    latitude: float
    longitude: float

    @field_validator('latitude')
    @classmethod
    def validate_latitude(cls, value: float) -> float:
        if not -90 <= value <= 90:
            raise ValueError('Latitude must be between -90 and 90 degrees')
        return value

    @field_validator('longitude')
    @classmethod
    def validate_longitude(cls, value: float) -> float:
        if not -180 <= value <= 180:
            raise ValueError('Longitude must be between -180 and 180 degrees')
        return value