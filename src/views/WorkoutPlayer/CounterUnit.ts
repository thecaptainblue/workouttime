import { WorkoutTimeData } from "../../@types/Data/WorkoutTimeData";
import { WorkoutTimeHelper } from "../../@types/WorkoutTimeHelper";
import { LogService } from "../../services/Log/LogService";
import { UnitInfo } from "./UnitInfo";

export class CounterUnit {
    protected startTime: Date | null;
    protected elapsedTimeInMillisecondsBeforePause: number;
    protected isCountDown: boolean;
    protected countdownDurationInSeconds: number | null;

    constructor() {
        this.startTime = null;
        this.elapsedTimeInMillisecondsBeforePause = 0;
        this.isCountDown = false;
        this.countdownDurationInSeconds = null;
    }

    start(countdownDurationInSeconds: number | null) {
        // LogService.infoFormat('CounterUnit start');
        this.elapsedTimeInMillisecondsBeforePause = 0;
        this.countdownDurationInSeconds = countdownDurationInSeconds;
        this.startInternal();
    }

    private startInternal() {
        this.startTime = new Date(Date.now());
    }

    stop(): UnitInfo | null {
        const lastCounterInfo: UnitInfo | null = this.calculateCumulative();
        if (lastCounterInfo != null) {
            const duration = WorkoutTimeHelper.fromSeconds(Math.floor(lastCounterInfo!.elapsedInMilliseconds / 1000));
            // LogService.infoFormat('CounterUnit stop result: {0}', WorkoutTimeHelper.display(duration));
        }
        if (this.startTime != null) {
            this.startTime = null;
        }
        return lastCounterInfo;
    }

    pause() {
        // LogService.infoFormat('CounterUnit pause');
        const lastCounter = this.stop();
        if (lastCounter != null) {
            this.elapsedTimeInMillisecondsBeforePause = lastCounter.elapsedInMilliseconds;
        }
    }

    resume() {
        // LogService.infoFormat('CounterUnit resume');
        this.startInternal();
    }

    calculatePeriodic(): UnitInfo | null {
        let result: UnitInfo | null = null;
        if (this.startTime != null) {
            result = this.calculateCumulative();
        }
        return result;
    }

    calculateCumulative(): UnitInfo | null {
        let result: UnitInfo | null = null;
        let differenceInMilliseconds: number = 0;
        if (this.startTime != null) {
            const nowTimeInMilliseconds = Date.now();
            differenceInMilliseconds = nowTimeInMilliseconds - this.startTime?.getTime();
        }

        differenceInMilliseconds += this.elapsedTimeInMillisecondsBeforePause;
        let countdownInMilliseconds: number | null = null;
        if (this.countdownDurationInSeconds != null) {
            countdownInMilliseconds = this.countdownDurationInSeconds * 1000 - differenceInMilliseconds;
            countdownInMilliseconds = countdownInMilliseconds >= 0 ? countdownInMilliseconds : 0;
        }
        // ileri sayilacagi zaman floor geri sayilacagi zaman ceil kullanilmasi gerekiyor.
        // const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000) + this.elapsedTimeInMillisecondsBeforePause;
        result = { elapsedInMilliseconds: differenceInMilliseconds, countdownInMilliseconds: countdownInMilliseconds };
        // LogService.infoFormat('WorkoutCounter calculate result: {0}', WorkoutTimeHelper.display(WorkoutTimeHelper.fromSeconds(differenceInSeconds)));

        return result;
    }
}