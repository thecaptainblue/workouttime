
import { BSON, ObjectSchema, Realm } from "realm";
import { RuleDoc } from "./RuleDoc";

export class TrackDoc extends Realm.Object<TrackDoc> {
    _id!: BSON.ObjectId;
    workoutId!: string;
    startDate!: Date;
    endDate?: Date;
    rule!: RuleDoc;
    active!: boolean;

    static schema: ObjectSchema = {
        name: 'TrackDoc',
        properties: {
            _id: 'objectId',
            workoutId: { type: 'string', indexed: 'full-text' },
            startDate: { type: 'date' },
            // endDate: 'date?', // nulllable icin alternatif yazim
            endDate: { type: 'date', optional: true },
            rule: { type: 'object', objectType: 'RuleDoc' },
            active: { type: 'bool' },
        },
        primaryKey: '_id',
    }
}
