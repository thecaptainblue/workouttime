import {StyleSheet, Text, TextInput, TextInputProps} from 'react-native';
import FieldBase from './FieldBase';
import {FieldProps, useFormikContext} from 'formik';
import {FontConstants, SizeConstants} from '../../constants/StyleConstants';
import {useEffect} from 'react';

export interface FormValuesProps {
  onChangeValues: (values: any) => void;
}

export default function FormValues(props: FormValuesProps) {
  const {onChangeValues} = props;
  const {values} = useFormikContext();
  useEffect(() => {
    // console.log('values changed ', values);
    onChangeValues(values);
  }, [values]);
  return null;
}
