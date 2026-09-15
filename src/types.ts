export type ExerciseType = 'resistance' | 'duration' | 'cardio' | 'bodyweight';

export interface ExerciseDef {
  name: string;
  sets: number;
  target: string;
  type: ExerciseType;
}

export interface WorkoutDay {
  name: string;
  exercises: ExerciseDef[];
}

export interface LoggedSet {
  weight: string;
  reps: string;
  duration: string;
  distance?: string;
  pace?: string;
  incline?: string;
  completed: boolean;
  isWarmup?: boolean;
}

export interface WorkoutSession {
  id: string;
  date: string;
  dayName: string;
  exercises: Record<string, LoggedSet[]>;
  isFinished: boolean;
  finishedAt?: string;
  exerciseOrder?: string[];
  notes?: string;
  exerciseNotes?: Record<string, string>;
  customExercises?: ExerciseDef[];
}
