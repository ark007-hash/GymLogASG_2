import { WorkoutSession, LoggedSet } from './types';

export function getPreviousPerformance(exerciseName: string, history: WorkoutSession[]): LoggedSet[] | null {
  const sorted = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  for (const session of sorted) {
    if (session.isFinished && session.exercises[exerciseName]) {
      return session.exercises[exerciseName];
    }
  }
  return null;
}

export function getFormattedDate(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}
