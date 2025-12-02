import { ExerciseGroup } from "../../@types/ExerciseGroup";
import { ExerciseRepBased } from "../../@types/ExerciseRepBased";
import { ExerciseTimeBased } from "../../@types/ExerciseTimeBased";
import { IMeta } from "../../@types/IMeta";
import { MetaTypes } from "../../@types/MetaTypes";
import { WorkoutTime } from "../../@types/WorkoutTime";

export const EscapedMetaTypeKey: string = 'escaped-meta-type';
export const MetaTypeKey: string = '_metaType';

export type MetaTypeStructure = { type: string, payload?: any };


export class MetaTypeConverter {
    static instanceOfMeta(object: any): object is IMeta {
        return MetaTypeKey in object;
    }

    static Convert(value: any): any {
        let result = value;
        let metaInfo = value._metaType as MetaTypeStructure;
        // console.log('MetaTypeConverter------------- _metaType: ', value[MetaTypeKey]);
        if (metaInfo.type === EscapedMetaTypeKey) {
            result = {
                ...value,
                _metaType: metaInfo.payload,

            }
        } else if (metaInfo.type === MetaTypes.Map) {
            // console.log('MetaTypeConverter------------- _metaType: ', value[MetaTypeKey]);
            result = new Map(metaInfo.payload);
        } else if (metaInfo.type === MetaTypes.Set) {
            result = new Set(metaInfo.payload);
        } else if (metaInfo.type === MetaTypes.ExerciseTimeBased) {
            let tmpValue = value as ExerciseTimeBased;
            // tmpValue._metaType = metaInfo.type; //   burada yapmama gerek yok cunku sinifin icinde geliyor zaten
            result = new ExerciseTimeBased(tmpValue.id, tmpValue.name, tmpValue.description, tmpValue.item.isRest, tmpValue.lap, tmpValue.item.duration);
        } else if (metaInfo.type === MetaTypes.ExerciseRepBased) {
            let tmpValue = value as ExerciseRepBased;
            result = new ExerciseRepBased(tmpValue.id, tmpValue.name, tmpValue.description, tmpValue.lap, tmpValue.item.duration, tmpValue.item.reps!);
        } else if (metaInfo.type === MetaTypes.ExerciseGroup) {
            let tmpValue = value as ExerciseGroup;
            result = new ExerciseGroup(tmpValue.id, tmpValue.name, tmpValue.description, tmpValue.lap, tmpValue.children);
        } else if (metaInfo.type === MetaTypes.WorkoutTime) {
            let tmpValue = value as WorkoutTime;
            result = new WorkoutTime(tmpValue.hours, tmpValue.minutes, tmpValue.seconds);
        }
        else {
            console.warn("Unexpected metaType", value);
        }

        return result;
    }
}