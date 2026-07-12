import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

from app.routers.notes_router import router as notes_router  # noqa: E402
from app.routers.advisor_router import router as advisor_router  # noqa: E402

app = FastAPI(title="Academic Compass AI Service")

origins = os.getenv("CORS_ALLOWED_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(notes_router)
app.include_router(advisor_router)


@app.get("/health")
def health():
    return {"status": "ok"}
