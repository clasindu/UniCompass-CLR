from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Any

from app.services.advisor_service import academic_advice, career_roadmap, study_timetable

router = APIRouter(prefix="/ai", tags=["advisor"])


class AdvicePayload(BaseModel):
    data: dict[str, Any]


@router.post("/academic-advice")
def academic_advice_endpoint(payload: AdvicePayload):
    try:
        return academic_advice(payload.data)
    except Exception as e:  # noqa: BLE001
        raise HTTPException(status_code=502, detail=f"AI generation failed: {e}")


@router.post("/career-roadmap")
def career_roadmap_endpoint(payload: AdvicePayload):
    try:
        return career_roadmap(payload.data)
    except Exception as e:  # noqa: BLE001
        raise HTTPException(status_code=502, detail=f"AI generation failed: {e}")


@router.post("/timetable")
def timetable_endpoint(payload: AdvicePayload):
    try:
        return study_timetable(payload.data)
    except Exception as e:  # noqa: BLE001
        raise HTTPException(status_code=502, detail=f"AI generation failed: {e}")
