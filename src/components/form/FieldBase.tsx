import {ErrorMessage, FormikProps} from 'formik';
import {PropsWithChildren} from 'react';
import {StyleSheet, View, Text, StyleProp, ViewStyle, TextStyle} from 'react-native';
import {ColorConstants, FontConstants, SizeConstants} from '../../constants/StyleConstants';
import {FormStyles} from './FormStyles';
import {FormBaseProps} from './types';
import {LogService} from '../../services/Log/LogService';

export interface FieldBaseProps extends FormBaseProps {
  label: string;
  name: string;
  form: FormikProps<any>;
  containerStyle?: StyleProp<ViewStyle>;
  leftContainerStyle?: StyleProp<ViewStyle>;
  leftLabelStyle?: StyleProp<TextStyle>;
  rightContainerStyle?: StyleProp<ViewStyle>;
}

export default function FieldBase({
  label,
  name,
  children,
  form,
  containerStyle,
  leftContainerStyle,
  leftLabelStyle,
  rightContainerStyle,
  isLastElement,
}: PropsWithChildren<FieldBaseProps>) {
  const {errors, touched, setFieldTouched} = form;
  const hasError = errors[name] && touched[name];
  LogService.debug('rerender FieldBase ', name);
  return (
    <View style={[styles.container, {marginBottom: isLastElement ? 0 : SizeConstants.paddingSmallX}, containerStyle]}>
      <View style={[styles.leftContainer, leftContainerStyle]}>
        <Text style={[styles.label, leftLabelStyle]}>{label}</Text>
      </View>
      <View style={[styles.rightContainer, rightContainerStyle, hasError ? styles.rightContainerError : null]}>
        {children}
      </View>
      {hasError && <Text style={FormStyles.errorText}>{('*' + errors[name]) as React.ReactNode}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: 'row',
    // paddingBottom: SizeConstants.paddingSmall,
    // marginTop: SizeConstants.paddingSmallX,
  },
  leftContainer: {
    flex: 0.4,
    flexDirection: 'row',
    // backgroundColor: 'orange',
    // alignContent: 'center',
    alignItems: 'center',
    // justifyContent: 'center',
    paddingLeft: SizeConstants.paddingRegular,
    // borderColor: 'gray',
    // borderWidth: 0.5,
    // marginTop: SizeConstants.paddingSmallX,
  },
  rightContainer: {
    flex: 1,
    // backgroundColor: 'cyan',
    alignContent: 'center',
    alignItems: 'center',
    // borderColor: 'gray',
    // borderWidth: 0.5,
  },
  rightContainerError: {
    borderColor: ColorConstants.errorEl1,
    borderWidth: 0.5,
    borderRadius: SizeConstants.borderRadius,
  },
  label: {
    fontSize: FontConstants.sizeRegularX,
    fontWeight: FontConstants.weightBold,
    color: ColorConstants.onSurfaceDepth10,
    // backgroundColor: 'gray',
    flex: 1,
  },
});
