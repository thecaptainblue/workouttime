import { WorkoutComponentData } from "../../@types/Data/WorkoutComponentData";
import { ParentInfo } from "./ParentInfo";

export class WorkoutComponentInfo {
    component: WorkoutComponentData;
    lap: number;
    parentInfos: ParentInfo[];

    constructor(component: WorkoutComponentData, lap: number, parentInfos: ParentInfo[]) {
        this.component = component;
        this.lap = lap;
        this.parentInfos = parentInfos;
    }
}