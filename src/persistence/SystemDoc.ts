// SystemDoc.ts
import { ObjectSchema, Realm } from "realm";


export class SystemDoc extends Realm.Object<SystemDoc> {
    /**
     * @description A fixed ID to ensure only a single System document exists.
     */
    _id!: string;
    isFirstUsage!: boolean;

    static schema: ObjectSchema = {
        name: 'SystemDoc',
        properties: {
            // Using a string primary key with a fixed value will enforce a single row.
            _id: { type: 'string', indexed: true },
            isFirstUsage: { type: 'bool', default: true },
        },
        primaryKey: '_id',
    }

}