import {StyleSheet, Text, TextInput, TextInputProps} from 'react-native';
import FieldBase from './FieldBase';
import {FieldProps} from 'formik';
import {ColorConstants, FontConstants, SizeConstants} from '../../constants/StyleConstants';
import {FormBaseProps} from './types';
import {LogService} from '../../services/Log/LogService';

export interface FormFieldProps extends FieldProps, TextInputProps, FormBaseProps {
  label: string;
  placeholder: string;
  onChangeTextExternal?: (text: string) => void;
  // inputProps
}

export default function FormFieldTextInput(props: FormFieldProps) {
  const {
    label,
    placeholder,
    field: {name, onBlur, onChange, value},
    form: {errors, touched, setFieldTouched},
    isLastElement,
    onChangeTextExternal,
    ...inputProps
  } = props;
  const hasError = errors[name] && touched[name];

  LogService.debug('rerender FormFieldTextInput ', name);
  return (
    <FieldBase label={label} name={name} form={props.form} isLastElement={isLastElement}>
      <TextInput
        style={styles.text}
        placeholder={placeholder}
        placeholderTextColor={ColorConstants.onSurfaceDepth16}
        cursorColor={ColorConstants.primary}
        // selectionColor={'#3442af33'}
        selectionColor={ColorConstants.primaryVariant}
        onChangeText={text => {
          onChange(name)(text);
          onChangeTextExternal?.(text);
        }}
        onBlur={() => {
          setFieldTouched(name);
          onBlur(name);
        }}
        autoCapitalize="none"
        autoCorrect={false}
        maxLength={200}
        // multiline={true}
        // numberOfLines={3}
        value={value}
        {...inputProps}
      />
    </FieldBase>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: FontConstants.sizeRegularX,
    color: ColorConstants.onSurfaceDepth,
    // borderColor: 'gray',
    // borderWidth: 0.5,
    // width: 150,
    alignSelf: 'stretch',
    paddingLeft: SizeConstants.paddingRegular,
    backgroundColor: ColorConstants.surface,
    borderRadius: SizeConstants.borderRadius,
  },
});
