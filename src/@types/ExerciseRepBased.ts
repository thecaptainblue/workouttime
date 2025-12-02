import { ExerciseType } from './ExerciseType';
import { ExerciseBase } from './ExerciseBase';
import { WorkoutTime } from './WorkoutTime';
import { MetaTypes } from './MetaTypes';

export class ExerciseRepBased extends ExerciseBase {
    _metaType: string = MetaTypes.ExerciseRepBased;

    constructor(id: string, name: string, description: string, lap: number, duration: WorkoutTime, reps: number) {
        super(id, name, description, lap, ExerciseType.RepBased, false, duration, reps)
    }

    copy(id: string): ExerciseRepBased {
        return new ExerciseRepBased(id, this.name, this.description, this.lap, this.item?.duration!, this.item?.reps!);
    }
}