import {memo, useRef} from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {SegmentedPicker} from './SegmentedPicker';
import {useTranslation} from 'react-i18next';
import {ResKey} from '../lang/ResKey';

interface DayOfWeekPickerProps {
  onChangeValue: (weekStatus: boolean[]) => void;
  defaultValue?: boolean[];
  containerStyle?: StyleProp<ViewStyle>;
  minSelectedDays?: number;
}

function DayOfWeekPickerInner(props: DayOfWeekPickerProps) {
  const {containerStyle, onChangeValue: onChange, defaultValue, minSelectedDays} = props;
  const {t} = useTranslation();
  const defaultValueRef = useRef<boolean[]>(
    defaultValue != null && defaultValue.length == 7 ? defaultValue : [false, false, false, false, false, false, false],
  );

  return (
    <SegmentedPicker
      containerStyle={containerStyle}
      onChangeValue={onChange}
      labels={[
        {label: t(ResKey.DayOfWeeksShort + `.0`), defaultValue: defaultValueRef.current[0]},
        {label: t(ResKey.DayOfWeeksShort + `.1`), defaultValue: defaultValueRef.current[1]},
        {label: t(ResKey.DayOfWeeksShort + `.2`), defaultValue: defaultValueRef.current[2]},
        {label: t(ResKey.DayOfWeeksShort + `.3`), defaultValue: defaultValueRef.current[3]},
        {label: t(ResKey.DayOfWeeksShort + `.4`), defaultValue: defaultValueRef.current[4]},
        {label: t(ResKey.DayOfWeeksShort + `.5`), defaultValue: defaultValueRef.current[5]},
        {label: t(ResKey.DayOfWeeksShort + `.6`), defaultValue: defaultValueRef.current[6]},
      ]}
      minSelectedDays={minSelectedDays}
    />
  );
}

export const DayOfWeekPicker = memo(DayOfWeekPickerInner);
