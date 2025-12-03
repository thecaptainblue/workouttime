import { Realm } from "@realm/react";
import { BSON, UpdateMode } from "realm";
import { logError } from "../helper/LogHelper";
import { convert, LocalDate, nativeJs } from "@js-joda/core";
import { TrackDoc } from "./TrackDoc";
import { LogService } from "../services/Log/LogService";
import { Track } from "../@types/goal/Track";
import { RuleItem } from "../@types/goal/RuleItem";
import { RuleDocHelper } from "./RuleDocHelper";

export class TrackDocHelper {
    static createTrack(workoutId: string, rules: RuleItem[]) {
        const newTrack = { id: new BSON.ObjectId(), workoutId: workoutId, active: true, startDate: LocalDate.now(), endDate: null, rule: { rules: rules } } satisfies Track;
        return newTrack;
    }

    static addTrack(realm: Realm, workoutId: string, active: boolean, startDate: LocalDate, endDate: LocalDate | null, rules: RuleItem[]) {
        // LogService.infoFormat('TrackDocHelper; addTrack ');
        try {
            const tmpStartDate = convert(startDate).toDate();
            const tmpEndDate = endDate != null ? convert(endDate).toDate() : null;
            realm.write(() => {
                realm.create('TrackDoc', { _id: new BSON.ObjectId(), workoutId: workoutId, active: active, startDate: tmpStartDate, endDate: tmpEndDate, rule: { rules: rules }, })
            })

        } catch (e) {
            logError(e, "TrackDocHelper:addTrack")
        }
    }

    static updateTrack(realm: Realm, id: BSON.ObjectId, active: boolean, endDate: LocalDate | null, rules: RuleItem[],) {
        // LogService.infoFormat('TrackDocHelper; updateTrack ');
        try {
            const tmpEndDate = endDate != null ? convert(endDate).toDate() : null;
            realm.write(() => {
                if (id != null) {
                    realm.create('TrackDoc', { _id: id, active: active, endDate: tmpEndDate, rule: { rules: rules } }, UpdateMode.Modified);
                }
            })
        } catch (e) {
            logError(e, "TrackDocHelper:updateTrack")
        }
    }

    static updateTrackAllFields(realm: Realm, id: BSON.ObjectId, active: boolean, startDate: LocalDate, endDate: LocalDate | null, rules: RuleItem[],) {
        // LogService.infoFormat('TrackDocHelper; updateTrackAllFields ');
        try {
            const tmpEndDate = endDate != null ? convert(endDate).toDate() : null;
            const tmpStartDate = convert(startDate).toDate();
            realm.write(() => {
                if (id != null) {
                    realm.create('TrackDoc', { _id: id, active: active, startDate: tmpStartDate, endDate: tmpEndDate }, UpdateMode.Modified);
                }
            })
        } catch (e) {
            logError(e, "TrackDocHelper:updateTrackAllFields")
        }
    }

    static getActiveTrack(realm: Realm, workoutId: string): TrackDoc | null {
        let filteredResult: TrackDoc | null = null;
        try {
            const queryResult = realm
                .objects(TrackDoc)
                .filtered('workoutId==$0 && active==$1', workoutId, true);
            if (queryResult != null && queryResult.length > 0) {
                filteredResult = queryResult[0]
            }
        } catch (e) {
            logError(e, "TrackDocHelper:getActiveTrack:");
            // console.log('getActiveTrack error:', e);
        }
        return filteredResult;
    }

    static getTrack(realm: Realm, id: BSON.ObjectId): TrackDoc | null {
        let filteredResult: TrackDoc | null = null;
        try {
            const queryResult = realm
                .objects(TrackDoc)
                .filtered('_id==$0 ', id);
            if (queryResult != null && queryResult.length > 0) {
                filteredResult = queryResult[0]
            }
        } catch (e) {
            logError(e, "TrackDocHelper:getActiveTrack:");
            // console.log('getActiveTrack error:', e);
        }
        return filteredResult;
    }

    static getTracks(realm: Realm, workoutId: string): Realm.Results<TrackDoc> {
        let filteredResult: Realm.Results<TrackDoc> = [] as unknown as Realm.Results<TrackDoc>;
        try {
            filteredResult = realm
                .objects(TrackDoc)
                .filtered('workoutId==$0 ', workoutId).sorted('startDate', true);
        } catch (e) {
            logError(e, "TrackDocHelper:getTracks:");
            // console.log('getTracks error:', e);
        }
        return filteredResult;
    }

    static deleteTrack(realm: Realm, id: BSON.ObjectId) {
        // LogService.infoFormat('TrackDocHelper; deleteTrack ');
        try {
            const toDelete = realm.objects(TrackDoc).filtered('_id=$0', id);
            realm.write(() => {
                realm.delete(toDelete)
            })
        } catch (e) {
            logError(e);
        }
    }

    static convert(trackDoc: TrackDoc | null): Track | null {
        let track: Track | null = null;
        if (trackDoc != null) {
            const startDate = nativeJs(trackDoc.startDate).toLocalDate();
            const endDate = trackDoc.endDate != null ? nativeJs(trackDoc.endDate).toLocalDate() : null;
            const rules = RuleDocHelper.convertToPojo(trackDoc.rule.rules);
            track = { id: trackDoc._id, workoutId: trackDoc.workoutId, active: trackDoc.active, startDate: startDate, endDate: endDate, rule: { rules: rules } } satisfies Track
        }
        return track;
    }
}