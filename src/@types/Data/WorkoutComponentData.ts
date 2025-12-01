import { WorkoutComponentType } from "./WorkoutComponentType";
import { WorkoutTimeData } from "./WorkoutTimeData";


export type WorkoutComponentData = {
    componentType: WorkoutComponentType,
    id: string;
    name: string;
    description: string;
    lap: number;
    childeren: WorkoutComponentData[] | null;

    isRest: boolean | null;
    duration: WorkoutTimeData | null;
    reps: number | null;
}