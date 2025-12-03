import { Realm } from "@realm/react";
import { BSON, UpdateMode } from "realm";
import { logError } from "../helper/LogHelper";
import { convert, LocalDate, nativeJs } from "@js-joda/core";
import { LogService } from "../services/Log/LogService";
import { SystemDoc, } from "./SystemDoc";


const SystemDocConstants = {
    SystemId: "systemSingleton"
}
export class SystemDocHelper {

    static createSystem() {
        const newTrack = { _id: SystemDocConstants.SystemId, isFirstUsage: true, };
        return newTrack;
    }

    static addUpdateSystem(realm: Realm, isFirstUsage: boolean) {
        // LogService.infoFormat('SystemDocHelper; addSystem ');
        try {

            realm.write(() => {
                realm.create('SystemDoc', { _id: SystemDocConstants.SystemId, isFirstUsage: isFirstUsage, })
            })

        } catch (e) {
            logError(e, "SystemDocHelper:addSystem")
        }
    }

    static getSystem(realm: Realm): SystemDoc | null {
        let filteredResult: SystemDoc | null = null;
        try {
            const queryResult = realm
                .objects(SystemDoc)
                .filtered('_id==$0 ', SystemDocConstants.SystemId);
            if (queryResult != null && queryResult.length > 0) {
                filteredResult = queryResult[0]
            }
        } catch (e) {
            logError(e, "SystemDocHelper:getSystem:");
            // console.log('getActiveTrack error:', e);
        }
        return filteredResult;
    }
}