
import { WorkoutTimeData } from '../@types/Data/WorkoutTimeData';
import { WeekDay } from '../@types/WeekDay';




export class DateHelper {

    static createDate(time: WorkoutTimeData, baseTimestamp?: number): Date {
        let date = new Date(baseTimestamp != null ? baseTimestamp : Date.now());
        date.setHours(time.hours);
        date.setMinutes(time.minutes);
        date.setSeconds(time.seconds);
        date.setMilliseconds(0);
        return date
    }
}


