import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, DeviceEventEmitter} from 'react-native';
import {ColorConstants, FontConstants, SizeConstants} from '../../constants/StyleConstants';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import ScrollContainer from '../../components/ScrollContainer';
import {LogService} from '../../services/Log/LogService';
import {SettingStackParamList} from '../../@types/SettingStack';
import {ServiceRegistry} from '../../services/ServiceRegistry';
import {SettingsService} from '../../services/Settings/SettingsService';
import {String} from 'typescript-string-operations';
import {KeyValuePair} from '../../@types/KeyValuePair';
import {ScreenEventNames} from '../Screens/Events/ScreenEventNames';
import {LanguageItemButton} from '../../components/Settings/LanguageItemButton';

type SettingsLanguageProps = NativeStackScreenProps<SettingStackParamList, 'SettingsLanguage'>;
const SettingsLanguage = (props: SettingsLanguageProps) => {
  const [languages, setLanguages] = useState<KeyValuePair<string, string>[]>([]);
  const currentLanguagePrefix = props.route.params.currentLanguage;

  useEffect(() => {
    LogService.debug('start=========-----------------------SettingsLanguage');
    let registry = ServiceRegistry.getInstance();
    let settingsService = registry.getService(SettingsService.BaseName) as SettingsService;
    if (settingsService != null) {
      LogService.debug(String.format('settings length {0}', settingsService.getLanguages().length));
      setLanguages(settingsService.getLanguages());
    }
  }, []);

  const handleSelectLanguage = useCallback(
    (languagePrefix: string) => {
      // let currentLanguage = props.route.params.currentLanguage;
      if (languagePrefix !== currentLanguagePrefix) {
        DeviceEventEmitter.emit(ScreenEventNames.SettingsLanguageSelectedChanged, languagePrefix);
      }
      props.navigation.goBack();
    },
    [currentLanguagePrefix],
  );

  LogService.debug('rerender SettingsLanguage');
  return (
    <ScrollContainer>
      {languages.map(item => {
        return (
          <LanguageItemButton
            key={item.key}
            item={item}
            isSelected={item.key == currentLanguagePrefix}
            handleSelectLanguage={handleSelectLanguage}
          />
        );
      })}
    </ScrollContainer>
  );
};

export default SettingsLanguage;
