import {LogService} from '../services/Log/LogService';
import Picker, {PickerInput} from './WheelPicker/Picker';
import {StyleSheet, Text, View} from 'react-native';
import {ColorConstants, FontConstants, SizeConstants} from '../constants/StyleConstants';
import {String} from 'typescript-string-operations';
import {WorkoutTimeData} from '../@types/Data/WorkoutTimeData';
import {useCallback, useMemo, useRef} from 'react';
import {WorkoutTimeHelper} from '../@types/WorkoutTimeHelper';
import React from 'react';
import CyclicPicker from './WheelPicker/CyclicPicker';
import {useTranslation} from 'react-i18next';
import {ResKey} from '../lang/ResKey';

const inputValues: PickerInput[] = new Array(60).fill(null).map((value, index) => {
  return {value: index, label: String.format('{0:00}', index)};
});

const tdConst = {
  itemHeight: 45,
  defautlValue: 0,
  visibleItems: 3,
  fontSize: 35,
  fontWeight: FontConstants.weightBold,
  selectedItemColor: ColorConstants.onSurfaceDepth, //'black',
  baseItemColor: ColorConstants.onSurfaceDepth15, //'grey',
  // selectedItemColor: ColorConstants.background,
  // baseItemColor: ColorConstants.backgroundLight,
};

interface TimeDisplayProps {
  onChangeValue: (value: WorkoutTimeData) => void;
  defaultValue?: WorkoutTimeData;
}
function TimeDisplay({onChangeValue, defaultValue}: TimeDisplayProps) {
  const hourRef = useRef(defaultValue ? defaultValue.hours : 0);
  const minuteRef = useRef(defaultValue ? defaultValue.minutes : 0);
  const secRef = useRef(defaultValue ? defaultValue.seconds : 0);
  // const inputValuesMemoized = useMemo(() => inputValues, []);
  const {t} = useTranslation();

  const fireOnChangeValue = useCallback(() => {
    const time = WorkoutTimeHelper.create(hourRef.current, minuteRef.current, secRef.current);
    onChangeValue(time);
  }, []);

  const handleHourOnChangeSelectedValue = useCallback((value: number) => {
    hourRef.current = value;
    fireOnChangeValue();
  }, []);

  const handleMinuteOnChangeSelectedValue = useCallback((value: number) => {
    minuteRef.current = value;
    fireOnChangeValue();
  }, []);

  const handleSecOnChangeSelectedValue = useCallback((value: number) => {
    console.log('handleSecOnChangeSelectedValue', value);
    secRef.current = value;
    fireOnChangeValue();
  }, []);

  LogService.debug('rerender TimeDisplay');
  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <CyclicPicker
          values={inputValues}
          defaultValue={defaultValue ? defaultValue.hours : 0}
          visibleItems={tdConst.visibleItems}
          itemHeight={tdConst.itemHeight}
          textStyle={[styles.pickerText, {fontSize: tdConst.fontSize, fontWeight: tdConst.fontWeight}]}
          parentContainerStyle={styles.pickerParentContainer}
          selectedItemColor={tdConst.selectedItemColor}
          baseItemColor={tdConst.baseItemColor}
          onChangeSelectedValue={handleHourOnChangeSelectedValue}
        />
        <View style={styles.textContainer}>
          <Text style={styles.text}>{t(ResKey.TimeDisplayHours)}</Text>
        </View>
      </View>
      <View style={styles.subContainer}>
        <CyclicPicker
          values={inputValues}
          defaultValue={defaultValue ? defaultValue.minutes : 0}
          visibleItems={tdConst.visibleItems}
          itemHeight={tdConst.itemHeight}
          textStyle={[styles.pickerText, {fontSize: tdConst.fontSize, fontWeight: tdConst.fontWeight}]}
          parentContainerStyle={styles.pickerParentContainer}
          selectedItemColor={tdConst.selectedItemColor}
          baseItemColor={tdConst.baseItemColor}
          onChangeSelectedValue={handleMinuteOnChangeSelectedValue}
        />
        <View style={styles.textContainer}>
          <Text style={styles.text}>{t(ResKey.TimeDisplayMins)}</Text>
        </View>
      </View>
      <View style={styles.subContainer}>
        <CyclicPicker
          values={inputValues}
          defaultValue={defaultValue ? defaultValue.seconds : 0}
          visibleItems={tdConst.visibleItems}
          itemHeight={tdConst.itemHeight}
          textStyle={[styles.pickerText, {fontSize: tdConst.fontSize, fontWeight: tdConst.fontWeight}]}
          parentContainerStyle={styles.pickerParentContainer}
          selectedItemColor={tdConst.selectedItemColor}
          baseItemColor={tdConst.baseItemColor}
          onChangeSelectedValue={handleSecOnChangeSelectedValue}
        />
        <View style={styles.textContainer}>
          <Text style={styles.text}>{t(ResKey.TimeDisplaySecs)}</Text>
        </View>
      </View>
    </View>
  );
}

// export default TimeDisplay;
export default React.memo(TimeDisplay);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: ColorConstants.surface,
    borderRadius: SizeConstants.borderRadius,
    padding: SizeConstants.paddingLarge,
  },
  subContainer: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    // verticalAlign: 'middle',
    // borderColor: 'orange',
    // borderWidth: 1,
  },
  pickerParentContainer: {
    flex: 0,
  },
  textContainer: {
    // flex: 1,
    // backgroundColor: 'red',
    alignItems: 'center',
  },
  text: {
    fontSize: FontConstants.sizeRegular,
    fontWeight: FontConstants.weightBold,
    // color: ColorConstants.backgroundLight,
    color: tdConst.baseItemColor,
  },
  pickerText: {
    // color: ColorConstants.background,
    paddingHorizontal: SizeConstants.paddingSmallX,
  },
});
