import { ExerciseType } from './ExerciseType';
import { ExerciseBase } from './ExerciseBase';
import { WorkoutTime } from './WorkoutTime';
import { MetaTypes } from './MetaTypes';

export class ExerciseTimeBased extends ExerciseBase {
    _metaType: string = MetaTypes.ExerciseTimeBased;
    constructor(id: string, name: string, description: string, isRest: boolean, lap: number, duration: WorkoutTime) {
        super(id, name, description, lap, ExerciseType.TimeBased, isRest, duration, null)
    }

    copy(id: string, duration?: WorkoutTime): ExerciseTimeBased {
        return new ExerciseTimeBased(id, this.name, this.description, this.item.isRest, this.lap, duration ? duration : this.item?.duration!);
    }
}