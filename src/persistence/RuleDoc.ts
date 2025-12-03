
import { BSON, ObjectSchema, Realm } from "realm";
import { RuleItemDoc } from "./RuleItemDoc";

export class RuleDoc extends Realm.Object<RuleDoc> {
    // _id!: BSON.ObjectId; // todo; will be deleted
    // workoutId!: string;
    rules!: RuleItemDoc[];

    static schema: ObjectSchema = {
        name: 'RuleDoc',
        embedded: true,
        properties: {
            // _id: 'objectId', // todo; will be deleted
            // workoutId: { type: 'string', indexed: 'full-text' }, // todo: will be deleted
            rules: { type: 'list', objectType: 'RuleItemDoc' }
        },
        // primaryKey: '_id',
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