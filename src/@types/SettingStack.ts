import { NativeEventEmitter } from "react-native";

export type SettingStackParamList = {
    SettingsHome: undefined;
    SettingsLanguage: { currentLanguage: string; };
    SettingsTest: undefined;
    SettingsExport: undefined;
};