// Day 4 types — Academic Advisor, Career, Timetable (SLTC repeat-aware)

export interface SubjectPlanItem {
  subject: string;
  grade: string;
  advice: string;
  resources: string[];
}

export interface AcademicAdvice {
  motivation: string;
  analysis: string;
  strengths: string[];
  repeatSubjects: SubjectPlanItem[];
  upcomingPlan: SubjectPlanItem[];
}

export interface RoadmapPhase {
  phase: string;
  skills: string[];
  projectIdea: string;
}

export interface CareerRoadmap {
  targetCareer: string;
  matchedSkills: string[];
  missingSkills: string[];
  roadmap: RoadmapPhase[];
}

export interface TimetableBlock {
  day: string;
  startTime: string;
  endTime: string;
  focus: string;
  reason: string;
}

export interface StudyTimetable {
  advice: string;
  blocks: TimetableBlock[];
}
