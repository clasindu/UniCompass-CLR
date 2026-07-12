import axios from "axios";
import type { AcademicAdvice, CareerRoadmap, StudyTimetable } from "../types/advisor";

const AI_BASE_URL = import.meta.env.VITE_AI_BASE_URL ?? "http://localhost:8000";
const aiClient = axios.create({ baseURL: AI_BASE_URL, timeout: 120000 });

export async function getAcademicAdvice(data: unknown): Promise<AcademicAdvice> {
  const { data: res } = await aiClient.post<AcademicAdvice>("/ai/academic-advice", { data });
  return res;
}

export async function getCareerRoadmap(data: unknown): Promise<CareerRoadmap> {
  const { data: res } = await aiClient.post<CareerRoadmap>("/ai/career-roadmap", { data });
  return res;
}

export async function getStudyTimetable(data: unknown): Promise<StudyTimetable> {
  const { data: res } = await aiClient.post<StudyTimetable>("/ai/timetable", { data });
  return res;
}
