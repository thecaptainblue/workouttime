import { Realm } from "@realm/react";
import { RuleItemDoc } from "./RuleItemDoc";
import { LogService } from "../services/Log/LogService";
import LogHelper, { logError } from "../helper/LogHelper";
import { BSON } from "realm";
import { convert, LocalDate } from "@js-joda/core";
import { FSHelper } from "../helper/FSHelper";
import { RealmHelper } from "./RealmHelper";

export const RealmSchemaVersion = 2;

export function RealmMigrationFunction(oldRealm: Realm, newRealm: Realm) {
    const oldSchemaVersion = oldRealm.schemaVersion;
    const migrationMap = new Map<number, (oldRealm: Realm, newRealm: Realm) => boolean>();
    migrationMap.set(0, RealmMigrationSchema0TrackCnange);
    try {
        RealmHelper.backupDBSync(oldRealm);
    } catch (error) {
        logError(error, 'RealmMigrationFunction:backupDBSync')
    }

    for (let version = oldSchemaVersion; version < RealmSchemaVersion; version++) {
        const migrationFunction = migrationMap.get(version);
        const isSuccess = migrationFunction?.(oldRealm, newRealm);
        if (isSuccess == false) {
            LogService.infoFormat('RealmMigrationFunction; version:{0} failed , abort', version);
            break;
        }
    }

    // deleteBackups(oldRealm);
    // deleteBackupsSync(oldRealm);
}

/*
 * TrackDoc schemasi olusturdum ve RuleDoc'u altina embedded schema olarak verdim.
 * @param oldRealm 
 * @param newRealm 
 */
function RealmMigrationSchema0TrackCnange(oldRealm: Realm, newRealm: Realm): boolean {
    LogService.infoFormat('RealmMigrationSchema0TrackCnange');
    let isSuccess = true;
    try {
        if (oldRealm.schema.some((schema) => schema.name === 'RuleDoc')) {
            const oldObjects = oldRealm.objects('RuleDoc');
            const startDate = convert(LocalDate.now().minusYears(1)).toDate();

            for (let i = 0; i < oldObjects.length; i++) {
                const oldRuleDoc = oldObjects[i];
                LogService.infoFormat('list size : {0}, oldRule:{1}', oldObjects.length, LogHelper.toString(oldRuleDoc));

                const trackId = new BSON.ObjectId();
                newRealm.create('TrackDoc', { _id: trackId, workoutId: oldRuleDoc.workoutId, active: true, startDate: startDate, endDate: null, rule: { rules: oldRuleDoc.rules as RuleItemDoc[] | undefined } });
            }

            newRealm.objects('TrackDoc').forEach((track, index, array) => {
                LogService.infoFormat('track list size : {0}, track:{1}', array.length, LogHelper.toString(track));
            })
        }
    } catch (error) {
        isSuccess = false;
        logError(error, 'RealmMigrationSchema0TrackCnange');
    }
    return isSuccess;
}

