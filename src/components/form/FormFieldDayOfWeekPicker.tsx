import {StyleSheet, View} from 'react-native';
import FieldBase from './FieldBase';
import {FieldProps} from 'formik';
import {SizeConstants} from '../../constants/StyleConstants';
import {memo, useCallback, useRef} from 'react';
import {LogService} from '../../services/Log/LogService';
import {DayOfWeekPicker} from '../DayOfWeekPicker';

export interface FormFieldProps extends FieldProps<boolean[]> {
  label: string;
  name: string;
  minSelectedDays?: number;
}

function FormFieldDayOfWeekPicker(props: FormFieldProps) {
  const {
    label,
    minSelectedDays,
    field: {name, onBlur, onChange, value},
    form: {errors, touched, setFieldTouched, setFieldValue},
    ...inputProps
  } = props;
  const defaultValue = useRef(value);

  const hasError = errors[name] && touched[name];
  const handleOnChangeDayOfWeekPicker = useCallback((value: boolean[]) => {
    setFieldValue(name, value);
  }, []);
  LogService.debug('rerender FormFieldDayOfWeekPicker');
  return (
    <FieldBase
      label={label}
      name={name}
      form={props.form}
      containerStyle={{
        flexDirection: 'column',
      }}>
      <View style={styles.container}>
        <DayOfWeekPicker
          onChangeValue={handleOnChangeDayOfWeekPicker}
          defaultValue={defaultValue.current}
          minSelectedDays={minSelectedDays}
        />
      </View>
    </FieldBase>
  );
}

// export default FormFieldDayOfWeekPicker;
export default memo(FormFieldDayOfWeekPicker);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: SizeConstants.paddingRegular,
  },
});
