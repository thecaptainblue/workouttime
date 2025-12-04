import FieldBase from './FieldBase';
import {FieldProps} from 'formik';
import {ColorConstants} from '../../constants/StyleConstants';
import Toggle from 'react-native-toggle-element/lib/toggle';
import {useTranslation} from 'react-i18next';
import {ResKey} from '../../lang/ResKey';

export interface FormFieldProps extends FieldProps<boolean> {
  label: string;
  name: string;
}

export default function FormFieldExerciseType(props: FormFieldProps) {
  const {
    label,
    field: {name, onBlur, onChange, value},
    form: {errors, touched, setFieldTouched, setFieldValue},
    ...inputProps
  } = props;
  const {t} = useTranslation();
  // const {name, isTimeBased} = props;
  // console.log('FormFieldComponents, ', props);
  // const [field, meta, helpers] = useField(props.name);

  // console.log('FormFieldExerciseType,  value: %s, label: %s ', value, label);

  const hasError = errors[name] && touched[name];
  // helpers.setValue(componentSize != null ? componentSize : 0);

  return (
    <FieldBase label={label} name={name} form={props.form}>
      <Toggle
        value={value}
        onPress={val => {
          // setTimeBased(val!)
          // helpers.setValue(val!)
          // console.log('onpress value: ', val);
          // onChange(val!);
          setFieldValue(name, val!);
          // onChange(val ? 0 : 1);
        }}
        leftTitle={t(ResKey.FieldRep)}
        rightTitle={t(ResKey.FieldTime)}
        // trackBarStyle={{backgroundColor: '#b9bbc4'}}
        thumbButton={{
          activeColor: ColorConstants.onPrimaryDepth, // bu da sagdaki yazinin rengi sag seciliyken
          inActiveColor: ColorConstants.onSurfaceDepth12, // bu da sol seciliyken sagdaki yazinin resmi.
          // backgroundlar calismiyor styledan ayarla
          activeBackgroundColor: ColorConstants.onPrimaryDepth, // bu da bacground degil soldaki yazinin rengi sol seciliyken
          inActiveBackgroundColor: ColorConstants.onSurfaceDepth12, // bu background degil soldaki yazinin rengi. sag seciliyken
        }}
        // trackBar={{activeBackgroundColor: '#b9bbc4', inActiveBackgroundColor: '#b9bbc4'}}
        trackBar={{
          activeBackgroundColor: ColorConstants.surfaceEl5,
          inActiveBackgroundColor: ColorConstants.surfaceEl5,
        }}
        thumbStyle={{backgroundColor: ColorConstants.primary}}
        // disabledTitleStyle={{fontSize: FontConstants.sizeLarge}}
      />
    </FieldBase>
  );
}
