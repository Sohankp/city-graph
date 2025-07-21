import logging
from importlib import import_module
from pathlib import Path
from fastapi import APIRouter, FastAPI

def include_routers(router: APIRouter, scandir: str):
    """
    Dynamically include a router from the app/api/v1/routers directory.
    """
    try:
        found_routers: bool = False
        for found in Path(scandir).rglob("*routes*.py"):
            module_name = ".".join(found.parts).rstrip(".py")
            module = import_module(module_name)
            if hasattr(module, "router"):
                router_name = module_name.split(".")[-1]
                router.include_router(module.router)
                found_routers = True
                logging.info(f"Included router: {router_name}")
        if found_routers:
            logging.info(f"Included router: {router_name}")

    except (ModuleNotFoundError, AttributeError) as e:
        logging.error(f"Failed to include router '{router_name}': {e}")


def plugin_routers(app: FastAPI):
    """
    Plugin routers to the FastAPI application.
    """
    router = APIRouter(prefix="/api/v1")
    scandir = "app/api/v1"
    include_routers(router, scandir)
    if router.routes:
        app.include_router(router)
        logging.info("Routers successfully included in the FastAPI application.")
    else:
        logging.warning("No routers found to include in the FastAPI application.")