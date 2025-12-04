import {ForwardedRef, forwardRef} from 'react';
import {StyleSheet} from 'react-native';
import {TextInputWT, TextInputWTProps, TextInputWTRefProps} from './TextInputWT';

export interface NumericInputProps extends TextInputWTProps {}

export interface NumericInputRefProps extends TextInputWTRefProps {}

function NumericInputInner(props: NumericInputProps, ref: ForwardedRef<NumericInputRefProps>) {
  const {...textInputProps} = props;

  return <TextInputWT {...textInputProps} ref={ref} inputMode="numeric" />;
}

export const NumericInput = forwardRef(NumericInputInner);

const style = StyleSheet.create({});
