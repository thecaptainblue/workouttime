import {StyleSheet, Text, TextInput, TextInputProps} from 'react-native';
import FieldBase from './FieldBase';
import {FieldProps, useField} from 'formik';
import {FontConstants, SizeConstants} from '../../constants/StyleConstants';
import {FormStyles} from './FormStyles';
import {useEffect} from 'react';
import {LogService} from '../../services/Log/LogService';
import useWhatChanged from '../../hooks/useWhatChanged';

export interface FormFieldProps {
  name: string;
  componentSize: number | null;
}

export default function FormFieldComponents(props: FormFieldProps) {
  const {name, componentSize} = props;
  // useWhatChanged(props, 'FormFieldComponents' + name);
  // console.log('FormFieldComponents, ', props);
  const [field, meta, helpers] = useField(props.name);

  // console.log('FormFieldComponents,  value ', field.value);

  const hasError = meta.error && meta.touched;
  // helpers.setValue(componentSize != null ? componentSize : 0);

  useEffect(() => {
    console.log('useEffect FormFieldComponents,  change value ', componentSize);
    helpers.setValue(componentSize != null ? componentSize : 0);
  }, [componentSize]);

  LogService.debug('rerender FormFieldComponents ', name);

  if (hasError) {
    return <Text style={FormStyles.errorText}>{('*' + meta.error) as React.ReactNode}</Text>;
  } else {
    return null;
  }
}
