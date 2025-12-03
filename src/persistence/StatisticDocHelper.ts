import { Realm } from "@realm/react";
import { CounterInfo } from "../views/WorkoutPlayer/CounterInfo";
import { StatisticDoc } from "./StatisticDoc";
import { BSON } from "realm";
import { logError } from "../helper/LogHelper";
import { convert, LocalDate } from "@js-joda/core";

export class StatisticDocHelper {

    static addStatistic(realm: Realm, info: CounterInfo | null, workoutId: string) {

        try {
            if (info != null && info.containerInfo != null && info.workoutInfo != null) {
                // const workoutElapsedTimeInMS = info.containerInfo.totalWorkDurationInMilliseconds + info.containerInfo.totalRestDurationInMilliseconds;
                // const workoutRestTimeInMS = info.workoutInfo.elapsedInMilliseconds - info.containerInfo.totalWorkDurationInMilliseconds;
                const finishTime = new Date(Date.now());

                realm.write(() => {
                    realm.create(StatisticDoc, {
                        _id: new BSON.ObjectId(), workoutId: workoutId, workoutElapsedTimeInMS: info.workoutInfo!.elapsedInMilliseconds
                        , workoutWorkTimeInMS: info.containerInfo!.totalWorkDurationInMilliseconds
                        , workoutRestTimeInMS: info.containerInfo!.totalRestDurationInMilliseconds
                        , isCompleted: info.isWorkoutCompleted, finishTime: finishTime
                    }
                        // satisfies StatisticDoc
                    )
                })
            }
        } catch (e) {
            logError(e, "StatisticDocHelper:addStatistic:");
        }
    }

    static getStatistics(workoutId: string, realm: Realm, startTime: LocalDate | null, endTime: LocalDate | null): Realm.Results<StatisticDoc> {
        // let filteredStatistic: Realm.Results<StatisticDoc> = [] as unknown as Realm.Results<StatisticDoc>;
        let filteredStatistic: Realm.Results<StatisticDoc> = [] as unknown as Realm.Results<StatisticDoc>;
        try {
            const startDate = startTime != null ? convert(startTime).toDate() : null;
            const endDate = endTime != null ? convert(endTime).toDate() : null;
            // LogService.infoFormat('getDataFromDb startDate: {0}, endDate: {1}', startDate?.toString(), endDate?.toString());
            if (startDate != null && endDate == null) {
                filteredStatistic = realm
                    .objects(StatisticDoc)
                    .filtered('workoutId==$0 && finishTime >= $1  ', workoutId, startDate).sorted('finishTime');
            } else if (startDate == null && endDate != null) {
                filteredStatistic = realm
                    .objects(StatisticDoc)
                    .filtered('workoutId==$0 && finishTime <$1  ', workoutId, endDate).sorted('finishTime');
            } else if (startDate != null && endDate != null) {
                filteredStatistic = realm
                    .objects(StatisticDoc)
                    .filtered('workoutId==$0 && finishTime >= $1  && finishTime <$2 ', workoutId, startDate, endDate).sorted('finishTime');
            } else {
                filteredStatistic = realm
                    .objects(StatisticDoc)
                    .filtered('workoutId==$0  ', workoutId).sorted('finishTime');
            }
        } catch (e) {
            logError(e, "StatisticDocHelper:getStatistics:");
        }
        return filteredStatistic;
    }

    static deleteStatistic(realm: Realm, workoutId: string) {
        try {
            const toDelete = realm.objects(StatisticDoc).filtered('workoutId=$0', workoutId);
            realm.write(() => {
                realm.delete(toDelete)
            })
        } catch (e) {
            logError(e);
        }
    }
}