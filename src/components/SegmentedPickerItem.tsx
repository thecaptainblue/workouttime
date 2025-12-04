import {memo, useCallback} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import Animated, {SharedValue, useAnimatedStyle} from 'react-native-reanimated';
import {ColorConstants, FontConstants, SizeConstants} from '../constants/StyleConstants';
import {ButtonWTIcon} from './ButtonWTIcon';
import {DayOfWeekHelper} from '../helper/DayOfWeekHelper';

interface SegmentedPickerItemProps {
  label: string;
  selectedDays: SharedValue<boolean[]>;
  indexDay: number;
  isForceOneSelectionActive?: boolean;
  minSelectedDays?: number; // active when isForceOneSelectionActive is false;
  buttonStyle?: StyleProp<ViewStyle>;
  btnSelectionColor?: string;
  btnBackgroundColor?: string;
}

function SegmentedPickerItemInner(props: SegmentedPickerItemProps) {
  const {
    selectedDays,
    indexDay,
    minSelectedDays,
    label,
    isForceOneSelectionActive,
    buttonStyle,
    btnSelectionColor,
    btnBackgroundColor,
  } = props;
  const length = selectedDays.value.length;
  const isFirst = indexDay == 0;
  const isLast = indexDay == length - 1;

  const btnSelectionColorValue = btnSelectionColor != null ? btnSelectionColor : ColorConstants.analogous2;
  const btnBackgroundColorValue = btnBackgroundColor != null ? btnBackgroundColor : ColorConstants.surface;

  const buttonAnimStyle = useAnimatedStyle(() => {
    const isSelected = selectedDays.value[indexDay];
    let tmpStyle = {backgroundColor: isSelected ? btnSelectionColorValue : btnBackgroundColorValue};
    tmpStyle = isFirst ? {...tmpStyle, ...styles.buttonFirst} : {...tmpStyle, ...styles.buttonLeftBorder};
    if (isLast) {
      tmpStyle = {...tmpStyle, ...styles.buttonLast};
    }
    return tmpStyle;
  }, []);

  const textAnimStyle = useAnimatedStyle(() => {
    const isSelected = selectedDays.value[indexDay];
    return isSelected ? styles.textSelected : styles.textNotSelected;
  }, []);

  const handleOnPressed = useCallback(() => {
    if (isForceOneSelectionActive == true) {
      selectedDays.modify(value => {
        'worklet';
        for (let index = 0; index < value.length; index++) {
          if (index == indexDay) {
            value[indexDay] = !value[indexDay];
          } else {
            value[index] = false;
          }
        }
        return value;
      });
    } else {
      // eger minSelecteddaysdan esit veya asagidaysa secimi kaldirmasina izin verme
      if (
        !(
          minSelectedDays != null &&
          DayOfWeekHelper.getActiveDayOfWeek(selectedDays.value) <= minSelectedDays &&
          selectedDays.value[indexDay]
        )
      ) {
        selectedDays.modify(value => {
          'worklet';
          value[indexDay] = !value[indexDay];
          return value;
        });
      }
    }
  }, []);

  return (
    <View style={[styles.container]}>
      <ButtonWTIcon
        // todo: buton secili degilken basildiginda butonun sol tarafindaki border olmadiginda cirkin gozukuyor
        // isPressAnimationActive={true}
        containerStyle={[styles.button, buttonStyle, buttonAnimStyle]}
        overlayStyle={styles.overlayStyle}
        onPress={handleOnPressed}>
        {/* <MaterialIcon name="done" size={FontConstants.sizeLargeXXXX * 1.5} color={ColorConstants.primary} /> */}
        <Animated.Text style={[styles.text, textAnimStyle]}>{label}</Animated.Text>
      </ButtonWTIcon>
    </View>
  );
}

export const SegmentedPickerItem = memo(SegmentedPickerItemInner);

const styles = StyleSheet.create({
  container: {
    // flexDirection: 'row-reverse',
    flex: 1,
    // backgroundColor: ColorConstants.primary,
    // borderRadius: SizeConstants.borderRadius,
  },

  text: {
    // color: ColorConstants.analogous2,
    fontSize: FontConstants.sizeRegularX,
    textAlign: 'center',
  },
  textNotSelected: {
    color: ColorConstants.analogous2,
    fontWeight: FontConstants.weightRegular,
    fontStyle: 'normal',
    textDecorationLine: 'none',
  },
  textSelected: {
    color: ColorConstants.onAnalogous2,
    fontWeight: FontConstants.weightBold,
    fontStyle: 'italic',
    textDecorationLine: 'underline',
  },
  button: {
    // color: ColorConstants.onSurface,
    // textAlign: 'center',
    // backgroundColor: 'transparent',
    // backgroundColor: 'red',
    // borderRadius: SizeConstants.borderRadius,
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'center',
    borderColor: ColorConstants.onSurface,
    borderWidth: 1,
  },
  buttonFirst: {
    borderTopLeftRadius: SizeConstants.borderRadius,
    borderBottomLeftRadius: SizeConstants.borderRadius,
  },
  buttonLast: {
    borderTopEndRadius: SizeConstants.borderRadius,
    borderBottomEndRadius: SizeConstants.borderRadius,
  },
  buttonLeftBorder: {
    // borderTopEndRadius: SizeConstants.borderRadius,
    // borderBottomEndRadius: SizeConstants.borderRadius,
    borderLeftWidth: 0,
    // borderLeftColor: ColorConstants.onSurface,
  },
  overlayStyle: {
    backgroundColor: ColorConstants.analogous2,
  },
});
