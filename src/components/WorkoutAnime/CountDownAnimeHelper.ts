import { String } from 'typescript-string-operations';
import { WorkoutTimeHelper } from "../../@types/WorkoutTimeHelper";

export class CountDownAnimeHelper {

    static toRemainingTimeText(durationInSeconds: number, includeZero?: boolean): string {
        let text: string = '';
        if (durationInSeconds > 0 || (includeZero && includeZero === true && durationInSeconds === 0)) {
            let time = WorkoutTimeHelper.fromSeconds(durationInSeconds);
            text = WorkoutTimeHelper.display(time);
        }
        return text;
    }
}