import { WeekDay } from "../@types/WeekDay";

export class DayOfWeekHelper {

    static getActiveDayOfWeek(daysOfWeek?: boolean[] | null) {
        let result = 0;
        if (daysOfWeek != null) {
            for (let dayItem of daysOfWeek) {
                if (dayItem == true) {
                    result++;
                }
            }
        }
        return result;
    }

    static isDayOfWeekFull(daysOfWeek?: boolean[]) {
        let result = false;
        const activeDays = this.getActiveDayOfWeek(daysOfWeek);
        if (activeDays == 7) {
            result = true;
        }
        return result;
    }

    static isDayOfWeekActive(daysOfWeek: boolean[], day: WeekDay) {
        let result = false;
        const indexDay = day as number;
        if (daysOfWeek.length > indexDay && daysOfWeek[indexDay] == true) {
            result = true;
        }
        return result;
    }

    /*
param indexDate is index From Date class which is Sunday-Saturday: 0-6
*/
    static getWeekDayFromDateIndex(indexDate: number): WeekDay {
        let result = WeekDay.Monday;
        switch (indexDate) {
            case 0:
                result = WeekDay.Sunday
                break;
            case 1:
                result = WeekDay.Monday
                break;
            case 2:
                result = WeekDay.Tuesday
                break;
            case 3:
                result = WeekDay.Wednesday
                break;
            case 4:
                result = WeekDay.Thursday
                break;
            case 5:
                result = WeekDay.Friday
                break;
            case 6:
                result = WeekDay.Saturday
                break;
            default: break;
        }
        return result
    }
}