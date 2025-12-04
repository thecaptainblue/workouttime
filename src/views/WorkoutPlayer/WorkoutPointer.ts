import { WorkoutComponentData } from "../../@types/Data/WorkoutComponentData";

export class WorkoutPointer {
    parentId: string | null;
    components: WorkoutComponentData[];
    index: number;
    lapGroup: number;
    lapTargetGroup: number;
    lapSingle: number | null;

    constructor(parentId: string | null, components: WorkoutComponentData[], index: number, lapGroup: number, lapTargetGroup: number, lapSingle: number | null) {
        this.parentId = parentId;
        this.components = components;
        this.index = index;
        this.lapGroup = lapGroup;
        this.lapTargetGroup = lapTargetGroup;
        this.lapSingle = lapSingle;
    }
}