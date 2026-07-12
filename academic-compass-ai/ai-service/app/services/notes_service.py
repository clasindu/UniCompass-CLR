import os
import json
import uuid
from pathlib import Path

from app.utils.pdf_extractor import extract_text, chunk_text
from app.services.gemini_client import generate_json
from app.prompts.notes_prompt import NOTES_SYSTEM_PROMPT, build_user_prompt

# File-based store: generated notes are saved as JSON so they survive restarts.
STORE_DIR = Path(__file__).resolve().parent.parent / "store"
STORE_DIR.mkdir(exist_ok=True)


def _store_path(document_id: str) -> Path:
    return STORE_DIR / f"{document_id}.json"


def process_pdf(file_name: str, pdf_bytes: bytes) -> dict:
    """
    Full pipeline: extract -> chunk -> (use leading chunks as context) -> Gemini -> validate -> save.
    Returns a dict with documentId, fileName, status, and assets (or error).
    """
    document_id = str(uuid.uuid4())

    text = extract_text(pdf_bytes)
    if not text.strip():
        result = {
            "documentId": document_id,
            "fileName": file_name,
            "status": "FAILED",
            "assets": None,
            "error": "No readable text found in this PDF (it may be a scanned image).",
        }
        _save(document_id, result)
        return result

    chunks = chunk_text(text)
    # Use the first several chunks as context to stay within a sensible prompt size.
    context = "\n\n".join(chunks[:6])

    try:
        data = generate_json(NOTES_SYSTEM_PROMPT, build_user_prompt(context))
        assets = _normalize_assets(data)
        result = {
            "documentId": document_id,
            "fileName": file_name,
            "status": "COMPLETE",
            "assets": assets,
            "error": None,
        }
    except Exception as e:  # noqa: BLE001
        result = {
            "documentId": document_id,
            "fileName": file_name,
            "status": "FAILED",
            "assets": None,
            "error": f"AI generation failed: {e}",
        }

    _save(document_id, result)
    return result


def get_notes(document_id: str) -> dict | None:
    path = _store_path(document_id)
    if not path.exists():
        return None
    return json.loads(path.read_text(encoding="utf-8"))


def list_notes() -> list[dict]:
    items = []
    for p in sorted(STORE_DIR.glob("*.json")):
        try:
            d = json.loads(p.read_text(encoding="utf-8"))
            items.append({
                "documentId": d.get("documentId"),
                "fileName": d.get("fileName"),
                "status": d.get("status"),
            })
        except Exception:  # noqa: BLE001
            continue
    return items


def _save(document_id: str, result: dict) -> None:
    _store_path(document_id).write_text(
        json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8"
    )


def _normalize_assets(data: dict) -> dict:
    """Defensively coerce the LLM JSON into our expected shape."""
    summary = str(data.get("summary", "")).strip()

    flashcards = []
    for fc in data.get("flashcards", []) or []:
        q = str(fc.get("question", "")).strip()
        a = str(fc.get("answer", "")).strip()
        if q and a:
            flashcards.append({"question": q, "answer": a})

    mcqs = []
    for m in data.get("mcqs", []) or []:
        q = str(m.get("question", "")).strip()
        opts = []
        for o in m.get("options", []) or []:
            t = str(o.get("text", "")).strip()
            c = bool(o.get("correct", False))
            if t:
                opts.append({"text": t, "correct": c})
        if q and len(opts) >= 2:
            mcqs.append({
                "question": q,
                "options": opts,
                "explanation": str(m.get("explanation", "")).strip(),
            })

    return {"summary": summary, "flashcards": flashcards, "mcqs": mcqs}
