import {StyleSheet, View} from 'react-native';
import FieldBase from './FieldBase';
import {FieldProps} from 'formik';
import {ColorConstants, SizeConstants} from '../../constants/StyleConstants';
import {FormBaseProps} from './types';
import {CheckedButton, CheckedButtonProps} from '../CheckedButton/CheckedButton';
import {memo, useCallback, useRef} from 'react';
import {LogService} from '../../services/Log/LogService';

export interface FormFieldCheckedButtonProps extends FieldProps<boolean>, CheckedButtonProps, FormBaseProps {
  label: string;
}

function FormFieldCheckedButtonInner(props: FormFieldCheckedButtonProps) {
  const {
    label,
    field: {
      name,
      // onBlur, onChange,
      value,
    },
    form: {
      setFieldValue,
      // errors, touched, setFieldTouched
    },
    isLastElement,
    // ...inputProps
  } = props;
  const defaultValue = useRef(value);
  // const hasError = errors[name] && touched[name];

  // const caretStyleRef = useRef(StyleSheet.create([styles.numericInputTextCaretStyle, {fontSize: fontSize * 1.5}]));
  const handleOnValueChange = useCallback((isChecked: boolean) => {
    LogService.infoFormat('handleOnValueChange {0}', isChecked);
    setFieldValue(name, isChecked);
  }, []);

  return (
    <FieldBase label={label} name={name} form={props.form} isLastElement={isLastElement}>
      <View style={styles.container}>
        <CheckedButton
          style={styles.containerStyle}
          contentStyle={styles.contentStyle}
          // onCheckedValueChange={handleOnValueChange}
          onChangeValue={handleOnValueChange}
          defaultValue={defaultValue.current}
          // {...inputProps}
        />
      </View>
    </FieldBase>
  );
}

export const FormFieldCheckedButton = memo(FormFieldCheckedButtonInner);

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // alignSelf: 'stretch',
    alignSelf: 'flex-start',
    // padding: SizeConstants.paddingSmall,
    // paddingHorizontal: SizeConstants.paddingSmallX,
    // backgroundColor: 'red',
  },
  containerStyle: {
    // flex: 1,
    // backgroundColor: 'red',
    // backgroundColor: ColorConstants.surface,
    // paddingVertical: SizeConstants.paddingSmallX,
  },
  contentStyle: {
    borderColor: ColorConstants.analogous2,
    // borderWidth: 1,
    // borderRadius: SizeConstants.borderRadius,
  },
});
