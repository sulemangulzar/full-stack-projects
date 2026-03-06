from fastapi import FastAPI
from database.session import engine
from models import note
from routers import notes

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production, but convenient for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
note.Base.metadata.create_all(bind=engine)

app.include_router(notes.router)