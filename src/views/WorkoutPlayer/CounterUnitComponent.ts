import { WorkoutComponentType } from "../../@types/Data/WorkoutComponentType";
import { WorkoutTimeData } from "../../@types/Data/WorkoutTimeData";
import { WorkoutTimeHelper } from "../../@types/WorkoutTimeHelper";
import LogHelper from "../../helper/LogHelper";
import { LogService } from "../../services/Log/LogService";
import { ComponentContainer, ComponentContainerInfo } from "./ComponentContainer";
import { CounterUnit } from "./CounterUnit";
import { UnitInfo } from "./UnitInfo";
import { WorkoutComponentInfo } from "./WorkoutComponentInfo";

export type CounterUnitComponentInfo = {
    baseUnitInfo: UnitInfo | null;
    containerInfo: ComponentContainerInfo | null;
}

export class CounterUnitComponent {
    baseUnit: CounterUnit;
    container: ComponentContainer;
    currentComponentInfo: WorkoutComponentInfo | null;

    constructor() {
        this.baseUnit = new CounterUnit();
        this.container = new ComponentContainer();
        this.currentComponentInfo = null;
    }

    getContainerInfo(): ComponentContainerInfo | null {
        return this.container.getInfo();
    }

    start(isPreviousCompleted: boolean | null, componentInfo: WorkoutComponentInfo | null) {
        if (this.isActive()) {
            this.record(isPreviousCompleted);
        }

        this.currentComponentInfo = componentInfo;
        const countdownDuration: WorkoutTimeData | null = componentInfo?.component.componentType == WorkoutComponentType.ExerciseTimeBased
            ? componentInfo.component.duration
            : null;
        const countdownDurationInSeconds = countdownDuration != null ? WorkoutTimeHelper.toSeconds(countdownDuration) : null;
        // LogService.infoFormat('CounterUnitComponent start');
        this.baseUnit.start(countdownDurationInSeconds)
        this.startInternal();
    }

    private startInternal() {
    }


    stop(isPreviousCompleted: boolean | null): CounterUnitComponentInfo {

        let lastCounterInfo: UnitInfo | null = null;
        if (this.isActive()) {
            lastCounterInfo = this.record(isPreviousCompleted);
        }
        const lastComponentInfo: CounterUnitComponentInfo = { baseUnitInfo: lastCounterInfo, containerInfo: this.getContainerInfo() };
        this.container.clear();
        return lastComponentInfo;
    }

    private stopInternal(): UnitInfo | null {
        let lastCounterInfo = null;
        const baseUnitInfo = this.baseUnit.stop();
        lastCounterInfo = baseUnitInfo;
        this.currentComponentInfo = null;
        return lastCounterInfo;
    }

    pause() {
        // LogService.infoFormat('CounterUnitComponent pause');
        this.baseUnit.pause();
    }

    resume() {
        // LogService.infoFormat('CounterUnitComponent resume');
        this.baseUnit.resume();
    }

    calculatePeriodic(): UnitInfo | null {
        let result: UnitInfo | null = null;
        const baseUnitInfo = this.baseUnit.calculatePeriodic();
        result = baseUnitInfo;

        return result;
    }

    private isActive() {
        return this.currentComponentInfo != null;
    }

    private record(isPreviousCompleted: boolean | null): UnitInfo | null {
        const currentComponent = this.currentComponentInfo?.component!;
        const info = this.stopInternal();
        let workDurationInMilliseconds = 0;
        let restDurationInMilliseconds = 0;
        let lapCompleted = 0;
        let lapSkipped = 0;

        if (isPreviousCompleted == true) {
            lapCompleted = 1;
        } else {
            lapSkipped = 1;
        }

        if (currentComponent.componentType == WorkoutComponentType.ExerciseTimeBased) {
            const targetDurationInMilliseconds = WorkoutTimeHelper.toSeconds(currentComponent.duration!) * 1000;
            const durationInMilliseconds = lapCompleted > 0 ? targetDurationInMilliseconds : info?.elapsedInMilliseconds!;
            if (currentComponent.isRest == true) {
                restDurationInMilliseconds = durationInMilliseconds;
            } else {
                workDurationInMilliseconds = durationInMilliseconds;
            }

        } else if (currentComponent.componentType == WorkoutComponentType.ExerciseRepBased) {
            workDurationInMilliseconds = info?.elapsedInMilliseconds!;
        }

        this.container.addRecord(currentComponent.id, workDurationInMilliseconds, restDurationInMilliseconds, lapCompleted, lapSkipped);
        // LogService.infoFormat('CounterUnitComponent containerInfo {0}', LogHelper.toString(this.container.getInfo(), undefined, true));
        return info;
    }
}