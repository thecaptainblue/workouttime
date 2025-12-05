import { LocalDate } from "@js-joda/core";
import { WorkoutData } from "../@types/Data/WorkoutData";
import { WorkoutExportData, WorkoutExportDataVersion } from "../@types/Data/WorkoutExportData";
import { WorkoutHelper } from "../@types/Data/WorkoutHelper";

export const ExportImportConstants = {
    fileExtention: 'wt',
    exportPrefix: 'workout_',
    exportAllFileName: 'workouts',
    nameSeparator: '_'
}

export class ExportImportHelper {
    static createExportData(workouts: WorkoutData[]): WorkoutExportData {
        const tmpWorkouts: WorkoutData[] = [];
        workouts.forEach(item => tmpWorkouts.push(this.prepareForExport(item)));
        return { version: WorkoutExportDataVersion, workouts: tmpWorkouts }
    }

    static createExportDataSingleWorkout(workout: WorkoutData): WorkoutExportData {
        const tmpWorkout = this.prepareForExport(workout);
        return { version: WorkoutExportDataVersion, workouts: [tmpWorkout] }
    }

    static prepareForExport(workout: WorkoutData): WorkoutData {
        let result = WorkoutHelper.createWorkout(workout.id, workout.name, workout.components); // omit notifications
        return result;
    }

    static createWorkoutFileName(workoutName: string) {
        return ExportImportConstants.exportPrefix + workoutName + ExportImportConstants.nameSeparator + LocalDate.now().toString();
    }

    static createAllWorkoutsFileName() {
        return ExportImportConstants.exportAllFileName + ExportImportConstants.nameSeparator + LocalDate.now().toString();
    }
}