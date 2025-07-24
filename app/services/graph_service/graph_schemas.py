from pydantic import BaseModel, Field

class Area(BaseModel):
    area_name: str = Field(..., description="Name of the area")
    lat: float = Field(..., description="Latitude of the area")
    lon: float = Field(..., description="Longitude of the area")

class Event(BaseModel):
    event_type: str = Field(..., description="Type of the event")
    description: str
    severity: str | None = None

class Source(BaseModel):
    source_name: str

# === Define Custom Edge Schemas === #
class HappenedAt(BaseModel):
    """Connects Event -> Area"""
    edge_name: str = Field(default="happened_at", description="Edge name connecting Event to Area")

class ReportedBy(BaseModel):
    """Connects Event -> Source"""
    edge_name: str = Field(default="reported_by", description="Edge name connecting Event to Source")

class Nearby(BaseModel):
    distance_km: float | None = None  # Optional
    """Connects Area -> Area"""
from pydantic import BaseModel, Field

class Area(BaseModel):
    area_name: str = Field(..., description="Name of the area")
    lat: float = Field(..., description="Latitude of the area")
    lon: float = Field(..., description="Longitude of the area")

class Event(BaseModel):
    event_type: str = Field(..., description="Type of the event")
    description: str
    severity: str | None = None

class Source(BaseModel):
    source_name: str

# === Define Custom Edge Schemas === #
class HappenedAt(BaseModel):
    """Connects Event -> Area"""
    edge_name: str = Field(default="happened_at", description="Edge name connecting Event to Area")

class ReportedBy(BaseModel):
    """Connects Event -> Source"""
    edge_name: str = Field(default="reported_by", description="Edge name connecting Event to Source")

class Nearby(BaseModel):
    distance_km: float | None = None  # Optional
    """Connects Area -> Area"""


entity_types = {
        "Event": Event,
        "Area": Area,
        "Source": Source
    }

edge_types = {
        "HAPPENED_AT": HappenedAt,
        "REPORTED_BY": ReportedBy,
        "NEARBY": Nearby
    }

edge_type_map = {
        ("Event", "Area"): ["HAPPENED_AT"],
        ("Event", "Source"): ["REPORTED_BY"],
        ("Area", "Area"): ["NEARBY"]
    }
