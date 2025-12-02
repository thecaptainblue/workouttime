import { IWorkoutComponent } from './IWorkoutComponent';

export class Workout {
    id: string;
    name: string;
    items: IWorkoutComponent[] = [];

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }

    addWorkoutComponent(workoutItem: IWorkoutComponent): void {
        this.items.push(workoutItem);
    }

    addWorkoutComponents(workoutItems: IWorkoutComponent[]): void {
        this.items.push(...workoutItems);
    }
}