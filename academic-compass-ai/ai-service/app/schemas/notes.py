from pydantic import BaseModel
from typing import List


class Flashcard(BaseModel):
    question: str
    answer: str


class MCQOption(BaseModel):
    text: str
    correct: bool


class MCQ(BaseModel):
    question: str
    options: List[MCQOption]
    explanation: str = ""


class StudyAssets(BaseModel):
    summary: str
    flashcards: List[Flashcard]
    mcqs: List[MCQ]


class GenerateResponse(BaseModel):
    documentId: str
    fileName: str
    status: str
    assets: StudyAssets | None = None
    error: str | None = None
