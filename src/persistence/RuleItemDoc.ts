import { ObjectSchema, Realm } from "realm";
import { GoalFrequency, GoalUnit } from "../@types/goal/RuleEnums";
import { RuleItem } from "../@types/goal/RuleItem";

export class RuleItemDoc extends Realm.Object<RuleItemDoc> implements RuleItem {
    id!: string;
    frequency!: GoalFrequency;
    unit!: GoalUnit;
    value!: number;

    static schema: ObjectSchema = {
        name: 'RuleItemDoc',
        embedded: true,
        properties: {
            id: { type: "string" },
            frequency: { type: "string" },
            unit: { type: "string" },
            value: { type: 'int' },
        }
    }
}