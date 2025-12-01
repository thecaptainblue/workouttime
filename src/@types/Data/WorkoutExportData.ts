import { WorkoutData } from "./WorkoutData";

export const WorkoutExportDataVersion = 1;

export type WorkoutExportData = {
    version: number;
    workouts: WorkoutData[] | null;
}