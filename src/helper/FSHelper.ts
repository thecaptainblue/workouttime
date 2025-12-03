import { PermissionsAndroid, Platform, NativeModules } from "react-native";
import { JsHelper } from "./JsHelper";
import Toast from "react-native-toast-message";
import i18n from 'i18next'
import { ResKey } from "../lang/ResKey";
import { LogService } from "../services/Log/LogService";
// import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import { logError } from "./LogHelper";
import { Base64 } from 'js-base64';
import { WorkoutExportData } from "../@types/Data/WorkoutExportData";
import RNFS from 'react-native-fs';

const { FileModule } = NativeModules;
export const FSConstants = {
    encoding: 'utf8',
    ExportedDBName: 'exported.realm'
}

export class FSHelper {

    static async hasWriteExternalStoragePermission() {
        let result = false
        if (Platform.Version as number >= 33) {
            result = true;
        } else {
            const hasPermission = await PermissionsAndroid.check('android.permission.WRITE_EXTERNAL_STORAGE');
            if (hasPermission) {
                result = true;
            } else {
                const status = await this.askWriteExternalStoragePermission();
                if (status == 'granted') {
                    result = true;
                }
            }
        }
        return result;
    }

    static async hasReadExternalStoragePermission() {
        let result = false
        if (Platform.Version as number >= 33) {
            result = true;
        } else {
            const hasPermission = await PermissionsAndroid.check('android.permission.READ_EXTERNAL_STORAGE');
            if (hasPermission) {
                result = true;
            } else {
                const status = await this.askReadExternalStoragePermission();
                if (status == 'granted') {
                    result = true;
                }
            }
        }
        return result;
    }

    static async askWriteExternalStoragePermission() {
        const status = await PermissionsAndroid.request('android.permission.WRITE_EXTERNAL_STORAGE', {
            title: "Storage Permission",
            message: 'This app needs access to storage',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK'
        });
        return status;
    }

    static async askReadExternalStoragePermission() {
        const status = await PermissionsAndroid.request('android.permission.READ_EXTERNAL_STORAGE', {
            title: "Storage Permission",
            message: 'This app needs access to storage',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK'
        });
        return status;
    }

    // static async saveToDownload(filename: string, workout: WorkoutData) {
    //     const jsonText: string = JsHelper.stringify(workout);
    //     const directory = RNFS.DownloadDirectoryPath;
    //     const filepath = `${directory}/${filename}`;
    //     await RNFS.writeFile(filepath, jsonText, FSConstants.encoding);

    // }

    static async saveFileAskFirst(filename: string, exportData: WorkoutExportData, isEncoded?: boolean) {
        // TODO yukseltme
        // const hasPermission = await this.hasWriteExternalStoragePermission();
        // const t = i18n.t;
        // if (hasPermission) {
        //     try {
        //         const res = await DocumentPicker.pickDirectory();
        //         // LogService.infoFormat(' selectedDirectory {0}', res?.uri);

        //         const tmpFileName = filename.replaceAll(' ', '_');
        //         // const filepath = `${res?.uri}/${filename.replaceAll(' ', '_')}.${FSConstants.fileExtention}`;

        //         try {
        //             const jsonText = JsHelper.stringify(exportData);
        //             let textToWrite = jsonText;
        //             if (isEncoded == true) {
        //                 textToWrite = Base64.encode(jsonText);
        //             }

        //             FileModule.writeToFile(res?.uri, tmpFileName, textToWrite)
        //                 .then((result: any) => {
        //                     Toast.show({
        //                         type: 'info',
        //                         text1: t(ResKey.InfoExportSuccess),
        //                     });
        //                 })
        //                 .catch((error: any) => {
        //                     Toast.show({
        //                         type: 'error',
        //                         text1: t(ResKey.ErrorExportFailure),
        //                     });
        //                     logError(error)
        //                 });

        //         } catch (error) {
        //             // LogService.infoFormat(' file write error: {0}', LogHelper.toString(error));
        //             // console.info(' file write error: ', error);
        //             logError(error);
        //         }
        //     } catch (error) {
        //         if (DocumentPicker.isCancel(error)) {
        //             LogService.debugFormat('user canceled directory picker')
        //         }
        //         logError(error);
        //     }

        // } else {
        //     Toast.show({
        //         type: 'info',
        //         text1: t(ResKey.InfoExternalWritePermission),
        //     });
        // }
    }

    static async browseReadFileAskFirst(isEncoded?: boolean): Promise<WorkoutExportData | null> {
        return null;
        // TODO yukseltme
        // let result: WorkoutExportData | null = null
        // const hasPermission = await this.hasReadExternalStoragePermission();
        // const t = i18n.t;
        // if (hasPermission) {
        //     try {
        //         // Pick a document (file)
        //         const res: DocumentPickerResponse[] = await DocumentPicker.pick({
        //             type: [DocumentPicker.types.plainText],  // Adjust the file types you want to allow
        //         });

        //         let content: string | null = null;
        //         if (res && res.length > 0) {
        //             const contentUri = res[0].uri;

        //             // Call the native module method to read the file using the content URI
        //             content = await FileModule.readFromFile(contentUri);
        //             // LogService.infoFormat(' browseReadFileAskFirst content: {0}', content);
        //         }

        //         try {
        //             if (content != null) {
        //                 if (isEncoded == true) {
        //                     const decodedText = Base64.decode(content);
        //                     // LogService.infoFormat(' browseReadFileAskFirst decodedText: {0}', decodedText);
        //                     content = decodedText;
        //                 }

        //                 result = JsHelper.parse(content);
        //                 // LogService.infoFormat(' browseReadFileAskFirst workout: {0}', LogHelper.toString(result));
        //             }

        //         } catch (error) {
        //             logError(error);
        //         }

        //     } catch (error) {
        //         if (DocumentPicker.isCancel(error)) {
        //             LogService.debugFormat('user canceled directory picker')
        //         }
        //         logError(error);
        //     }

        // } else {
        //     Toast.show({
        //         type: 'info',
        //         text1: t(ResKey.InfoExternalReadPermission),
        //     });
        // }
        // return result;
    }

    static async writeFile(filePath: string, filename: string, fileContent: string, isEncoded?: boolean, successMessage?: string, errorMessage?: string) {
        // TODO yukseltme
        // let contentToWrite = fileContent;
        // try {

        //     if (isEncoded == true) {
        //         contentToWrite = Base64.encode(fileContent);
        //     }
        //     FileModule.writeToFile(filePath, filename, contentToWrite)
        //         .then((result: any) => {
        //             if (successMessage != null) {
        //                 Toast.show({
        //                     type: 'info',
        //                     text1: successMessage,
        //                 });
        //             }
        //         })
        //         .catch((error: any) => {
        //             if (errorMessage != null) {
        //                 Toast.show({
        //                     type: 'error',
        //                     text1: errorMessage,
        //                 });
        //             }
        //             logError(error)
        //         });
        // } catch (error) {
        //     logError(error, "writeFile");
        // }
    }

    static async readFile(filePath: string, isEncoded?: boolean): Promise<string | null> {
        // TODO yukseltme
        return null;
        // let content: string | null = null;
        // try {
        //     // Call the native module method to read the file using the content URI
        //     content = await FileModule.readFromFile(filePath);
        //     // LogService.infoFormat(' readFile filePath: {0}', filePath);
        //     try {
        //         if (content != null) {
        //             if (isEncoded == true) {
        //                 const decodedText = Base64.decode(content);
        //                 content = decodedText;
        //             }
        //         }
        //     } catch (error) {
        //         logError(error, "readFile");
        //     }

        // } catch (error) {
        //     logError(error, "readFile");
        // }
        // return content;
    }

    static async getDownloadsDirectoryUri(): Promise<string> {
        const uri = await FileModule.getDownloadsDirectoryUri();
        return uri;
    }

    static async exportDB(realmPath: string, exportDirectory: string, isEncoded?: boolean, newFileName?: string) {
        // TODO yukseltme
        // // try {
        // //   // works
        // //   const exportPath = `${RNFS.DownloadDirectoryPath}/exported.realm`;
        // //   LogService.infoFormat('exportRealm; path: {0} exportPath: {1}', realmPath, exportPath);
        // //   await RNFS.copyFile(realmPath, exportPath);

        // // } catch (err) {
        // //   logError(err);
        // // }

        // try {
        //     // works
        //     //   const exportPath = `${RNFS.DownloadDirectoryPath}/exported.realm`;
        //     const exportPath = `${exportDirectory}/${newFileName != null ? newFileName : FSConstants.ExportedDBName}`;
        //     LogService.infoFormat('exportRealm; path: {0} exportPath: {1}', realmPath, exportPath);
        //     let fileContent = await RNFS.readFile(realmPath, 'base64');
        //     if (isEncoded == true) {
        //         fileContent = Base64.encode(fileContent);
        //     }
        //     await RNFS.writeFile(exportPath, fileContent, 'base64');
        // } catch (err) {
        //     logError(err, 'exportDB');
        // }

        // // bu calismiyor, yazma islemi sirasinda contentUriye ihtiyac var, download dizini yazilimsal olarak bulamiyorum (kabul goren),
        // // sabit versem de izin sorunu cikartiyor, uzun is

        // // try {
        // //     // FSHelper.hasWriteExternalStoragePermission();
        // //     const realmFileUri = `file://${realmPath}`;
        // //     // const exportPath = `file://${RNFS.DownloadDirectoryPath}/exported.realm`;
        // //     // const exportPath = await FSHelper.getDownloadsDirectoryUri();
        // //     // const exportPath = 'content://com.android.externalstorage.documents/document/primary:Download/'; //calismiyor
        // //     // const exportPath = 'content://com.android.externalstorage.documents/tree/document/primary:Download/Fer'; //calismiyor
        // //     const exportPath = 'content://com.android.externalstorage.documents/tree/primary%3ADownload%2FFer'; // calisiyor
        // //     // const exportPath = 'content://com.android.externalstorage.documents/tree/primary%3ADownload%2F'; // calismiyor

        // //     LogService.infoFormat('exportRealm;  exportPath: {0}', exportPath);
        // //     const fileName = 'exported.realm';
        // //     const fileContent = await FSHelper.readFile(realmFileUri);
        // //     if (fileContent != null) {
        // //       await FSHelper.writeFile(exportPath, fileName, fileContent, true);
        // //     }
        // //   } catch (error) {
        // //     logError(error);
        // //   }
    }

    static async importDB(realmPath: string, importDirectory: string) {
        // TODO yukseltme
        // //////////////////////////////////////
        // // try {
        // //   // works
        // //   const exportPath = `${RNFS.DownloadDirectoryPath}/exported.realm`;
        // //   LogService.infoFormat('exportRealm; path: {0} exportPath: {1}', realmPath, exportPath);
        // //   await RNFS.copyFile(exportPath, realmPath);
        // // } catch (err) {
        // //   logError(err);
        // // }
        // //////////////////////////////////////
        // try {
        //     // works
        //     //   const exportPath = `${RNFS.DownloadDirectoryPath}/exported.realm`;
        //     const importPath = `${importDirectory}/${FSConstants.ExportedDBName}`;
        //     LogService.infoFormat('exportRealm; path: {0} importPath: {1}', realmPath, importPath);
        //     const fileContent = await RNFS.readFile(importPath, 'base64');
        //     const decodedFile = Base64.decode(fileContent);
        //     // const newExportPath = `${RNFS.DownloadDirectoryPath}/decoded.realm`;
        //     await RNFS.writeFile(realmPath, decodedFile, 'base64');
        // } catch (err) {
        //     logError(err, 'importDB');
        // }
    }

    static exportDBSync(realmPath: string, exportDirectory: string, newFileName?: string) {
        // TODO yukseltme
        // try {
        //     //   const exportPath = `${RNFS.DownloadDirectoryPath}/exported.realm`;
        //     const exportPath = `${exportDirectory}/${newFileName != null ? newFileName : FSConstants.ExportedDBName}`;
        //     LogService.infoFormat('exportDBSync; path: {0} exportPath: {1}', realmPath, exportPath);
        //     const result = FileModule.copyFileSync(realmPath, exportPath);
        //     LogService.infoFormat('exportDBSync;  result: {0}', result);
        // } catch (err) {
        //     logError(err, 'exportDBSync');
        // }
    }

    static async deleteBackupDBFiles(directoryPath: string) {
        // const isExists =RNFS.exists(directoryPath);
        const directoryItems = await RNFS.readDir(directoryPath);
        let backupFiles = [];
        for (let directoryItem of directoryItems) {
            if (directoryItem.isFile() && directoryItem.name.includes('backup') && directoryItem.name.includes('.realm')) {
                backupFiles.push(directoryItem);
            }
        }
        for (let backupFile of backupFiles) {
            LogService.infoFormat('deleteBackupDBFiles {0}', backupFile.path);
            await RNFS.unlink(backupFile.path);
        }
    }

    static deleteBackupDBFilesSync(directoryPath: string) {
        // const isExists =RNFS.exists(directoryPath);
        const directoryItems: string[] = FileModule.listFilesSync(directoryPath);
        let backupFileNames = [];
        for (let directoryItem of directoryItems) {
            if (directoryItem.includes('backup') && directoryItem.includes('.realm')) {
                backupFileNames.push(directoryItem);
            }
        }
        for (let backupFileName of backupFileNames) {
            const backupFilePath = `${directoryPath}/${backupFileName}`
            LogService.infoFormat('deleteBackupDBFiles {0}', backupFilePath);
            FileModule.deleteFileSync(backupFilePath);
        }
    }
}