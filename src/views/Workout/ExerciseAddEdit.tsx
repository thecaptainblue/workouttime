import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MainStackParamList} from '../../@types/MainStackParamList';
import {LogService} from '../../services/Log/LogService';
import {StyleSheet, View} from 'react-native';
import ScrollContainer from '../../components/ScrollContainer';
import {v4} from 'uuid';
import {WorkoutTimeHelper} from '../../@types/WorkoutTimeHelper';
import {WorkoutTimeData} from '../../@types/Data/WorkoutTimeData';
import {WorkoutComponentData} from '../../@types/Data/WorkoutComponentData';
import {WorkoutHelper} from '../../@types/Data/WorkoutHelper';
import {
  selectComponentByIdLadder,
  AddComponent,
  PayloadAddComponent,
  PayloadUpdateComponent,
  UpdateComponent,
} from '../../store/features/workoutSingleSlice';
import {useDispatch, useSelector} from 'react-redux';
import {WorkoutComponentType} from '../../@types/Data/WorkoutComponentType';
import {
  AddExerciseToGroup,
  PayloadAddExerciseToGroup,
  PayloadUpdateExerciseInGroup,
  UpdateExerciseInGroup,
  selectExerciseById,
} from '../../store/features/groupsSlice';
import * as Yup from 'yup';
import {Field, Formik} from 'formik';
import FormFieldTextInput from '../../components/form/FormFieldTextInput';
import FormFieldNumInput from '../../components/form/FormFieldNumInput';
import FormFieldExerciseType from '../../components/form/FormFieldExerciseType';
import FormFieldDuration from '../../components/form/FormFieldDuration';
import {useTranslation} from 'react-i18next';
import {ResKey} from '../../lang/ResKey';
import i18next from 'i18next';
import {useKeyboardAware} from '../../hooks/useKeyboardAware';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import StdButtonCancel from '../../components/form/StdButtonCancel';
import FormSubmitButtonIcon from '../../components/form/FormSubmitButtonIcon';
import {SizeConstants} from '../../constants/StyleConstants';
import {String} from 'typescript-string-operations';
import {useCallback} from 'react';
import {ScreenNames} from '../Screens/ScreenNames';
import {useOverrideHardwareBackPress} from '../../hooks/useOverrideHardwareBackPress';
import {FormFieldCheckedButton} from '../../components/form/FormFieldCheckedButton';
import React from 'react';

const screenFields = {
  NameId: 'name',
  DescriptionId: 'description',
  LapId: 'lap',
  ExerciseTypeId: 'exerciseType',
  isRestId: 'isRest',
  DurationId: 'duration',
  RepId: 'rep',
};

const validationSchema = Yup.object().shape({
  [screenFields.NameId]: Yup.string().required(i18next.t(ResKey.FieldNameError)).label(i18next.t(ResKey.FieldName)),
  [screenFields.LapId]: Yup.number().required(i18next.t(ResKey.FieldLapError)).min(1, ' '),
  [screenFields.ExerciseTypeId]: Yup.boolean(),
  [screenFields.DurationId]: Yup.mixed<WorkoutTimeData>()
    .required(i18next.t(ResKey.FieldDurationError))
    .test({
      name: 'isEmpty',
      test(value, ctx) {
        if (WorkoutTimeHelper.isEmpty(value)) {
          return ctx.createError({message: i18next.t(ResKey.FieldDurationError)});
        } else {
          return true;
        }
      },
    })
    .label(i18next.t(ResKey.FieldDuration)),
  [screenFields.RepId]: Yup.number().when([screenFields.ExerciseTypeId], {
    is: false,
    then: schema => schema.required(i18next.t(ResKey.FieldRepError)).min(1, ' '),
  }),
});

type ExerciseAddEditProps = NativeStackScreenProps<MainStackParamList, ScreenNames.MainExerciseAddEdit>;

export default function ExerciseAddEdit(props: ExerciseAddEditProps) {
  const {idLadder, componentId, parentGroupId, isFromWorkout, isRepBased} = props.route.params;
  let selectedComponent: WorkoutComponentData | null = null;
  const {t} = useTranslation();
  const isKeyboardVisible = useKeyboardAware('ExerciseAddEdit');

  if (isFromWorkout) {
    selectedComponent = useSelector(state => selectComponentByIdLadder(state, idLadder, componentId));
  } else {
    selectedComponent = useSelector(state => selectExerciseById(state, parentGroupId, componentId));
  }

  const dispatch = useDispatch();

  const isTimeBased =
    (selectedComponent && selectedComponent.componentType === WorkoutComponentType.ExerciseRepBased) ||
    (selectedComponent == null && isRepBased != null && isRepBased)
      ? false
      : true;

  const isRest =
    selectedComponent &&
    selectedComponent.componentType === WorkoutComponentType.ExerciseTimeBased &&
    selectedComponent.isRest
      ? true
      : false;

  // console.log('ExerciseAddEdit selectedComponent: ', selectedComponent);

  // let durationText = isTimeBased ? 'Duration' : 'Estimated Duration';

  // useEffect(() => {
  //   LogService.debug('ExerciseAddEdit useEffect', TimeHelper.timeStampNow());
  // }, []);

  const handleBackButton = useCallback(() => {
    // console.log('Back button pressed!');
    props.navigation.navigate(ScreenNames.MainWarningBack, {message: t(ResKey.WarningConfirmationEditing)});
    return true;
  }, []);
  useOverrideHardwareBackPress(handleBackButton);

  const keyboardAwareAnimStyle = useAnimatedStyle(() => {
    return {
      // display: isKeyboardVisible.value ? 'none' : 'flex',
      opacity: isKeyboardVisible.value ? 0 : 1,
    };
  }, []);

  const handleSave = useCallback((values: any) => {
    LogService.debug('handleSave');
    const name: string = values[screenFields.NameId];
    const description: string = values[screenFields.DescriptionId];
    const lap: number = values[screenFields.LapId];
    const isTimeBased: boolean = values[screenFields.ExerciseTypeId];
    const duration: WorkoutTimeData = values[screenFields.DurationId];
    const rep: number = values[screenFields.RepId];
    const isRest: boolean = values[screenFields.isRestId];

    let exercise: WorkoutComponentData;
    let tmpId = componentId ? componentId : v4();
    if (isTimeBased) {
      exercise = WorkoutHelper.createExerciseTimeBased(tmpId, name, description, isRest, lap, duration);
    } else {
      exercise = WorkoutHelper.createExerciseRepBased(tmpId, name, description, lap, duration, rep);
    }

    LogService.debug(String.format('ExerciseAdd  : {0}', exercise));

    if (isFromWorkout) {
      if (componentId == null) {
        //new component
        dispatch(AddComponent({idLadder: idLadder, component: exercise} satisfies PayloadAddComponent));
      } else {
        // update component
        dispatch(
          UpdateComponent({
            idLadder: idLadder,
            componentId: componentId,
            component: exercise,
          } satisfies PayloadUpdateComponent),
        );
      }
    } else {
      if (componentId == null) {
        //new component
        dispatch(
          AddExerciseToGroup({parentId: parentGroupId!, exercise: exercise} satisfies PayloadAddExerciseToGroup),
        );
      } else {
        // update component
        dispatch(
          UpdateExerciseInGroup({parentId: parentGroupId!, exercise: exercise} satisfies PayloadUpdateExerciseInGroup),
        );
      }
    }
    props.navigation.goBack();
  }, []);

  LogService.debug('rerender ExerciseAdd');
  // todo: acildiginda toggle butonu animasyonla secimi yapiyor buna gerek yok.
  return (
    // <GestureHandlerRootView style={styles.containerGestureHandler}>
    <View style={styles.containerMain}>
      <Formik
        initialValues={{
          [screenFields.NameId]: selectedComponent ? selectedComponent.name : '',
          [screenFields.DescriptionId]: selectedComponent ? selectedComponent.description : '',
          [screenFields.LapId]: selectedComponent ? selectedComponent.lap : 1,
          [screenFields.ExerciseTypeId]: isTimeBased,
          [screenFields.isRestId]: isRest,
          [screenFields.DurationId]: selectedComponent ? selectedComponent.duration : null,
          [screenFields.RepId]: selectedComponent && selectedComponent.reps ? selectedComponent.reps : 1,
        }}
        validationSchema={validationSchema}
        onSubmit={(values: any) => {
          // console.log(values);
          handleSave(values);
        }}>
        {formik => (
          <>
            {/* <FormValues
              onChangeValues={values => {
                console.log('values changed', values);
              }}
            /> */}
            <ScrollContainer>
              <View style={styles.containerTop}>
                <Field
                  component={FormFieldTextInput}
                  name={screenFields.NameId}
                  label={t(ResKey.FieldName)}
                  placeholder={t(ResKey.PlaceHolderName)}
                />
                <Field
                  component={FormFieldTextInput}
                  name={screenFields.DescriptionId}
                  label={t(ResKey.FieldDescription)}
                  placeholder={t(ResKey.PlaceHolderDescription)}
                  maxLength={400}
                />
                <Field
                  component={FormFieldNumInput}
                  name={screenFields.LapId}
                  label={t(ResKey.FieldLap)}
                  placeholder={t(ResKey.PlaceHolderLap)}
                />
                <Field
                  component={FormFieldExerciseType}
                  name={screenFields.ExerciseTypeId}
                  label={t(ResKey.FieldExerciseType)}
                />
                <Field
                  component={FormFieldDuration}
                  name={screenFields.DurationId}
                  label={
                    formik.values[screenFields.ExerciseTypeId]
                      ? t(ResKey.FieldDuration)
                      : t(ResKey.FieldDurationEstimated)
                  }
                />
                {!formik.values[screenFields.ExerciseTypeId] && (
                  <Field
                    component={FormFieldNumInput}
                    name={screenFields.RepId}
                    label={t(ResKey.FieldRep)}
                    placeholder={t(ResKey.PlaceHolderRep)}
                  />
                )}
                {formik.values[screenFields.ExerciseTypeId] && (
                  <Field
                    component={FormFieldCheckedButton}
                    name={screenFields.isRestId}
                    label={t(ResKey.FieldIsRest)}
                  />
                )}
              </View>
            </ScrollContainer>

            <Animated.View style={[styles.containerBottom, keyboardAwareAnimStyle]}>
              <StdButtonCancel
                onPress={() => {
                  props.navigation.goBack();
                }}
              />
              <FormSubmitButtonIcon />
            </Animated.View>
          </>
        )}
      </Formik>
    </View>
    // </GestureHandlerRootView>
  );
}
const styles = StyleSheet.create({
  containerGestureHandler: {flex: 1},
  containerMain: {
    flex: 1,
  },
  containerTop: {
    flex: 1,
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    // padding: SizeConstants.paddingLarge,
  },
  containerBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: SizeConstants.paddingSmall,
    paddingBottom: SizeConstants.paddingSmall,
  },
});
