// Day 3 types — AI Learning Assistant

export interface Flashcard {
  question: string;
  answer: string;
}

export interface MCQOption {
  text: string;
  correct: boolean;
}

export interface MCQ {
  question: string;
  options: MCQOption[];
  explanation: string;
}

export interface StudyAssets {
  summary: string;
  flashcards: Flashcard[];
  mcqs: MCQ[];
}

export interface NotesResult {
  documentId: string;
  fileName: string;
  status: "COMPLETE" | "FAILED" | "PROCESSING";
  assets: StudyAssets | null;
  error: string | null;
}
