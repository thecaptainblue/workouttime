import { IMeta } from './IMeta';
import { IWorkoutItemDetail } from './IWorkoutItemDetail';

export interface IWorkoutComponent extends IMeta {
    id: string;
    name: string;
    description: string;
    lap: number
    item: IWorkoutItemDetail | null;
    children: IWorkoutComponent[] | null;
    isSingleWorkout: () => boolean;
}