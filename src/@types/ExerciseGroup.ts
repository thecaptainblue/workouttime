import { ExerciseBase } from './ExerciseBase';
import { IWorkoutComponent } from './IWorkoutComponent';
import { IWorkoutItemDetail } from './IWorkoutItemDetail';
import { MetaTypes } from './MetaTypes';

export class ExerciseGroup implements IWorkoutComponent {
    _metaType: string = MetaTypes.ExerciseGroup;
    id: string;
    name: string;
    description: string;
    lap: number;
    item: IWorkoutItemDetail | null = null;
    children: IWorkoutComponent[] | null = [];

    constructor(id: string, name: string, description: string, lap: number, childeren?: IWorkoutComponent[] | null) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.lap = lap;
        if (childeren != null) {
            this.children?.push(...childeren);
        }
    }

    isSingleWorkout(): boolean {
        return false;
    }

    addExercise(excersice: ExerciseBase): void {
        this.children?.push(excersice);
    }

    addComponents(exercises: IWorkoutComponent[]): void {
        this.children?.push(...exercises);
    }

    removeExercise(excersice: ExerciseBase): void {
        if (this.children != null) {
            const foundIndex = this.children.indexOf(excersice);
            if (foundIndex >= 0) {
                this.children.splice(foundIndex, 1);
            }
        }
    }
}