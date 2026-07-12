import axios from "axios";
import type { NotesResult } from "../types/ai";

// The AI service is a SEPARATE app from the main backend.
// It runs on its own port (default 8000).
const AI_BASE_URL = import.meta.env.VITE_AI_BASE_URL ?? "http://localhost:8000";

const aiClient = axios.create({ baseURL: AI_BASE_URL });

export async function uploadPdf(file: File): Promise<NotesResult> {
  const form = new FormData();
  form.append("file", file);
  const { data } = await aiClient.post<NotesResult>("/ai/notes/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 120000, // AI generation can take a while
  });
  return data;
}
