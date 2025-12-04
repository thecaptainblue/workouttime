import {StyleSheet, View} from 'react-native';
import FieldBase from './FieldBase';
import {FieldProps} from 'formik';
import {ColorConstants, FontConstants, SizeConstants} from '../../constants/StyleConstants';
import {FormBaseProps} from './types';
import {MenuButton, MenuButtonProps} from '../MenuButton';

export interface FormFieldMenuButtonProps extends FieldProps<Number>, MenuButtonProps, FormBaseProps {
  label: string;
  icon: React.ReactNode;
}

export default function FormFieldMenuButton(props: FormFieldMenuButtonProps) {
  const {
    label,
    icon,
    field: {
      name,
      // onBlur, onChange, value
    },
    // form: {errors, touched, setFieldTouched},
    isLastElement,
    ...inputProps
  } = props;
  // const defaultValue = useRef(value);
  // const hasError = errors[name] && touched[name];

  // const caretStyleRef = useRef(StyleSheet.create([styles.numericInputTextCaretStyle, {fontSize: fontSize * 1.5}]));

  return (
    <FieldBase label={label} name={name} form={props.form} isLastElement={isLastElement}>
      <View style={styles.container}>
        <MenuButton
          style={styles.containerStyle}
          textStyle={styles.text}
          contentStyle={styles.contentStyle}
          icon={icon}
          {...inputProps}
        />
      </View>
    </FieldBase>
  );
}

const textPadding = SizeConstants.paddingSmallX;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignSelf: 'stretch',
    // alignSelf: 'flex-start',
    // padding: SizeConstants.paddingSmall,
    paddingHorizontal: SizeConstants.paddingSmallX,
    // backgroundColor: 'red',
  },
  text: {
    // fontSize: FontConstants.sizeXLarge,
    fontSize: FontConstants.sizeRegularX,
    // color: ColorConstants.onSurfaceDepth,
    // color: ColorConstants.onAnalogous2,
    // backgroundColor: ColorConstants.analogous2,
    color: ColorConstants.analogous2,
    // borderColor: ColorConstants.analogous2,
    // borderWidth: 1,
    // borderColor: 'gray',
    // borderWidth: 0.5,
    // width: 50,
    // alignSelf: 'flex-start',
    // backgroundColor: ColorConstants.surface,
    paddingHorizontal: SizeConstants.paddingLarge,
    // paddingVertical: SizeConstants.paddingRegular,
    // borderRadius: SizeConstants.borderRadius,
    // marginLeft: SizeConstants.paddingRegular,
    textAlign: 'center',
    // alignSelf: 'stretch',
    // flex: 1,
  },
  containerStyle: {
    // flex: 1,
    // backgroundColor: 'red',
    // backgroundColor: ColorConstants.surface,
    // paddingVertical: SizeConstants.paddingSmallX,
  },
  contentStyle: {
    borderColor: ColorConstants.analogous2,
    borderWidth: 1,
    borderRadius: SizeConstants.borderRadius,
    paddingVertical: SizeConstants.paddingRegular,
  },
});
