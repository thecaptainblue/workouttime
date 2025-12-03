import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { ColorConstants, FontConstants, SizeConstants } from '../../constants/StyleConstants';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScrollContainer from '../../components/ScrollContainer';
import { LogService } from '../../services/Log/LogService';
// import Tts from 'react-native-tts';
import { SettingStackParamList } from '../../@types/SettingStack';
import { SettingItem } from '../../@types/SettingItem';
import { ServiceRegistry } from '../../services/ServiceRegistry';
import { SettingsService } from '../../services/Settings/SettingsService';
import { String } from 'typescript-string-operations';
import { SettingsType } from '../../services/Settings/SettingsType';
import { DeviceEventEmitter } from 'react-native';
import { ScreenEventNames } from '../Screens/Events/ScreenEventNames';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import { ResKey } from '../../lang/ResKey';
import { ScreenNames } from '../Screens/ScreenNames';
import { MenuButton } from '../../components/MenuButton';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FSHelper } from '../../helper/FSHelper';
import { logError } from '../../helper/LogHelper';
// import { useDispatch } from 'react-redux';
import { WorkoutService } from '../../services/WorkoutService';
import { v4 } from 'uuid';
import { WorkoutHelper } from '../../@types/Data/WorkoutHelper';
// import { AddWorkout, AddWorkouts, PayloadAddWorkout, PayloadAddWorkouts } from '../../store/features/workoutsSlice';
import Toast from 'react-native-toast-message';
// import { ExportImportHelper } from '../../helper/WorkoutExportImportHelper';
import { WorkoutData } from '../../@types/Data/WorkoutData';
// import { useRealm } from '@realm/react';
import { EventName } from '../../@types/EventNames';
import RNFS from 'react-native-fs';

const iconExport = (
  <MaterialCommunityIcon name="export" size={FontConstants.sizeLargeX} color={ColorConstants.analogous2} />
);

const iconImport = (
  <MaterialCommunityIcon name="import" size={FontConstants.sizeLargeX} color={ColorConstants.analogous2} />
);

const iconExportAll = (
  <MaterialCommunityIcon name="file-export" size={FontConstants.sizeLargeX} color={ColorConstants.analogous2} />
);

const iconImportAll = (
  <MaterialCommunityIcon name="file-import" size={FontConstants.sizeLargeX} color={ColorConstants.analogous2} />
);

type SettingsHomeProps = NativeStackScreenProps<SettingStackParamList, 'SettingsHome'>;
const SettingsHome = (props: SettingsHomeProps) => {
  const [settingItems, setSettingItems] = useState<SettingItem[]>([]);
  const settingsServiceRef = useRef<SettingsService | null>(null);
  const workoutServiceRef = useRef<WorkoutService | null>(null);
  const { t } = useTranslation();
  // TODO yukseltme
  // const dispatch = useDispatch();
  // const realm = useRealm();

  useEffect(() => {
    LogService.debug('SettingsHome=========-----------------------start');
    const registry = ServiceRegistry.getInstance();
    const settingsService = registry.getService(SettingsService.BaseName) as SettingsService;
    if (settingsService != null) {
      settingsServiceRef.current = settingsService;
      LogService.debug(String.format('settings length {0}', settingsService.getSettings().length));
      setSettingItems(settingsService.getSettings());
    }
    workoutServiceRef.current = registry.getService(WorkoutService.Basename) as WorkoutService;
  }, []);

  useEffect(() => {
    LogService.debug('SettingsHome=========-----------------------EventEmitter');
    let eventListener = DeviceEventEmitter.addListener(
      ScreenEventNames.SettingsLanguageSelectedChanged,
      handleLanguageChange,
    );

    return () => {
      eventListener.remove();
    };
  }, []);

  const handleLanguageChange = useCallback((languageKey: string) => {
    LogService.debug('handleLanguageChange called');
    let settingsService = settingsServiceRef.current;

    if (settingsService != null) {
      let languageText = settingsService.getLanguage(languageKey) as string;

      settingsService.changeSetting(new SettingItem(SettingsType.language, ResKey.Language, languageKey, languageText));
      // todo: bunu servis uzerinden yapmam lazim.
      // Tts.setDefaultLanguage(languageKey);//TODO yukseltme 
      i18next.changeLanguage(languageKey);
      setSettingItems(settingsService.getSettings());
    }
  }, []);

  const handleExportPressed = useCallback(() => {
    // props.navigation.navigate(ScreenNames.SettingsExport); //TODO yukseltme
  }, []);

  const handleExportAllPressed = useCallback(async () => {
    // LogService.infoFormat('handleExportAllPressed');
    const isPerrmisionGranted = await FSHelper.hasWriteExternalStoragePermission();
    const workoutService = workoutServiceRef.current;
    const workouts = workoutService?.getWorkouts();
    if (isPerrmisionGranted && workouts != null) {
      //TODO yukseltme 
      // const fileName = ExportImportHelper.createAllWorkoutsFileName();
      // // await FSHelper.saveToDownload(fileName, workout);
      // const exportData = ExportImportHelper.createExportData(workouts);
      // await FSHelper.saveFileAskFirst(fileName, exportData, true);
      // // LogService.infoFormat('handleExportAllPressed, file exported {0}', fileName);
    }
  }, []);

  const handleImportPressed = useCallback(() => {
    //TODO yukseltme 
    // // props.navigation.navigate(ScreenNames.SettingsExport);
    // FSHelper.browseReadFileAskFirst(true)
    //   .then(exportData => {
    //     // LogService.debugFormat('importFileIntoWorkout, file content {0}', LogHelper.toString(exportData));
    //     const workoutService = workoutServiceRef.current;
    //     if (
    //       exportData != null &&
    //       exportData.workouts != null &&
    //       exportData.workouts.length > 0 &&
    //       exportData.workouts[0] != null
    //     ) {
    //       if (workoutService != null) {
    //         const workouts = workoutService.getWorkouts();
    //         const workout = exportData.workouts[0];
    //         const newWorkout = WorkoutHelper.createWorkoutDistinct(workout, workouts, v4);
    //         workoutService?.addWorkout(newWorkout);
    //         dispatch(AddWorkout({ workout: newWorkout } satisfies PayloadAddWorkout));
    //         Toast.show({
    //           type: 'info',
    //           text1: t(ResKey.InfoImportSuccess),
    //         });
    //         //todo: yeni workoutun kaydedilememesini de ele al (hata akisi)
    //       }
    //     } else {
    //       Toast.show({
    //         type: 'error',
    //         text1: t(ResKey.ErrorImportStructureFailure),
    //       });
    //     }
    //   })
    //   .catch(error => {
    //     logError(error);
    //     Toast.show({
    //       type: 'error',
    //       text1: t(ResKey.ErrorImportFailure),
    //     });
    //   });
  }, []);

  const handleImportAllPressed = useCallback(() => {
    //TODO yukseltme 
    // // props.navigation.navigate(ScreenNames.SettingsExport);
    // FSHelper.browseReadFileAskFirst(true)
    //   .then(exportData => {
    //     // LogService.debugFormat('importFileIntoWorkout, file content {0}', LogHelper.toString(exportData));
    //     const workoutService = workoutServiceRef.current;
    //     if (exportData != null && exportData.workouts != null && exportData.workouts.length > 0) {
    //       if (workoutService != null) {
    //         const workouts = workoutService.getWorkouts();
    //         let newWorkouts: WorkoutData[] = [];
    //         exportData.workouts.forEach(item => {
    //           const newWorkout = WorkoutHelper.createWorkoutDistinct(item, workouts, v4);
    //           newWorkouts.push(newWorkout);
    //         });

    //         workoutService.addWorkouts(newWorkouts);
    //         dispatch(AddWorkouts({ workouts: newWorkouts } satisfies PayloadAddWorkouts));

    //         Toast.show({
    //           type: 'info',
    //           text1: t(ResKey.InfoImportSuccess),
    //         });
    //         //todo: yeni workoutun kaydedilememesini de ele al (hata akisi)
    //       }
    //     } else {
    //       Toast.show({
    //         type: 'error',
    //         text1: t(ResKey.ErrorImportStructureFailure),
    //       });
    //     }
    //   })
    //   .catch(error => {
    //     logError(error);
    //     Toast.show({
    //       type: 'error',
    //       text1: t(ResKey.ErrorImportFailure),
    //     });
    //   });
  }, []);

  const reopenRealm = useCallback(() => {
    DeviceEventEmitter.emit(EventName.RealmEventReopen);
  }, []);

  const handleExportDBPressed = useCallback(async () => {
    //TODO yukseltme 
    // // LogService.infoFormat('handleExportDBPressed');
    // const realmPath = realm.path;
    // // realm kapatip acma islemi olmadan da calisiyor gibi
    // // realm.close();
    // await FSHelper.exportDB(realmPath, RNFS.DownloadDirectoryPath, true);
    // // reopenRealm();
  }, []);

  const handleImportDBPressed = useCallback(async () => {
    //TODO yukseltme 
    // // LogService.infoFormat('handleImportDBPressed');
    // const realmPath = realm.path;
    // // realm kapatip acma islemi olmadan release'de calismiyor!
    // realm.close();
    // await FSHelper.importDB(realmPath, RNFS.DownloadDirectoryPath);
    // reopenRealm();
  }, []);

  LogService.debug('rerender SettingsHome');
  //// todo: sitil calismasi yapacagim.
  return (
    <ScrollContainer>
      {/* <Text style={styles.welcome}>Hello {name}</Text> */}

      {settingItems.map(settingItem => {
        return (
          <Pressable
            key={settingItem.key}
            style={styles.settingsItem}
            onPress={() =>
              props.navigation.navigate(ScreenNames.SettingsLanguage, {
                currentLanguage: settingItem.value,
              })
            }>
            <Text style={styles.settingsItemKey}> {t(settingItem.keyText)}</Text>
            <Text style={styles.settingsItemValue}> {settingItem.valueText}</Text>
          </Pressable>
        );
      })}
      <View style={styles.separator} />
      <MenuButton
        style={styles.menuButtonContainerStyle}
        textStyle={styles.menuButtonText}
        contentStyle={styles.menuButtonContentStyle}
        text={t(ResKey.SettingsExport)}
        icon={iconExport}
        onPress={() => handleExportPressed()}
      />
      <MenuButton
        style={styles.menuButtonContainerStyle}
        textStyle={styles.menuButtonText}
        contentStyle={styles.menuButtonContentStyle}
        text={t(ResKey.SettingsImport)}
        icon={iconImport}
        onPress={() => handleImportPressed()}
      />
      <MenuButton
        style={styles.menuButtonContainerStyle}
        textStyle={styles.menuButtonText}
        contentStyle={styles.menuButtonContentStyle}
        text={t(ResKey.SettingsExportAll)}
        icon={iconExportAll}
        onPress={() => handleExportAllPressed()}
      />
      <MenuButton
        style={styles.menuButtonContainerStyle}
        textStyle={styles.menuButtonText}
        contentStyle={styles.menuButtonContentStyle}
        text={t(ResKey.SettingsImportAll)}
        icon={iconImportAll}
        onPress={() => handleImportAllPressed()}
      />

      {/* veritabani islemlerini askiya aldim.
       <MenuButton 
        style={styles.menuButtonContainerStyle}
        textStyle={styles.menuButtonText}
        contentStyle={styles.menuButtonContentStyle}
        text={t(ResKey.SettingsExportDB)}
        icon={iconExport}
        onPress={() => handleExportDBPressed()}
      />
      <MenuButton
        style={styles.menuButtonContainerStyle}
        textStyle={styles.menuButtonText}
        contentStyle={styles.menuButtonContentStyle}
        text={t(ResKey.SettingsImportDB)}
        icon={iconImport}
        onPress={() => handleImportDBPressed()}
      />
      */}
    </ScrollContainer>
  );
};

const styles = StyleSheet.create({
  settingsItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SizeConstants.paddingRegular,
    padding: SizeConstants.paddingRegular,
    backgroundColor: ColorConstants.surface,
    borderRadius: SizeConstants.borderRadius,
    minHeight: SizeConstants.clickableSizeMin,
    // color: ColorConstants.font,
  },

  settingsItemKey: {
    // color: ColorConstants.font,
    fontSize: FontConstants.sizeRegular,
    color: ColorConstants.onSurfaceDepth10,
  },
  settingsItemValue: {
    fontSize: FontConstants.sizeRegular,
    color: ColorConstants.analogous2,
    fontWeight: FontConstants.weightBold,
  },
  menuButtonContainerStyle: {
    // flex: 1,
    // backgroundColor: 'red',
    // backgroundColor: ColorConstants.surface,
    // paddingVertical: SizeConstants.paddingSmallX,
    marginVertical: SizeConstants.paddingSmallX,
  },
  menuButtonContentStyle: {
    borderColor: ColorConstants.analogous2,
    borderWidth: 1,
    borderRadius: SizeConstants.borderRadius,
  },
  menuButtonText: {
    fontSize: FontConstants.sizeRegularX,
    color: ColorConstants.analogous2,
    paddingHorizontal: SizeConstants.paddingLarge,
    paddingVertical: SizeConstants.paddingRegular,
    textAlign: 'center',
  },
  separator: {
    height: SizeConstants.paddingSmallX,
    backgroundColor: ColorConstants.surfaceEl5,
    flex: 1,
    flexDirection: 'row',
    marginVertical: SizeConstants.paddingRegular,
  },
});

export default SettingsHome;
