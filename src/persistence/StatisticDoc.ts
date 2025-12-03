
import { BSON, ObjectSchema, Realm } from "realm";

export class StatisticDoc extends Realm.Object<StatisticDoc> {
    _id!: BSON.ObjectId;
    workoutId!: string;
    workoutElapsedTimeInMS!: number;
    workoutWorkTimeInMS!: number;
    workoutRestTimeInMS!: number;
    isCompleted!: boolean;
    finishTime!: Date;

    static schema: ObjectSchema = {
        name: 'StatisticDoc',
        properties: {
            _id: 'objectId',
            workoutId: { type: 'string', indexed: 'full-text' },
            workoutElapsedTimeInMS: { type: "int" },
            workoutWorkTimeInMS: { type: "int" },
            workoutRestTimeInMS: { type: "int" },
            isCompleted: { type: "bool" },
            finishTime: { type: "date" },
        },
        primaryKey: '_id',
    }
}

// // Define your migration function
// const migrationFunction = (oldRealm: any, newRealm: any) => {
//     // Access old and new schema versions
//     const oldObjects = oldRealm.objects('StatisticDoc');
//     const newObjects = newRealm.objects('StatisticDoc');

//     // Loop through existing objects and assign new UUIDs
//     for (let i = 0; i < oldObjects.length; i++) {
//         const oldObject = oldObjects[i];
//         const newObject = newObjects.create({
//             _id: v4(), // Generate a new UUID for the _id
//             name: oldObject.name
//         });
//     }
// };

// const config: ConfigurationWithoutSync = {
//     // schema: [StatisticDoc], // Pass your updated schema
//     // schemaVersion: 1, // Increment schema version
//     // onMigration: migrationFunction  // Provide the migration function
//     deleteRealmIfMigrationNeeded: true,
// }

// // Open the Realm with migration handling
// const realm = new Realm(config);