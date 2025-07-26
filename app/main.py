from fastapi import FastAPI
from fastapi.concurrency import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from app.core.config.app_config import app_config
from app.services.google_agent import ingestion_pipeline
from app.core.config.router_config import plugin_routers

scheduler = AsyncIOScheduler()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Code to run on startup
    print("Starting up the City Graph API...")
    scheduler.add_job(ingestion_pipeline, CronTrigger(minute=3))  # every hour at minute 0
    # scheduler.start()
    yield
    # Code to run on shutdown
    # scheduler.shutdown(wait=False)
    print("Shutting down the City Graph API...")


app = FastAPI(
    title="City Graph API",
    docs_url="/docs",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

plugin_routers(app)

@app.get("/")
async def root():
    return {"message": "Welcome to the City Graph API"} 