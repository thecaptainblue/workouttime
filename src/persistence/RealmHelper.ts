import { FSHelper } from "../helper/FSHelper";
import { logError } from "../helper/LogHelper";
import { LogService } from "../services/Log/LogService";
import { Realm } from "@realm/react";

export class RealmHelper {

    static getRealmDirectory(realm: Realm) {
        const realmPath = realm.path;
        return realmPath.substring(0, realmPath.lastIndexOf('/'));
    }

    static backupDB(realm: Realm) {
        LogService.infoFormat('backupDB starts');
        (async () => {
            try {
                const realmPath = realm.path;
                const realmDirectory = realmPath.substring(0, realmPath.lastIndexOf('/'));
                LogService.infoFormat('backupDB; version: {0} path:{1} directory:{2} ', realm.schemaVersion, realmPath, realmDirectory);
                const backupName = `backup-${realm.schemaVersion}.realm`;
                await FSHelper.exportDB(realmPath, realmDirectory, false, backupName);
            } catch (error) {
                logError(error, 'backupDB')
            }
        })();
        LogService.infoFormat('backupDB ends');
    }

    static backupDBSync(realm: Realm) {
        LogService.infoFormat('backupDBSync starts');
        try {
            const realmPath = realm.path;
            const realmDirectory = realmPath.substring(0, realmPath.lastIndexOf('/'));
            LogService.infoFormat('backupDBSync; version: {0} path:{1} directory:{2} ', realm.schemaVersion, realmPath, realmDirectory);
            const backupName = `backup-${realm.schemaVersion}.realm`;
            FSHelper.exportDBSync(realmPath, realmDirectory, backupName)
        } catch (error) {
            logError(error, 'backupDBSync')
        }
        LogService.infoFormat('backupDBSync ends');
    }

    static deleteBackups(realm: Realm) {
        LogService.infoFormat('deleteBackups starts');
        try {
            const realmPath = realm.path;
            const realmDirectory = this.getRealmDirectory(realm);
            LogService.infoFormat('deleteBackups; version: {0} path:{1} directory:{2} ', realm.schemaVersion, realmPath, realmDirectory);
            FSHelper.deleteBackupDBFiles(realmDirectory);
        } catch (error) {
            logError(error, 'backupDB')
        }
        LogService.infoFormat('deleteBackups ends');
    }

    static deleteBackupsSync(realm: Realm) {
        LogService.infoFormat('deleteBackups starts');
        try {
            const realmPath = realm.path;
            const realmDirectory = realmPath.substring(0, realmPath.lastIndexOf('/'));
            LogService.infoFormat('deleteBackups; version: {0} path:{1} directory:{2} ', realm.schemaVersion, realmPath, realmDirectory);
            FSHelper.deleteBackupDBFilesSync(realmDirectory);
        } catch (error) {
            logError(error, 'backupDB')
        }
        LogService.infoFormat('deleteBackups ends');
    }
}