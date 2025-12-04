import React, { useCallback, useEffect, useRef, useState } from 'react';
import { WorkoutTraverser } from './WorkoutTraverser';
import { WorkoutComponentInfo } from './WorkoutComponentInfo';
import { useKeepAwake } from '@sayem314/react-native-keep-awake';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import { MainStackParamList } from '../../@types/MainStackParamList';
import { LogService } from '../../services/Log/LogService';
import CountdownAnime from '../../components/WorkoutAnime/CountDownAnime';
import { ColorConstants, FontConstants, SizeConstants } from '../../constants/StyleConstants';
import RepAnime from '../../components/WorkoutAnime/RepAnime';
import { ServiceRegistry } from '../../services/ServiceRegistry';
import { WorkoutComponentType } from '../../@types/Data/WorkoutComponentType';
import { WorkoutTimeHelper } from '../../@types/WorkoutTimeHelper';
import { ButtonWTIcon } from '../../components/ButtonWTIcon';
import AntIcon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import { ResKey } from '../../lang/ResKey';
import useLoadStartSound from './useLoadStartSound';
import { ScreenNames } from '../Screens/ScreenNames';
import { AutoSizeText } from '../../components/WorkoutAnime/AutoSizeText';
import { AnimeConstants } from '../../components/WorkoutAnime/AnimeConstants';
import { useOverrideHardwareBackPress } from '../../hooks/useOverrideHardwareBackPress';
import { WorkoutCounter } from './WorkoutCounter';
import { WorkoutDurationDisplay } from '../../components/WorkoutAnime/WorkoutDurationDisplay';
import { useObserveAppState } from '../../hooks/useObserveAppState';
import { WorkoutPlayerInfo } from './WorkoutPlayerInfo';
import { CounterInfo } from './CounterInfo';
import { useRealm } from '@realm/react';
import { StatisticDocHelper } from '../../persistence/StatisticDocHelper';

type WorkoutPlayerProps = NativeStackScreenProps<MainStackParamList, ScreenNames.MainWorkoutPlayer>;

type CounterInfoText = {
  workoutTimeText: string;
  exerciseTimeText: string;
  restTimeText: string;
};

export default function WorkoutPlayer(props: WorkoutPlayerProps) {
  useKeepAwake();
  const registryRef = useRef(ServiceRegistry.getInstance());
  // const sound = useSelector(selectSound);
  const [isLoaded, setIsLoaded] = useState(false);
  const [willStop, setWillStop] = useState(false);
  const traverser = useRef<WorkoutTraverser | null>(null);
  const traverserNext = useRef<WorkoutTraverser | null>(null);
  const workoutCounterRef = useRef<WorkoutCounter | null>(null);
  const startSoundPromiseRef = useRef<() => Promise<boolean>>(undefined);
  const endSoundPromiseRef = useRef<() => Promise<boolean>>(undefined);
  const [workoutPlayerInfo, setWorkoutPlayerInfo] = useState<WorkoutPlayerInfo | null>(null);
  const [workoutComponentInfoNext, setWorkoutComponentInfoNext] = useState<WorkoutComponentInfo | null>(null);
  const { t } = useTranslation();
  useLoadStartSound(startSoundPromiseRef, endSoundPromiseRef, setIsLoaded);
  const realm = useRealm();

  const handleToggleStop = useCallback(() => {
    // LogService.debug('handleToggleStop');
    setWillStop(!willStop);
    workoutCounterRef.current?.toggleCount(!willStop);
    // traverser.current = new WorkoutTraverser(WorkoutService.getWorkout());
    // setWorkoutComponent(traverser.current.next());
  }, [willStop]);

  const backgroundCallback = useCallback(() => {
    if (willStop == false) {
      handleToggleStop();
    }
    // if (workoutCounterRef.current != null) {
    //   workoutCounterRef.current.toggleCount(true);
    // }
  }, [handleToggleStop, willStop]);
  useObserveAppState(backgroundCallback);

  useEffect(() => {
    // traverser.current = new WorkoutTraverser(WorkoutService.getWorkout());
    const workout = props.route.params.workout;
    LogService.debugFormat('start========================WorkoutPlayer, id:{0}', workout.id);
    traverser.current = new WorkoutTraverser(workout);
    const workoutComponent = traverser.current.next();
    setWorkoutPlayerInfo({ isPreviousCompleted: null, componentInfo: workoutComponent });

    traverserNext.current = new WorkoutTraverser(workout);
    traverserNext.current.next();
    setWorkoutComponentInfoNext(traverserNext.current.next());

    workoutCounterRef.current = new WorkoutCounter();

    return () => {
      if (workoutCounterRef.current != null) {
        const counterInfo = workoutCounterRef.current.stopWorkout(false, false) as CounterInfo | null;
        const workoutId = props.route.params.workout.id;
        StatisticDocHelper.addStatistic(realm, counterInfo, workoutId);
        workoutCounterRef.current = null;
      }
    };
  }, []);

  const handleBackButton = useCallback(() => {
    // console.log('Back button pressed!');
    props.navigation.navigate(ScreenNames.MainWarningBack, { message: t(ResKey.WarningConfirmationTerminatingWP) });
    return true;
  }, []);
  useOverrideHardwareBackPress(handleBackButton);

  const isStarted = useCallback((): boolean => {
    let result = false;
    if (traverser.current != null) {
      result = true;
    }
    return result;
  }, []);

  const traverseForwardWorkout = useCallback((isPreviousCompleted: boolean | null) => {
    LogService.debug('traverseForwardWorkout');
    const workoutComponent = traverser.current?.next();
    LogService.debug('traverseForwardWorkout:workoutComponent', workoutComponent);
    if (workoutComponent == null) {
      const counterInfo = workoutCounterRef.current?.stopWorkout(true, true) as CounterInfo | null;
      // LogService.infoFormat('traverseForwardWorkout counterInfo: {0}', LogHelper.toString(counterInfo));
      const workoutId = props.route.params.workout.id;
      const workoutName = props.route.params.workout.name;
      StatisticDocHelper.addStatistic(realm, counterInfo, workoutId);
      const workoutTimeTexts = getWorkoutTimeTexts(counterInfo);
      props.navigation.replace(ScreenNames.MainWorkoutPlayerEnd, {
        workoutName: workoutName,
        workoutTimeText: workoutTimeTexts.workoutTimeText,
        exerciseTimeText: workoutTimeTexts.exerciseTimeText,
        restTimeText: workoutTimeTexts.restTimeText,
      });
    } else {
      setWorkoutPlayerInfo({ isPreviousCompleted: isPreviousCompleted, componentInfo: workoutComponent });
      const workoutComponentNext = traverserNext.current?.next();
      setWorkoutComponentInfoNext(workoutComponentNext!);
    }
  }, []);

  const traverseBackwardWorkout = useCallback((isPreviousCompleted: boolean | null) => {
    LogService.debug('traverseBackwardWorkout');
    if (!traverser.current?.isTraverseBackwardCompleted()) {
      const isForwardCompleted = traverser.current?.isTraverseForwardCompleted();
      let workoutComponent = traverser.current?.previous();
      LogService.debug('traverseBackwardWorkout:workoutComponent', workoutComponent);
      setWorkoutPlayerInfo({ isPreviousCompleted: isPreviousCompleted, componentInfo: workoutComponent! });

      // if (workoutComponentInfo != null) setWorkoutComponentInfoNext(workoutComponentInfo);
      if (!isForwardCompleted) {
        let workoutComponentNext = traverserNext.current?.previous();
        setWorkoutComponentInfoNext(workoutComponentNext!);
      }
    }
  }, []);

  const handleInformExcersiceCompleted = useCallback(() => {
    LogService.debug('handleInformExcersiceCompleted----------------------------------------');
    traverseForwardWorkout(true);
  }, []);

  const handlePrevious = useCallback(() => {
    LogService.debug('handlePrevious----------------------------------------');
    traverseBackwardWorkout(false);
  }, []);

  const handleNext = useCallback(() => {
    LogService.debug('handleNext----------------------------------------');
    traverseForwardWorkout(false);
  }, []);

  const handleAnimationCompleted = useCallback(() => {
    LogService.debug('animation completed');
    traverseForwardWorkout(true);
  }, []);

  if (!isLoaded) {
    return null;
  }

  // LogService.debug('workoutComponent: ', workoutComponentInfo);
  let isExcersiceRepBased = false;
  let countDownContent;
  if (workoutPlayerInfo != null && workoutPlayerInfo?.componentInfo != null) {
    const excercise = workoutPlayerInfo.componentInfo.component;
    const lapNo = workoutPlayerInfo.componentInfo.lap;
    const excerciseType = excercise.componentType;
    if (excerciseType === WorkoutComponentType.ExerciseTimeBased) {
      countDownContent = (
        <CountdownAnime
          key={excercise.id.toString() + '-' + lapNo.toString()}
          playerInfo={workoutPlayerInfo}
          explanationText={excercise.name}
          durationInSeconds={WorkoutTimeHelper.toSeconds(excercise.duration!)}
          workoutCounterRef={workoutCounterRef}
          willStop={willStop}
          playStartSound={startSoundPromiseRef.current}
          // onStarted={handlePlayStartSound}
          onCompleted={handleAnimationCompleted}
        />
      );
    } else if (excerciseType === WorkoutComponentType.ExerciseRepBased) {
      isExcersiceRepBased = true;
      countDownContent = (
        <RepAnime
          key={excercise.id.toString() + '-' + lapNo.toString()}
          playerInfo={workoutPlayerInfo}
          explanationText={excercise.name}
          reps={excercise.reps!}
          durationInSeconds={WorkoutTimeHelper.toSeconds(excercise.duration!)}
          workoutCounterRef={workoutCounterRef}
          willStop={willStop}
          playStartSound={startSoundPromiseRef.current}
        // onStarted={handlePlayStartSound}
        // onCompleted={handleAnimationCompleted}
        />
      );
    }
  } else {
    let tmpExplanationText = '';
    if (isStarted()) {
      tmpExplanationText = t(ResKey.WorkoutPlayerEnd);
    }
    // countDownContent = <Text> No exercise</Text>;
    countDownContent = (
      <CountdownAnime
        key={-1}
        playerInfo={{ isPreviousCompleted: null, componentInfo: null }}
        explanationText={tmpExplanationText}
        durationInSeconds={0}
        workoutCounterRef={workoutCounterRef}
        playStartSound={endSoundPromiseRef.current}
      // onCompleted={handleAnimationCompleted}
      />
    );
  }

  let textNext = null;
  if (workoutPlayerInfo != null && workoutComponentInfoNext != null) {
    const excerciseNext = workoutComponentInfoNext.component;
    textNext = excerciseNext.name;
  }

  let isForwardDisabled = false;
  let isBackwardDisabled = false;
  if (traverser.current == null || traverser.current.isAtEnd()) {
    isForwardDisabled = true;
  }

  if (traverser.current == null || traverser.current.isAtStart()) {
    isBackwardDisabled = true;
  }

  // console.log('play button status forwardDisabled: %s, backwardDisabled: %s', isForwardDisabled, isBackwardDisabled);
  // textNext =
  ('This is a long text that goes beyond the available width of the screen. It demonstrates how to handle truncation and provide options for users to view the full content.');
  return (
    <View style={styles.container}>
      <View style={styles.containerElapsedDuration}>
        <WorkoutDurationDisplay workoutCounterRef={workoutCounterRef} />
      </View>
      <View style={styles.containerNext}>
        {textNext && (
          <>
            <Text style={styles.textNextTitle}>{t(ResKey.WorkoutPlayerNext)}</Text>
            {/* <Text style={styles.textNext}>{textNext}</Text> */}
            <AutoSizeText text={textNext} textStyle={styles.textNext} numberOfLines={1} />
          </>
        )}
      </View>
      <View style={styles.containerAnime}>{countDownContent}</View>

      <View style={styles.containerButtons}>
        <View
          style={[
            styles.containerButtonDone,
            { pointerEvents: isExcersiceRepBased ? 'auto' : 'none', opacity: isExcersiceRepBased ? 1 : 0 },
          ]}>
          <ButtonWTIcon
            isPressAnimationActive={true}
            ignoreDisabledOverlayDisplay={true}
            containerStyle={styles.buttonDone}
            onPress={handleInformExcersiceCompleted}>
            <MaterialIcon name="done" size={FontConstants.sizeLargeXXXX * 1.5} color={ColorConstants.primary} />
          </ButtonWTIcon>
        </View>
        <View style={styles.containerButtonPlay}>
          <ButtonWTIcon
            isPressAnimationActive={true}
            containerStyle={styles.button}
            ignoreDisabledOverlayDisplay={true}
            onPress={handlePrevious}
            disabled={isBackwardDisabled}>
            <AntIcon
              name="stepbackward"
              size={FontConstants.sizeLargeXXXX}
              color={isBackwardDisabled ? ColorConstants.disabled : ColorConstants.primary}
            />
          </ButtonWTIcon>
          <ButtonWTIcon
            isPressAnimationActive={true}
            ignoreDisabledOverlayDisplay={true}
            containerStyle={styles.button}
            onPress={handleToggleStop}>
            {willStop && (
              <AntIcon name="caretright" size={FontConstants.sizeLargeXXXX} color={ColorConstants.primary} />
            )}
            {!willStop && <AntIcon name="pause" size={FontConstants.sizeLargeXXXX} color={ColorConstants.primary} />}
          </ButtonWTIcon>
          <ButtonWTIcon
            isPressAnimationActive={true}
            ignoreDisabledOverlayDisplay={true}
            containerStyle={styles.button}
            onPress={handleNext}
            disabled={isForwardDisabled}>
            <AntIcon
              name="stepforward"
              size={FontConstants.sizeLargeXXXX}
              color={isForwardDisabled ? ColorConstants.disabled : ColorConstants.primary}
            />
          </ButtonWTIcon>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // paddingTop: SizeConstants.paddingLarge,
    flex: 1,
    // backgroundColor: 'yellow',
  },
  containerNext: {
    flex: 1.3,
    justifyContent: 'space-evenly',
    alignContent: 'center',
    paddingHorizontal: SizeConstants.paddingSmallX,
    // textAlign: 'justify',
    // backgroundColor: '#dcdcde', // ColorConstants.backgroundLight, // 'yellow',
    // borderColor: 'yellow',
    // borderWidth: 1,
  },
  containerElapsedDuration: {
    position: 'absolute',
    left: SizeConstants.paddingSmallX,
  },

  containerAnime: {
    flex: 5,
    paddingTop: 10,
    // backgroundColor: 'green',
    justifyContent: 'center',
    alignContent: 'center',
  },

  containerButtonDone: {
    // flex: 2,
    justifyContent: 'space-around',
    // flexDirection: 'row',
    // backgroundColor: 'cyan',
  },

  containerButtonPlay: {
    // flex: 2,
    // justifyContent: 'space-around',
    flexDirection: 'row',
    // flexDirection: 'row',
    // backgroundColor: 'yellow',
    paddingBottom: 5,
  },

  containerButtons: {
    flex: 2.5,
    justifyContent: 'space-around',
    alignItems: 'center',

    // flexDirection: 'row',
    // backgroundColor: 'red',
    // paddingBottom: 20,
  },

  textNextTitle: {
    // backgroundColor: 'yellow',
    color: ColorConstants.onSurfaceDepth20,
    fontSize: FontConstants.sizeRegularX,
    fontFamily: FontConstants.familyRegular,
    textAlign: 'center',
  },
  textNext: {
    // backgroundColor: 'yellow',
    color: ColorConstants.onSurfaceDepth15,
    fontSize: AnimeConstants.FontSize * 0.6,
    fontFamily: FontConstants.familyRegular,
    // fontWeight: FontConstants.,
    // textAlign: 'justify',
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'transparent',
    // backgroundColor: ColorConstants.primary,
    // opacity: 0.4,
    padding: 5,

    margin: SizeConstants.paddingLarge,
    // borderRadius: SizeConstants.borderRadius,
  },
  buttonDone: {
    backgroundColor: 'transparent',
  },
});

function getWorkoutTimeTexts(info: CounterInfo | null): CounterInfoText {
  let workoutTimeText = '-';
  let exerciseTimeText = '-';
  let restTimeText = '-';
  // LogService.infoFormat('getWorkoutTimeTexts info: {0}', LogHelper.toString(info));
  if (info != null) {
    if (info.containerInfo != null) {
      const containerInfo = info.containerInfo;
      const exerciseTimeInSeconds = Math.floor(containerInfo.totalWorkDurationInMilliseconds / 1000);
      exerciseTimeText = WorkoutTimeHelper.display(WorkoutTimeHelper.fromSeconds(exerciseTimeInSeconds));
      const restTimeInSeconds = Math.floor(containerInfo.totalRestDurationInMilliseconds / 1000);
      restTimeText = WorkoutTimeHelper.display(WorkoutTimeHelper.fromSeconds(restTimeInSeconds));

      const workoutTimeInSeconds = exerciseTimeInSeconds + restTimeInSeconds;
      workoutTimeText = WorkoutTimeHelper.display(WorkoutTimeHelper.fromSeconds(workoutTimeInSeconds));
    }
  }

  return { workoutTimeText: workoutTimeText, exerciseTimeText: exerciseTimeText, restTimeText: restTimeText };
}
