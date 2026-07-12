// Day 2 types — Academic, Assignment, Exam

export interface GradeResponse {
  id: string;
  subjectId: string;
  assessmentType: string;
  letterGrade: string;
  gpaPoints: number;
}

export interface SubjectResponse {
  id: string;
  semesterId: string;
  name: string;
  creditHours: number;
  grades: GradeResponse[];
}

export interface SemesterResponse {
  id: string;
  name: string;
  startDate: string | null;
  endDate: string | null;
  subjects: SubjectResponse[];
}

export interface GpaResponse {
  cumulativeGpa: number;
  perSemester: { semesterName: string; gpa: number }[];
}

export interface AssignmentResponse {
  id: string;
  title: string;
  description: string | null;
  subjectId: string | null;
  deadline: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  difficulty: number;
  status: "NOT_STARTED" | "IN_PROGRESS" | "SUBMITTED";
}

export interface ExamResponse {
  id: string;
  title: string;
  subjectId: string | null;
  examDate: string;
  examType: "MIDTERM" | "FINAL" | "QUIZ";
  preparationStatus: "NOT_STARTED" | "IN_PROGRESS" | "READY";
  daysRemaining: number;
}
