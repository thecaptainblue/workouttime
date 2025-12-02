import { WorkoutTimeData } from "./Data/WorkoutTimeData";
import { String } from 'typescript-string-operations';

const HourInMinute = 60;
const MinuteInSeconds = 60;
export class WorkoutTimeHelper {

    static isThereHours(time: WorkoutTimeData): boolean {
        let result: boolean = false;
        if (time.hours > 0) {
            result = true;
        }
        return result;
    }

    static isThereMinutes(time: WorkoutTimeData): boolean {
        let result: boolean = false;
        if (time.minutes > 0) {
            result = true;
        }
        return result;
    }

    static isHourMinutesSame(time: WorkoutTimeData, timeInMilliseconds: number) {
        let result = false;
        let date = new Date(timeInMilliseconds);
        if (time != null && date.getHours() == time.hours && date.getMinutes() == time.minutes) {
            result = true;
        }
        return result;
    }


    static toSeconds(time: WorkoutTimeData) {
        let result = time.hours * HourInMinute * MinuteInSeconds + time.minutes * MinuteInSeconds + time.seconds;
        return result;
    }

    static fromSeconds(seconds: number): WorkoutTimeData {
        let tmpSeconds: number = seconds;

        const hours = Math.floor(tmpSeconds / (HourInMinute * MinuteInSeconds));
        if (hours > 0) {
            tmpSeconds = tmpSeconds - hours * HourInMinute * MinuteInSeconds;
        }

        const minutes = Math.floor(tmpSeconds / MinuteInSeconds);
        if (minutes > 0) {
            tmpSeconds = tmpSeconds - minutes * MinuteInSeconds;
        }

        return { hours: hours, minutes: minutes, seconds: tmpSeconds };
    }

    static create(hours: number, minutes: number, seconds: number): WorkoutTimeData {
        return { hours: hours, minutes: minutes, seconds: seconds };
    }

    static from(minutes: number, seconds: number): WorkoutTimeData {
        return WorkoutTimeHelper.create(0, minutes, seconds);
    }

    static isEmpty(data: WorkoutTimeData | undefined): boolean {
        let result: boolean = false;

        if (data == null || data == undefined || (data.hours <= 0 && data.minutes <= 0 && data.seconds <= 0)) {
            result = true
        }
        // console.log('workoutTime data: %s, result: %s', data, result);
        return result;
    }

    static display(time: WorkoutTimeData | null, willRemoveSpace?: boolean, willShowFull?: boolean): string {
        let text: string = '';
        if (time != null) {
            if (WorkoutTimeHelper.isThereHours(time) || willShowFull == true) {
                text += String.format("{0:00}", time.hours) + (willRemoveSpace == true ? ":" : " : ");
            }
            text += String.format("{0:00}", time.minutes) + (willRemoveSpace == true ? ":" : " : ");
            text += String.format("{0:00}", time.seconds);
        }
        return text;
    }
}