from fastapi import APIRouter, UploadFile, File, HTTPException

from app.services.notes_service import process_pdf, get_notes, list_notes

router = APIRouter(prefix="/ai", tags=["ai"])

MAX_BYTES = 20 * 1024 * 1024  # 20 MB


@router.post("/notes/upload")
async def upload(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    data = await file.read()
    if len(data) > MAX_BYTES:
        raise HTTPException(status_code=400, detail="File too large (max 20 MB).")
    if len(data) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    result = process_pdf(file.filename, data)
    return result


@router.get("/notes/{document_id}")
async def fetch(document_id: str):
    result = get_notes(document_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Notes not found.")
    return result


@router.get("/notes")
async def all_notes():
    return list_notes()
