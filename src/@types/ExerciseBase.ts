import { IWorkoutComponent } from './IWorkoutComponent';
import { IWorkoutItemDetail } from './IWorkoutItemDetail';
import { WorkoutTime } from './WorkoutTime';
import { ExerciseType } from './ExerciseType';
import { IMeta } from './IMeta';

export abstract class ExerciseBase implements IWorkoutComponent {
    abstract _metaType: string;
    id: string;
    name: string;
    description: string;
    lap: number;
    item: IWorkoutItemDetail;
    children: IWorkoutComponent[] | null = null;

    constructor(id: string, name: string, description: string, lap: number, excersiceType: ExerciseType, isRest: boolean, duration: WorkoutTime, reps: number | null) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.lap = lap;
        this.item = { excersiceType: excersiceType, isRest: isRest, duration: duration, reps: reps };
    }


    isSingleWorkout(): boolean {
        return true;
    }
}