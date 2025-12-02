import { KeyValuePair } from "../../@types/KeyValuePair";
import { SettingItem } from "../../@types/SettingItem";
import { JsHelper } from "../../helper/JsHelper";
import { ResKey } from "../../lang/ResKey";
import { FSName } from "../FS/FSName";
import { FSService } from "../FS/FSService";
import { IService } from "../IService";
import { LogService } from "../Log/LogService";
import { ServiceBase } from "../ServiceBase";
import { ServiceRegistry } from "../ServiceRegistry";
import { IPlatformService } from "../platform/IPlatformService";
import { PlatformAndroidService } from "../platform/PlatformAndroidService";
import { SettingsType } from "./SettingsType";
import { String } from 'typescript-string-operations';


export class SettingsService extends ServiceBase implements IService {
    static BaseName = 'SettingsService';
    name: string = SettingsService.BaseName;

    private fsService: FSService | null = null;
    private platformService: IPlatformService | null = null;

    private settings: Map<string, SettingItem> = new Map<string, SettingItem>();
    private languages: Map<string, string> = new Map<string, string>();

    getSettings(): SettingItem[] {
        let result: SettingItem[] = [];
        if (this.settings != null) {
            this.settings.forEach((tmpSettingItem) => result.push(tmpSettingItem));
        }

        return result;
    }

    getLanguages(): KeyValuePair<string, string>[] {
        let result: KeyValuePair<string, string>[] = [];
        this.languages.forEach((value, key) => { result.push({ key: key, value: value }) });
        return result;
    }

    initialize(): void {
        LogService.debug('SettingsService initialize')
        let serviceRegistry = ServiceRegistry.getInstance();
        this.fsService = serviceRegistry.getService(FSService.BaseName) as FSService;
        this.platformService = serviceRegistry.getService(PlatformAndroidService.BaseName) as IPlatformService;
        this.initializeLanguages();
        this.initializeSettings();
    }

    initializeSettings(): void {
        LogService.debug('initializeSettings========================');

        let tmpSettings = this.loadSettings();
        // let tmpSettings = null; // test

        if (tmpSettings == null || tmpSettings == undefined) {
            LogService.debug('tmpSettings is null');
            tmpSettings = new Map<string, SettingItem>();
            let tmpSetting: SettingItem;

            let defaultLanguagePrefix = this.platformService?.getLangualeLocale();
            LogService.debug(String.format('defaultLanguagePrefix: {0}', defaultLanguagePrefix));
            if (defaultLanguagePrefix != null) {
                // console.log('lanugages ', this.languages);
                let valueText = this.getLanguage(defaultLanguagePrefix);
                LogService.debug(String.format('valueText: {0}', valueText));
                if (valueText == null) {
                    valueText = defaultLanguagePrefix;
                }

                //todo:  valueTexte gerek yok bunu languageden yada genel olarak resource servisinden alabilirler.

                tmpSetting = new SettingItem(SettingsType.language, ResKey.Language, defaultLanguagePrefix, valueText)
                tmpSettings.set(tmpSetting.key, tmpSetting);
            }
            else {
                tmpSetting = new SettingItem(SettingsType.language, ResKey.Language, 'en-US', 'English')
                tmpSettings.set(tmpSetting.key, tmpSetting);
            }

            // tmpSetting = new SettingItem('item2', 'AnotherSetting', 'someValue', 'valueText')
            // tmpSettings.set(tmpSetting.key, tmpSetting);

            // this.changeSetting(tmpSetting);
            this.saveSettings(tmpSettings);
        }
        this.settings = tmpSettings;
        LogService.debug(String.format('initializeSettings: {0}', tmpSettings));
    }

    initializeLanguages(): void {
        this.languages.clear();
        this.languages.set('tr-TR', 'Türkçe');
        this.languages.set('en-US', 'English');
    }

    finalize(): void {
        this.fsService = null;
        this.platformService = null;
    }

    getSetting(settingKey: string): SettingItem | undefined {
        return this.settings.get(settingKey);
    }

    getLanguage(languageKey: string): string | undefined {
        return this.languages.get(languageKey);
    }

    changeSetting(setting: SettingItem) {
        this.settings.set(setting.key, setting);
        this.saveSettings(this.settings);
    }

    private saveSettings(settings: Map<string, SettingItem>) {
        // let jsonSettings: string = JSON.stringify(settings, JsonMapHelper.replacer);
        let jsonSettings: string = JsHelper.stringify(settings);
        // console.log('saveSettings jsonSettings:', jsonSettings);
        this.fsService?.save(FSName.Settings, jsonSettings);
    }

    private loadSettings(): Map<string, SettingItem> | null | undefined {
        let settings: Map<string, SettingItem> | null = null;

        if (this.fsService?.hasKey(FSName.Settings)) {
            let jsonSettings = this.fsService?.get(FSName.Settings);
            // console.log('loadSettings jsonSettings:', jsonSettings);
            if (jsonSettings != null) {
                // settings = JSON.parse(jsonSettings, JsonMapHelper.reviver);
                settings = JsHelper.parse(jsonSettings);
                LogService.debug(String.format('loadSettings settings: {0}', settings))
                // console.log('loadSettings settings:', settings);
            }
        }

        return settings;
    }

}