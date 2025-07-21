from client import graphiti
from schemas import Area, Event, Source, HappenedAt, ReportedBy, Nearby
from graphiti_core.utils.bulk_utils import RawEpisode
from uuid import uuid4
from datetime import datetime

import asyncio

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

group_id = str(uuid4())


async def update_episode(ep_body: str, ep_name:str = "City Update", source_description: str = "Power updates") -> None:
    await graphiti.build_indices_and_constraints()
    print("adding episode")
    try:
        await graphiti.add_episode(
            name=ep_name,
            episode_body=ep_body,
            source_description= source_description,
            reference_time=datetime.now(),
            entity_types=entity_types,
            edge_types=edge_types,
            edge_type_map=edge_type_map
        )
    except Exception as e:
        print(f"Error adding episode: {e}")
