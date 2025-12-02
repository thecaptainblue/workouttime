// import { useEffect, useRef } from "react";
// import { LogService } from "../services/Log/LogService";
// import { ServiceRegistry } from "../services/ServiceRegistry";
// import { SettingsService } from "../services/Settings/SettingsService";
// import { SettingsType } from "../services/Settings/SettingsType";
// import Tts from "react-native-tts";
// import LogHelper, { logError } from "../helper/LogHelper";

// export function useInitializeTts() {
//     let registry = ServiceRegistry.getInstance();
//     const settingsService = registry.getService(SettingsService.BaseName) as SettingsService;

//     const firstTimeCheck = useRef(true);
//     if (firstTimeCheck.current) {
//         try {
//             // LogService.infoFormat('useInitializeTts========================tts firstTime');

//             let defaultLanguage = 'en-US';
//             if (settingsService != null) {
//                 defaultLanguage = settingsService.getSetting(SettingsType.language)?.value as string;
//                 // LogService.infoFormat('settingsLanguage: {0}', defaultLanguage);
//             } else {
//                 // LogService.infoFormat('settings not initialized');
//             }
//             // LogService.infoFormat('defautlLanguage: {0}', defaultLanguage);
//             Tts.setDefaultLanguage(defaultLanguage); // causes layout change when called in useEffect!!
//             firstTimeCheck.current = false;
//         } catch (error) {
//             // LogService.infoFormat('useInitializeTts render error: {0}', LogHelper.toString(error));
//             logError(error);
//         }
//     }

//     useEffect(() => {
//         // LogService.infoFormat('useInitializeTts========================tts effect');
//         // // Tts.setDefaultVoice('com.apple.ttsbundle.Moira-compact');
//         // // Tts.setDefaultRate(0.5);
//         // // Tts.setDefaultPitch(1.5);
//         try {
//             Tts.setDucking(true);
//             Tts.getInitStatus().then(
//                 value => {
//                     if (value === 'success') {
//                         // LogService.infoFormat('Tts.getInitStatus() success');

//                         // Tts.setDefaultLanguage('en-IE');
//                         // Tts.voices().then(voices => {
//                         //   let tmpText = '';
//                         //   voices.forEach(value => (tmpText = tmpText + value + '\n'));

//                         //   LogService.debug(tmpText
//                         // });
//                         // setReady(true);
//                     } else {
//                         // LogService.infoFormat('Tts.getInitStatus() failed!!');
//                     }
//                 },
//                 err => {
//                     if (err.code === 'no_engine') {
//                         // LogService.infoFormat('Tts.getInitStatus() err!!: {0}', LogHelper.toString(err));
//                         Tts.requestInstallEngine();
//                     }
//                     logError(err);
//                 },
//             );
//         } catch (error) {
//             LogService.infoFormat('useInitializeTts error: {0}', LogHelper.toString(error));
//             logError(error);
//         }
//         return () => {
//             Tts.stop();
//             LogService.debug('Tts.stop!!');
//         };
//     }, []);
// }