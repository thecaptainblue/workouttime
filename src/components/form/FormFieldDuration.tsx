import {StyleSheet, Text, TextInput, TextInputProps, View} from 'react-native';
import FieldBase from './FieldBase';
import {FieldProps, useField} from 'formik';
import {FontConstants, SizeConstants} from '../../constants/StyleConstants';
import {FormStyles} from './FormStyles';
import {useCallback, useEffect, useRef, useState} from 'react';
import Toggle from 'react-native-toggle-element/lib/toggle';
import {WorkoutTimeData} from '../../@types/Data/WorkoutTimeData';
import {String} from 'typescript-string-operations';
import {WorkoutTimeHelper} from '../../@types/WorkoutTimeHelper';
import TimeDisplay from '../TimeDisplay';
import {LogService} from '../../services/Log/LogService';
import React from 'react';

export interface FormFieldProps extends FieldProps<WorkoutTimeData> {
  label: string;
  name: string;
}

function FormFieldDuration(props: FormFieldProps) {
  const {
    label,
    field: {name, onBlur, onChange, value},
    form: {errors, touched, setFieldTouched, setFieldValue},
    ...inputProps
  } = props;
  const defaultValue = useRef(value);

  // console.log('FormFieldExerciseType,  value: %s, label: %s ', value, label);

  const hasError = errors[name] && touched[name];
  // helpers.setValue(componentSize != null ? componentSize : 0);
  const handleTimeDisplayeOnChangeValue = useCallback((value: WorkoutTimeData) => {
    // console.log('FormFieldDuration workoutTime: ', value);
    setFieldValue(name, value);
  }, []);
  LogService.debug('rerender FormFieldDuration');
  return (
    <FieldBase
      label={label}
      name={name}
      form={props.form}
      containerStyle={{
        flexDirection: 'column',
        marginTop: SizeConstants.paddingRegular,
        // flex: 1,
        // borderColor: 'red',
        // borderWidth: 1,
      }}
      leftContainerStyle={
        {
          // height: 50,
          // justifyContent: 'center',
          // alignItems: 'center',
          // alignSelf: 'center',
          // alignContent: 'center',
          // textAlign: 'center',
          // flex: 1,
          // flexDirection: 'column',
          // marginTop: SizeConstants.paddingRegular,
          // borderColor: 'orange',
          // borderWidth: 1,
        }
      }
      leftLabelStyle={
        {
          // textAlign: 'center',
          // borderColor: 'orange',
          // borderWidth: 1,
        }
      }
      rightContainerStyle={
        {
          // flex: 1,
          // borderColor: 'green',
          // borderWidth: 1,
        }
      }>
      <View style={styles.containerDuration}>
        <TimeDisplay onChangeValue={handleTimeDisplayeOnChangeValue} defaultValue={defaultValue.current} />
      </View>
    </FieldBase>
  );
}

export default FormFieldDuration;
// export default React.memo(FormFieldDuration);

const styles = StyleSheet.create({
  containerDuration: {
    // flex: 1,
    // flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
