export interface UserSummary {
  id: string;
  email: string;
}

export interface AuthResponse {
  accessToken: string;
  expiresIn: number;
  user: UserSummary;
}

export interface SkillResponse {
  id: string;
  skillName: string;
  category: string;
  proficiencyLevel: number;
}

export interface ProfileResponse {
  id: string;
  fullName: string;
  universityId: string | null;
  degreeId: string | null;
  careerGoal: string | null;
  interests: string | null;
  skills: SkillResponse[];
}

export interface University {
  id: string;
  name: string;
  country: string;
}

export interface Degree {
  id: string;
  name: string;
  field: string;
}
