import { ComponentContainerInfo } from "./ComponentContainer";
import { UnitInfo } from "./UnitInfo";

export type CounterInfo = {
    isWorkoutCompleted: boolean;
    workoutInfo: UnitInfo | null;
    componentInfo: UnitInfo | null | undefined;
    containerInfo?: ComponentContainerInfo | null;
}
