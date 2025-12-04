import { WorkoutComponentInfo } from "./WorkoutComponentInfo";

export type WorkoutPlayerInfo = {
    isPreviousCompleted: boolean | null;
    componentInfo: WorkoutComponentInfo | null;

}