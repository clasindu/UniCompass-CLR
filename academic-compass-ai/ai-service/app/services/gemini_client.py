import os
import json
from google import genai
from google.genai import types

_client = None


def _get_client():
    global _client
    if _client is not None:
        return _client
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key == "your-gemini-api-key-here":
        raise RuntimeError(
            "GEMINI_API_KEY is not set. Put your key in the ai-service/.env file."
        )
    _client = genai.Client(api_key=api_key)
    return _client


def generate_json(system_prompt: str, user_prompt: str) -> dict:
    """
    Call Gemini and parse the response as JSON.
    Retries once with a stricter instruction if the first parse fails.
    """
    client = _get_client()

    def _call(extra: str = "") -> str:
        resp = client.models.generate_content(
            model="",
            contents=user_prompt + extra,
            config=types.GenerateContentConfig(
                system_instruction=system_prompt,
                temperature=0.3,
                response_mime_type="application/json",
            ),
        )
        return resp.text or ""

    raw = _call()
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        raw2 = _call("\n\nIMPORTANT: Your previous output was not valid JSON. "
                     "Return ONLY a valid JSON object, nothing else.")
        return json.loads(raw2)
