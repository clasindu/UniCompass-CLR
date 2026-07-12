import apiClient from "../lib/apiClient";
import type { SemesterResponse, SubjectResponse, GradeResponse, GpaResponse } from "../types/academic";

export async function getSemesters(): Promise<SemesterResponse[]> {
  const { data } = await apiClient.get<SemesterResponse[]>("/semesters");
  return data;
}

export async function createSemester(payload: {
  name: string;
  startDate: string | null;
  endDate: string | null;
}): Promise<SemesterResponse> {
  const { data } = await apiClient.post<SemesterResponse>("/semesters", payload);
  return data;
}

export async function createSubject(payload: {
  semesterId: string;
  name: string;
  creditHours: number;
}): Promise<SubjectResponse> {
  const { data } = await apiClient.post<SubjectResponse>("/subjects", payload);
  return data;
}

export async function recordGrade(
  subjectId: string,
  payload: { assessmentType: string; letterGrade: string }
): Promise<GradeResponse> {
  const { data } = await apiClient.post<GradeResponse>(`/subjects/${subjectId}/grades`, payload);
  return data;
}

export async function getGpa(): Promise<GpaResponse> {
  const { data } = await apiClient.get<GpaResponse>("/gpa");
  return data;
}
