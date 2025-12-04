import {memo} from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {StyleSheet, View} from 'react-native';
import {SizeConstants} from '../constants/StyleConstants';
import {runOnJS, useAnimatedReaction, useSharedValue} from 'react-native-reanimated';
import {SegmentedPickerItem} from './SegmentedPickerItem';

export type SegmentedPickerLabelInfo = {
  label: string;
  name?: string;
  defaultValue?: boolean;
};

interface SegmentedPickerProps {
  onChangeValue: (weekStatus: boolean[]) => void;
  labels: SegmentedPickerLabelInfo[];
  containerStyle?: StyleProp<ViewStyle>;
  isForceOneSelectionActive?: boolean;
  minSelectedDays?: number; // active when isForceOneSelectionActive is false;
  buttonStyle?: StyleProp<ViewStyle>;
  btnSelectionColor?: string;
  btnBackgroundColor?: string;
}

function SegmentedPickerInner(props: SegmentedPickerProps) {
  const {
    containerStyle,
    labels,
    onChangeValue: onChange,
    minSelectedDays,
    isForceOneSelectionActive,
    buttonStyle,
    btnSelectionColor,
    btnBackgroundColor,
  } = props;
  const selectedDays = useSharedValue<boolean[]>(getValues(labels));
  useAnimatedReaction(
    () => {
      return selectedDays.value;
    },
    (selectedDaysValue, previousValue) => {
      // console.info('selectedDays changed ', selectedDaysValue);
      //isSelectedDaysSame calismiyor cunku array degismedigi icin icerik ayni oluyor
      // if (selectedDaysValue != null && isSelectedDaysSame(selectedDaysValue, previousValue)) {
      if (selectedDaysValue != null && previousValue != null) {
        // console.info('selectedDays changed ', selectedDaysValue);
        // console.info('selectedDays previousValue ', previousValue);
        runOnJS(onChange)([...selectedDaysValue]);
      }
    },
    [],
  );

  return (
    <View style={[styles.container, containerStyle]}>
      {labels.map((labelInfo, index) => {
        return (
          <SegmentedPickerItem
            key={labelInfo.label}
            indexDay={index}
            selectedDays={selectedDays}
            label={labelInfo.label}
            minSelectedDays={minSelectedDays}
            isForceOneSelectionActive={isForceOneSelectionActive}
            buttonStyle={buttonStyle}
            btnSelectionColor={btnSelectionColor}
            btnBackgroundColor={btnBackgroundColor}
          />
        );
      })}
    </View>
  );
}

export const SegmentedPicker = memo(SegmentedPickerInner);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    minHeight: 40,
    alignItems: 'center',
    // borderColor: ColorConstants.analogous2,
    // borderWidth: 1,
    marginHorizontal: SizeConstants.paddingSmallX,
    // borderRadius: SizeConstants.borderRadius,
  },
});

function getValues(labels: SegmentedPickerLabelInfo[]): boolean[] {
  let result: boolean[] = [];
  for (let i = 0; i < labels.length; i++) {
    const info = labels[i];
    if (info.defaultValue != null) {
      result[i] = info.defaultValue;
    } else {
      result[i] = false;
    }
  }
  return result;
}
