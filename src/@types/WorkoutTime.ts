import { StringBuilder } from "typescript-string-operations";
import { IMeta } from "./IMeta";

const HourInMinute = 60;
const MinuteInSeconds = 60;

export class WorkoutTime implements IMeta {
    _metaType: string = 'WorkoutTime';
    hours: number;
    minutes: number;
    seconds: number;

    constructor(hours: number, minutes: number, seconds: number) {
        //todo: error handling for all arguments
        if (hours > 24 || hours < 0) {
            throw new Error(`Argument is not in range ${hours}`);
        }
        if (minutes > 60 || minutes < 0) {
            throw new Error(`Argument is not in range ${minutes}`);
        }
        if (seconds > 60 || seconds < 0) {
            throw new Error(`Argument is not in range ${seconds}`);
        }
        this.hours = hours;
        this.minutes = minutes;
        this.seconds = seconds;
    }


    isThereHours(): boolean {
        let result: boolean = false;
        if (this.hours > 0) {
            result = true;
        }
        return result;
    }

    isThereMinutes(): boolean {
        let result: boolean = false;
        if (this.minutes > 0) {
            result = true;
        }
        return result;
    }


    toSeconds() {
        let result = this.hours * HourInMinute * MinuteInSeconds + this.minutes * MinuteInSeconds + this.seconds;
        return result;
    }

    toString(): string {
        let text: StringBuilder = new StringBuilder();
        text.append('hours: ');
        text.appendLine(String(this.hours));
        text.append('minutes: ');
        text.appendLine(String(this.minutes));
        text.append('seconds: ');
        text.appendLine(String(this.seconds));
        return text.toString();
    }

    static fromSeconds(seconds: number): WorkoutTime {
        let tmpSeconds: number = seconds;

        const hours = Math.floor(tmpSeconds / (HourInMinute * MinuteInSeconds));
        if (hours > 0) {
            tmpSeconds = tmpSeconds - hours * HourInMinute * MinuteInSeconds;
        }

        const minutes = Math.floor(tmpSeconds / MinuteInSeconds);
        if (minutes > 0) {
            tmpSeconds = tmpSeconds - minutes * MinuteInSeconds;
        }

        return new WorkoutTime(hours, minutes, tmpSeconds);
    }

    static from(minutes: number, seconds: number): WorkoutTime {
        return new WorkoutTime(0, minutes, seconds);
    }
}