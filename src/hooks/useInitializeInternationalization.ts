import { LogService } from "../services/Log/LogService";
import { ServiceRegistry } from "../services/ServiceRegistry";
import { SettingsService } from "../services/Settings/SettingsService";
import { SettingsType } from "../services/Settings/SettingsType";
import i18next from "i18next";

export function useInitializeInternationalization() {
    LogService.debug('useInitializeInternationalization======================== effect');
    const registry = ServiceRegistry.getInstance();
    if (registry) {
        const settingsService = registry.getService(SettingsService.BaseName) as SettingsService;

        let defaultLanguage = 'en-US';
        if (settingsService != null) {
            // LogService.debug('settingsLanguage', settingsService.getSetting(SettingsType.language));
            defaultLanguage = settingsService.getSetting(SettingsType.language)?.value as string;
        } else {
            LogService.debug('settings not initialized');
        }

        if (i18next.resolvedLanguage !== defaultLanguage) {
            LogService.debug('Internationalization change defautlLanguage', defaultLanguage);
            i18next.changeLanguage(defaultLanguage);
        }
    }
}