import { LogService } from "../../services/Log/LogService";
import { CounterInfo } from "./CounterInfo";
import { CounterUnit } from "./CounterUnit";
import { CounterUnitComponent } from "./CounterUnitComponent";
import { WorkoutComponentInfo } from "./WorkoutComponentInfo";

export class WorkoutCounter {
    workoutUnit: CounterUnit;
    componentUnit: CounterUnitComponent;
    // intervalId: NodeJS.Timeout | null = null; //TODO yukseltme 
    intervalId: number | null = null; //TODO yukseltme 
    intervalValueInMilliseconds: number = 100;
    listeners: ((counterInfo: CounterInfo) => void)[] = [];
    isPaused: boolean = false;
    isWorkoutStarted: boolean = false;
    isWorkoutCompleted: boolean = false;

    constructor() {
        this.workoutUnit = new CounterUnit();
        this.componentUnit = new CounterUnitComponent();
    }

    private isInListeners(listener: (info: CounterInfo) => void): boolean {
        let isAlreadyAdded = false;
        for (let currentListener of this.listeners) {
            if (currentListener === listener) {
                isAlreadyAdded = true;
                break;
            }
        }
        return isAlreadyAdded;
    }

    addListener(listener: (info: CounterInfo) => void) {
        if (listener != null) {
            const isAlreadyAdded = this.isInListeners(listener);

            if (!isAlreadyAdded) {
                this.listeners.push(listener);
            }
        }
    }

    removeListener(listener: (info: CounterInfo) => void) {
        if (listener != null) {
            const indexListener = this.listeners.indexOf(listener);
            if (indexListener >= 0) {
                this.listeners.splice(indexListener, 1);
            }
        }
    }

    private async notifyListeners(info: CounterInfo) {
        this.listeners.forEach(listener => listener(info));
    }

    private isActive(): boolean {
        let result = false;

        if (this.intervalId != null) {
            result = true;
        }
        return result;
    }

    private startWorkout() {
        if (this.isWorkoutStarted == false) {
            this.workoutUnit.start(null);
            // this.componentUnit.start();
            // LogService.infoFormat('WorkoutCounter start');
            this.startTimer();
            this.isWorkoutStarted = true;
            this.isWorkoutCompleted = false;
        }
    }

    private startTimer() {
        // this.startTime = new Date(Date.now());
        this.isPaused = false;
        this.intervalId = setInterval(() => {
            this.runPeriodicJob();
        }, this.intervalValueInMilliseconds);
    }

    private stopTimer() {
        if (this.isActive()) {
            clearInterval(this.intervalId!);
            this.intervalId = null;
        }
    }

    stopWorkout(isPreviousCompleted: boolean | null, isWorkoutCompleted: boolean): CounterInfo | null {
        let info: CounterInfo | null = null;
        if (this.isWorkoutStarted) {
            if (this.isActive()) {
                this.stopTimer();
            }
            const workoutUnitInfo = this.workoutUnit.stop();
            const componentUnitInfo = this.componentUnit.stop(isPreviousCompleted);
            info = { isWorkoutCompleted: isWorkoutCompleted, workoutInfo: workoutUnitInfo, componentInfo: componentUnitInfo.baseUnitInfo, containerInfo: componentUnitInfo.containerInfo };
            // const duration = WorkoutTimeHelper.fromSeconds(Math.floor(workoutUnitInfo!.elapsedInMilliseconds / 1000));
            // this.startTime = null;
            // LogService.infoFormat('WorkoutCounter stop result: {0}', WorkoutTimeHelper.display(duration));

            this.isWorkoutStarted = false;
            this.isWorkoutCompleted = isWorkoutCompleted;
        }
        return info;
    }

    toggleCount(willPause: boolean) {
        if (willPause) {
            if (!this.isPaused && this.isActive()) {
                this.pause();
            }
        } else {
            if (this.isPaused) {
                this.resume();
            }
        }
    }


    private pause() {
        // LogService.infoFormat('WorkoutCounter pause');
        this.stopTimer()
        this.isPaused = true;
        this.workoutUnit.pause();
        this.componentUnit.pause();
    }

    private resume() {
        // LogService.infoFormat('WorkoutCounter resume');
        this.workoutUnit.resume();
        this.componentUnit.resume();
        this.startTimer();
    }

    private runPeriodicJob() {
        const info = this.calculate();
        if (info != null) {
            this.notifyListeners(info);
        }
    }

    private calculate(): CounterInfo {
        const workoutUnitInfo = this.workoutUnit.calculatePeriodic();
        const componentUnitInfo = this.componentUnit.calculatePeriodic();
        const result: CounterInfo = { isWorkoutCompleted: this.isWorkoutCompleted, workoutInfo: workoutUnitInfo, componentInfo: componentUnitInfo };
        return result;
    }

    startComponent(isPreviousCompleted: boolean | null, componentInfo: WorkoutComponentInfo | null) {
        if (this.isWorkoutStarted == false) {
            this.startWorkout();
        }
        this.componentUnit.start(isPreviousCompleted, componentInfo);
    }

    stopComponent(isPreviousCompleted: boolean | null) {
        this.componentUnit.stop(isPreviousCompleted);
    }

}