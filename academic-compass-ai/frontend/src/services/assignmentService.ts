import apiClient from "../lib/apiClient";
import type { AssignmentResponse } from "../types/academic";

export async function getAssignments(): Promise<AssignmentResponse[]> {
  const { data } = await apiClient.get<AssignmentResponse[]>("/assignments");
  return data;
}

export async function createAssignment(payload: {
  title: string;
  description: string | null;
  subjectId: string | null;
  deadline: string;
  priority: string;
  difficulty: number;
}): Promise<AssignmentResponse> {
  const { data } = await apiClient.post<AssignmentResponse>("/assignments", payload);
  return data;
}

export async function updateAssignment(
  id: string,
  payload: Partial<{
    title: string;
    description: string;
    deadline: string;
    priority: string;
    difficulty: number;
    status: string;
  }>
): Promise<AssignmentResponse> {
  const { data } = await apiClient.put<AssignmentResponse>(`/assignments/${id}`, payload);
  return data;
}

export async function deleteAssignment(id: string): Promise<void> {
  await apiClient.delete(`/assignments/${id}`);
}
