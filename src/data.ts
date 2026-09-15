import { WorkoutDay } from './types';

export const SCHEDULE: Record<number, WorkoutDay | null> = {
  6: {
    name: 'Upper A',
    exercises: [
      { name: 'Machine Chest Press', sets: 2, target: '10–12 reps', type: 'resistance' },
      { name: 'Lat Pulldown', sets: 2, target: '10–12 reps', type: 'resistance' },
      { name: 'Seated Cable Row', sets: 2, target: '10–12 reps', type: 'resistance' },
      { name: 'Seated Machine / DB Shoulder Press', sets: 2, target: '10–12 reps', type: 'resistance' },
      { name: 'Triceps Pushdown', sets: 2, target: '12–15 reps', type: 'resistance' },
      { name: 'Plank', sets: 2, target: '30–60 seconds', type: 'duration' }
    ]
  },
  0: {
    name: 'Lower A',
    exercises: [
      { name: 'Goblet Squat', sets: 2, target: '10–12 reps', type: 'resistance' },
      { name: 'Leg Curl', sets: 2, target: '10–12 reps', type: 'resistance' },
      { name: 'Leg Press', sets: 2, target: '10–12 reps', type: 'resistance' },
      { name: 'Calf Raise', sets: 2, target: '12–15 reps', type: 'resistance' },
      { name: 'Bird Dog', sets: 2, target: '8 reps per side', type: 'resistance' }
    ]
  },
  1: {
    name: 'Recovery / Cardio',
    exercises: [
      { name: 'Treadmill', sets: 1, target: '20 minutes', type: 'duration' },
      { name: 'Gentle Mobility', sets: 1, target: '10 minutes', type: 'duration' }
    ]
  },
  2: {
    name: 'Upper B',
    exercises: [
      { name: 'Incline DB Press', sets: 2, target: '10–12 reps', type: 'resistance' },
      { name: 'Seated Cable Row', sets: 2, target: '10–12 reps', type: 'resistance' },
      { name: 'Lat Pulldown', sets: 2, target: '10–12 reps', type: 'resistance' },
      { name: 'Face Pull', sets: 2, target: '12–15 reps', type: 'resistance' },
      { name: 'DB / Cable Biceps Curl', sets: 2, target: '12–15 reps', type: 'resistance' },
      { name: 'Dead Bug', sets: 2, target: '8 reps per side', type: 'resistance' }
    ]
  },
  3: {
    name: 'Lower B',
    exercises: [
      { name: 'DB RDL', sets: 2, target: '8–10 reps', type: 'resistance' },
      { name: 'Leg Extension', sets: 2, target: '10–12 reps', type: 'resistance' },
      { name: 'Leg Curl', sets: 2, target: '10–12 reps', type: 'resistance' },
      { name: 'Calf Raise', sets: 2, target: '12–15 reps', type: 'resistance' },
      { name: 'Side Plank', sets: 2, target: '20–30 seconds per side', type: 'duration' }
    ]
  },
  4: {
    name: 'Optional Cardio / Mobility',
    exercises: [
      { name: 'Treadmill', sets: 1, target: '20 minutes OPTIONAL', type: 'duration' },
      { name: 'Gentle Mobility', sets: 1, target: '10–15 minutes OPTIONAL', type: 'duration' }
    ]
  },
  5: null
};
