import json

from app.services.gemini_client import generate_json
from app.prompts.advisor_prompt import ADVISOR_SYSTEM_PROMPT, build_advisor_prompt
from app.prompts.career_prompt import CAREER_SYSTEM_PROMPT, build_career_prompt
from app.prompts.timetable_prompt import TIMETABLE_SYSTEM_PROMPT, build_timetable_prompt


def _str_list(items):
    return [str(s).strip() for s in (items or []) if str(s).strip()]


def _subject_plan_list(items):
    """Normalize a list of {subject, grade?, advice, resources}."""
    out = []
    for it in items or []:
        subject = str(it.get("subject", "")).strip()
        if not subject:
            continue
        out.append({
            "subject": subject,
            "grade": str(it.get("grade", "")).strip(),
            "advice": str(it.get("advice", "")).strip(),
            "resources": _str_list(it.get("resources")),
        })
    return out


def academic_advice(data: dict) -> dict:
    payload = json.dumps(data, ensure_ascii=False, indent=2)
    result = generate_json(ADVISOR_SYSTEM_PROMPT, build_advisor_prompt(payload))
    return {
        "motivation": str(result.get("motivation", "")).strip(),
        "analysis": str(result.get("analysis", "")).strip(),
        "strengths": _str_list(result.get("strengths")),
        "repeatSubjects": _subject_plan_list(result.get("repeatSubjects")),
        "upcomingPlan": _subject_plan_list(result.get("upcomingPlan")),
    }


def career_roadmap(data: dict) -> dict:
    payload = json.dumps(data, ensure_ascii=False, indent=2)
    result = generate_json(CAREER_SYSTEM_PROMPT, build_career_prompt(payload))
    roadmap = []
    for ph in result.get("roadmap", []) or []:
        roadmap.append({
            "phase": str(ph.get("phase", "")).strip(),
            "skills": _str_list(ph.get("skills")),
            "projectIdea": str(ph.get("projectIdea", "")).strip(),
        })
    return {
        "targetCareer": str(result.get("targetCareer", "")).strip(),
        "matchedSkills": _str_list(result.get("matchedSkills")),
        "missingSkills": _str_list(result.get("missingSkills")),
        "roadmap": roadmap,
    }


def study_timetable(data: dict) -> dict:
    payload = json.dumps(data, ensure_ascii=False, indent=2)
    result = generate_json(TIMETABLE_SYSTEM_PROMPT, build_timetable_prompt(payload))
    blocks = []
    for b in result.get("blocks", []) or []:
        focus = str(b.get("focus", "")).strip()
        if not focus:
            continue
        blocks.append({
            "day": str(b.get("day", "")).strip(),
            "startTime": str(b.get("startTime", "")).strip(),
            "endTime": str(b.get("endTime", "")).strip(),
            "focus": focus,
            "reason": str(b.get("reason", "")).strip(),
        })
    return {
        "advice": str(result.get("advice", "")).strip(),
        "blocks": blocks,
    }
