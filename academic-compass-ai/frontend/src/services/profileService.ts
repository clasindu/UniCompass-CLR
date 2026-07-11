import apiClient from "../lib/apiClient";
import type { ProfileResponse, University, Degree } from "../types";

export async function getProfile(): Promise<ProfileResponse> {
  const { data } = await apiClient.get<ProfileResponse>("/student/profile");
  return data;
}

export async function updateProfile(payload: {
  fullName: string;
  universityId: string | null;
  degreeId: string | null;
  careerGoal: string | null;
  interests: string | null;
}): Promise<ProfileResponse> {
  const { data } = await apiClient.put<ProfileResponse>("/student/profile", payload);
  return data;
}

export async function addSkill(
  skillName: string,
  proficiencyLevel: number
): Promise<ProfileResponse> {
  const { data } = await apiClient.post<ProfileResponse>("/student/skills", {
    skillName,
    proficiencyLevel,
  });
  return data;
}

export async function removeSkill(id: string): Promise<ProfileResponse> {
  const { data } = await apiClient.delete<ProfileResponse>(`/student/skills/${id}`);
  return data;
}

export async function getUniversities(): Promise<University[]> {
  const { data } = await apiClient.get<University[]>("/reference/universities");
  return data;
}

export async function getDegrees(): Promise<Degree[]> {
  const { data } = await apiClient.get<Degree[]>("/reference/degrees");
  return data;
}
