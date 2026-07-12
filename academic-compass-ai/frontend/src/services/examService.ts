import apiClient from "../lib/apiClient";
import type { ExamResponse } from "../types/academic";

export async function getExams(): Promise<ExamResponse[]> {
  const { data } = await apiClient.get<ExamResponse[]>("/exams");
  return data;
}

export async function createExam(payload: {
  title: string;
  subjectId: string | null;
  examDate: string;
  examTime: string | null;
  venue: string | null;
  examType: string;
}): Promise<ExamResponse> {
  const { data } = await apiClient.post<ExamResponse>("/exams", payload);
  return data;
}

export async function updateExam(
  id: string,
  payload: Partial<{
    title: string;
    examDate: string;
    examTime: string;
    venue: string;
    examType: string;
    preparationStatus: string;
  }>
): Promise<ExamResponse> {
  const { data } = await apiClient.put<ExamResponse>(`/exams/${id}`, payload);
  return data;
}

export async function deleteExam(id: string): Promise<void> {
  await apiClient.delete(`/exams/${id}`);
}
