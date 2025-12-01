import { DialogKeys } from "./dialog/DialogKeys";
import { ScreenNames } from "../views/Screens/ScreenNames";
import { WorkoutData } from "./Data/WorkoutData";
import { PageType } from "./PageType";


export type MainStackParamList = {
    [ScreenNames.MainHome]: undefined;
    [ScreenNames.MainWorkoutPlayer]: { workout: WorkoutData; };
    [ScreenNames.MainWorkoutPlayerEnd]: { workoutName: string, workoutTimeText: string; exerciseTimeText: string; restTimeText: string; };
    [ScreenNames.MainWorkoutAddEdit]: { pageType: PageType, };
    [ScreenNames.MainExerciseAddEdit]: { pageType: PageType, idLadder: string[], componentId: string | null, parentGroupId: string | null, isFromWorkout: boolean, isRepBased?: boolean };
    [ScreenNames.MainGroupAddEdit]: { pageType: PageType, idLadder: string[], groupId: string | null, parentGroupId: string | null, isFromWorkout: boolean };
    [ScreenNames.MainWarningBack]: { message: string };
    [ScreenNames.MainWorkoutNotifications]: {};
    [ScreenNames.MainDialog]: { dialogKey: DialogKeys, message: string, isThreeChoice?: boolean };
    [ScreenNames.MainWorkoutNotificationAddEdit]: { pageType: PageType, workoutName: string, notificationIdWt: string | null };
    [ScreenNames.MainStatistic]: { workoutId: string, workoutName: string }
    [ScreenNames.MainGoal]: { workoutId: string, workoutName: string }
};