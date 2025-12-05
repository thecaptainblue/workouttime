import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LogService } from '../../services/Log/LogService';
import { SettingStackParamList } from '../../@types/SettingStack';
import { useSelector } from 'react-redux';
import { selectWorkouts } from '../../store/features/workoutsSlice';
import { WorkoutData } from '../../@types/Data/WorkoutData';
import { FSHelper } from '../../helper/FSHelper';
import { ExportImportHelper } from '../../helper/WorkoutExportImportHelper';
// import FastList, { FastListEventType } from '../../components/native/FastList';
// import { FastListHelper } from '../../helper/FastListHelper';

type SettingsExportProps = NativeStackScreenProps<SettingStackParamList, 'SettingsExport'>;
const SettingsExport = (props: SettingsExportProps) => {
  const workouts = useSelector(selectWorkouts);

  const onPressWhenNoDraggingCallback = useCallback(async (id: string) => {
    // console.log('onPressWhenNoDraggingCallback');
    const item = workouts.find(item => item.id == id)
    if (item != null) {
      const isPerrmisionGranted = await FSHelper.hasWriteExternalStoragePermission();
      const workout = item;
      if (isPerrmisionGranted && workout != null) {
        const fileName = ExportImportHelper.createWorkoutFileName(workout.name);
        // await FSHelper.saveToDownload(fileName, workout);
        const exportData = ExportImportHelper.createExportDataSingleWorkout(workout);
        await FSHelper.saveFileAskFirst(fileName, exportData, true);
        // LogService.infoFormat('exportToFile, file exported {0}', fileName);
      }
    }
  }, []);

  const handleItemClick = useCallback((event: { nativeEvent: { eventType: string, id: string, params: Record<string, any>; } }) => {
    // TODO yukseltme
    // const { eventType, id, params } = event.nativeEvent;
    // console.log(`Item with eventType: ${eventType} ID: ${id} was clicked! params ${params}`);
    // if (eventType == FastListEventType.ItemClicked) {
    //   onPressWhenNoDraggingCallback(id)
    // }
  }, []);

  LogService.debug('rerender SettingsExport');
  return (
    <View style={styles.containerScroll}>

      {/* <FastList // TODO yukseltme
        // ref={fastListRef}
        data={FastListHelper.convertForExport(workouts)}
        isDraggable={false}
        isSwipeableDisable={true}
        onClickEventHappened={handleItemClick}
      // emptyListLabel={emptyListLabel}
      /> */}
    </View>
  );
};

export default SettingsExport;

const styles = StyleSheet.create({
  containerScroll: { flex: 1 },
  containerRightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
