import {ExerciseType} from './ExerciseType';
import {WorkoutTime} from './WorkoutTime';

export interface IWorkoutItemDetail {
  excersiceType: ExerciseType;
  isRest: boolean;
  duration: WorkoutTime;
  reps: number | null;
}
