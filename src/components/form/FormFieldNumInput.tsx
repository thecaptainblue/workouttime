import {StyleSheet, View} from 'react-native';
import FieldBase from './FieldBase';
import {FieldProps} from 'formik';
import {ColorConstants, FontConstants, SizeConstants} from '../../constants/StyleConstants';
import {NumericInput, NumericInputProps} from '../NumericInput';
import {useCallback, useRef} from 'react';
import {FormBaseProps} from './types';
import {FormStyles} from './FormStyles';

//todo: propslarin tipini belirtelim.
{
  /* <Number> */
}
export interface FormFieldNumProps extends FieldProps<Number>, NumericInputProps, FormBaseProps {
  label: string;
}

export default function FormFieldNumInput(props: FormFieldNumProps) {
  const {
    label,
    field: {name, onBlur, onChange, value},
    form: {errors, touched, setFieldTouched},
    isLastElement,
    ...inputProps
  } = props;
  const defaultValue = useRef(value);
  const hasError = errors[name] && touched[name];

  const onChangeText = useCallback(
    (text: string) => {
      onChange(name)(text);
    },
    [onChange, name],
  );

  const fontSize = StyleSheet.flatten(styles.text).fontSize;
  const tmpStyle = StyleSheet.create({fontStyle: {fontSize: fontSize * 1.5}});
  const caretStyleRef = useRef([styles.numericInputTextCaretStyle, tmpStyle.fontStyle]);
  // const caretStyleRef = useRef(StyleSheet.create([styles.numericInputTextCaretStyle, {fontSize: fontSize * 1.5}]));

  return (
    <FieldBase label={label} name={name} form={props.form} isLastElement={isLastElement}>
      {/* <TextInput
        style={styles.text}
        placeholder={placeholder}
        onChangeText={onChangeText}
        onBlur={() => {
          setFieldTouched(name);
          onBlur(name);
        }}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="numeric"
        value={value.toString()}
        // value={value}
        {...inputProps}
      /> */}
      <View style={styles.container}>
        <NumericInput
          containerStyle={styles.numericInputContainerStyle}
          textStyle={styles.text}
          // textCaretStyle={[styles.numericInputTextCaretStyle, {fontSize: fontSize * 1.5}]}
          textCaretStyle={caretStyleRef.current}
          rangeMin={1}
          rangeMax={1000}
          // formatInput="{0:00}"
          // selectionColor={ColorConstants.backgroundLight}
          // selectionColor={'rgba(156, 154, 154, 0.5)'}
          selectionColor={ColorConstants.surfaceEl10}
          // selectionColor={'grey'}
          selectionBorderRadius={5}
          defaultValue={defaultValue.current.toString()}
          // onBlur={onChangeText}
          // onTextSubmit={onChangeText}
          onChangeText={onChangeText}
          {...inputProps}
        />
      </View>
    </FieldBase>
  );
}

const textPadding = SizeConstants.paddingSmallX;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    // padding: SizeConstants.paddingSmall,
  },
  text: {
    fontSize: FontConstants.sizeRegularX,
    color: ColorConstants.onSurfaceDepth,
    // borderColor: 'gray',
    // borderWidth: 0.5,
    // width: 150,
    // alignSelf: 'stretch',
    // backgroundColor: ColorConstants.surface,
    paddingHorizontal: SizeConstants.paddingRegular,
    paddingVertical: textPadding,
    borderRadius: SizeConstants.borderRadius,
  },
  numericInputContainerStyle: {
    ...FormStyles.numericFieldContainer,
    // borderColor: 'orange',
    // borderWidth: 1,
    // width: '20%',
    backgroundColor: ColorConstants.surface,
    // padding
    // paddingLeft: SizeConstants.paddingRegular,
    paddingVertical: SizeConstants.paddingSmallX,
  },
  numericInputTextCaretStyle: {
    color: ColorConstants.primary,
    fontWeight: FontConstants.weightBold,
    paddingVertical: textPadding, // text ile ayni paddinging verilmesi lazim.
    // fontSize: fontSize * 1.5,
    top: -8,
    left: -3,
  },
});
