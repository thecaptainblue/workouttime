import { NativeModules, UIManager, I18nManager } from "react-native";
import { IService } from "../IService";
import { ServiceBase } from "../ServiceBase";
import { IPlatformService } from "./IPlatformService";

export class PlatformAndroidService extends ServiceBase implements IPlatformService, IService {
    static BaseName: string = 'PlatformAndroidService';
    name: string = PlatformAndroidService.BaseName;

    getLangualeLocale(): string | null | undefined {
        // rn yeni mimari ile birlikte asagidaki kod calismamaya basladi onun yerine bir sonraki satirdaki kodu kullaniyorum.
        // let languagePrefix = NativeModules.I18nManager.localeIdentifier as string;
        let languagePrefix = I18nManager.getConstants().localeIdentifier;
        // console.log("getLangualeLocale languagePrefix : ", languagePrefix);
        if (languagePrefix != null) {
            languagePrefix = languagePrefix.replace('_', '-');
        }

        // console.log('language: ', languagePrefix);
        return languagePrefix;
        //     const deviceLanguage =
        //   Platform.OS === 'ios'
        //     ? NativeModules.SettingsManager.settings.AppleLocale ||
        //       NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13
        //     : NativeModules.I18nManager.localeIdentifier;
    }

    initialize(): void {
        // TODO yeni mimari ile buna ihtiyac kalmadi gibi 
        // eger ihtiyac olursa LayoutAnimation.configureNext kullanilmasini tavsiye ediyor
        // this.setAnimationLayoutConfig();
    }
    finalize(): void {
    }

    private setAnimationLayoutConfig() {
        // if (Platform.OS === 'android') {
        UIManager.setLayoutAnimationEnabledExperimental &&
            UIManager.setLayoutAnimationEnabledExperimental(true);
        //   }
    }
}