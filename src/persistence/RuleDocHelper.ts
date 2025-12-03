import { BSON, UpdateMode } from "realm";
import { RuleItem } from "../@types/goal/RuleItem";
import { logError } from "../helper/LogHelper";
import { Realm } from "@realm/react";
import { RuleDoc } from "./RuleDoc";
import { LogService } from "../services/Log/LogService";
import { RuleItemDoc } from "./RuleItemDoc";

export class RuleDocHelper {

    // static addRule(realm: Realm, rules: RuleItem[], workoutId: string) {
    //     LogService.infoFormat('RuleDocHelper; addRule ');
    //     try {
    //         realm.write(() => {
    //             realm.create('RuleDoc', { _id: new BSON.ObjectId(), workoutId: workoutId, rules: rules })
    //         })

    //     } catch (e) {
    //         logError(e, "RuleDocHelper:addRule")
    //     }
    // }

    // static updateRule(realm: Realm, rules: RuleItem[], workoutId: string, id: BSON.ObjectId) {
    //     LogService.infoFormat('RuleDocHelper; updateRule ');
    //     try {
    //         realm.write(() => {
    //             if (id != null) {
    //                 realm.create('RuleDoc', { _id: id, workoutId: workoutId, rules: rules }, UpdateMode.Modified);
    //             }
    //         })
    //     } catch (e) {
    //         logError(e, "RuleDocHelper:updateRule")
    //     }
    // }

    // static getRule(workoutId: string, realm: Realm,): RuleDoc2 | null {
    //     let filteredRule: RuleDoc2 | null = null;
    //     try {
    //         let queryResult = realm
    //             .objects(RuleDoc2)
    //             .filtered('workoutId==$0', workoutId);
    //         if (queryResult != null && queryResult.length > 0) {
    //             filteredRule = queryResult[0]
    //         }
    //     } catch (e) {
    //         logError(e, "RuleDocHelper:getRule:");
    //         console.log('addRule error:', e);
    //     }
    //     return filteredRule;
    // }

    static convertToPojo(rules: RuleItemDoc[]): RuleItem[] {
        let result: RuleItem[] = [];
        rules.forEach((rule) => {
            result.push({ id: rule.id, frequency: rule.frequency, unit: rule.unit, value: rule.value })
        })
        return result;
    }
}