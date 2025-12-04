import {useCallback, useEffect, useRef} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import Animated, {useAnimatedStyle, useSharedValue} from 'react-native-reanimated';
import {ColorConstants, FontConstants} from '../../constants/StyleConstants';
import {CountDownAnimeHelper} from './CountDownAnimeHelper';
import {LogService} from '../../services/Log/LogService';
import {CircularProgress} from '../CircularProgress';
import {AnimeConstants} from './AnimeConstants';
import {TextDisplay} from '../TextDisplay';
import {useTranslation} from 'react-i18next';
import {ResKey} from '../../lang/ResKey';
import usePlaySound from './usePlaySound';
import CountDownExplanation from './CountDownExplanation';
import {WorkoutCounter} from '../../views/WorkoutPlayer/WorkoutCounter';
import {CounterInfo} from '../../views/WorkoutPlayer/CounterInfo';
import {WorkoutPlayerInfo} from '../../views/WorkoutPlayer/WorkoutPlayerInfo';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

type RepAnimeProps = {
  playerInfo: WorkoutPlayerInfo;
  explanationText: string;
  durationInSeconds: number;
  reps: number;
  workoutCounterRef: React.MutableRefObject<WorkoutCounter | null>;
  willStop?: boolean;
  playStartSound?: () => Promise<boolean>;
  onStarted?: () => void;
  onCompleted?: () => void;
};

export default function RepAnime(props: RepAnimeProps) {
  const {
    playerInfo,
    explanationText,
    durationInSeconds,
    reps,
    willStop,
    playStartSound,
    onStarted,
    onCompleted,
    workoutCounterRef,
  } = props;
  const percentage = useSharedValue(AnimeConstants.PercentageInitalRep);
  const counter = useSharedValue(0);
  // const startTimeRef = useRef(Date.now());
  // const lapsedTimeInMilliSecondsRef = useRef(0);
  const lapsedTimeTextRef = useSharedValue<string>(CountDownAnimeHelper.toRemainingTimeText(0, true));
  const {t} = useTranslation();
  usePlaySound(explanationText, playStartSound, reps);
  const animeDimensionWitdhRef = useRef(Math.min(windowHeight, windowWidth) * AnimeConstants.DimensionRatio);
  // console.log('animeDimensionWitdh ', animeDimensionWitdhRef.current);

  // useEffect(() => {
  //   LogService.debug('effect.counter- willStop: ', willStop);
  //   if (willStop != undefined && willStop) {
  //     let lapsedTime = Date.now() - startTimeRef.current;
  //     lapsedTimeInMilliSecondsRef.current = lapsedTimeInMilliSecondsRef.current + lapsedTime;
  //     // durduruldugunda timeri clear etmem lazim cunku devam denildiginde tekrar cagriliyor.
  //     // clearInterval(counterIntervalId);
  //     return;
  //   } else {
  //     startTimeRef.current = Date.now();
  //   }
  //   const counterIntervalId = setInterval(() => {
  //     let lapsedTime = Date.now() - startTimeRef.current;
  //     let tmpCalculatedCounterInSeconds = Math.floor((lapsedTimeInMilliSecondsRef.current + lapsedTime) / 1000);

  //     let tmpCounter = counter.value;
  //     // LogService.debug('useEffect.counter: ', counterRef.current);
  //     if (tmpCalculatedCounterInSeconds !== tmpCounter) {
  //       counter.value = tmpCalculatedCounterInSeconds;
  //       lapsedTimeTextRef.value = CountDownAnimeHelper.toRemainingTimeText(tmpCalculatedCounterInSeconds);
  //     }
  //   }, 100);

  //   return () => clearInterval(counterIntervalId);
  // }, [willStop]);

  useEffect(() => {
    if (playerInfo != null && playerInfo.componentInfo != null) {
      workoutCounterRef.current?.startComponent(playerInfo.isPreviousCompleted, playerInfo.componentInfo);
    }
  }, []);

  const counterHandler = useCallback(
    (info: CounterInfo) => {
      // elapsedTime icin floor daha uygun
      // LogService.infoFormat('counterHandler: {0}', LogHelper.toString(info));
      if (info.componentInfo != null) {
        // lapsedTimeInMilliSecondsRef.current = info.componentInfo.elapsedInMilliseconds;
        let tmpCalculatedCounterInSeconds = Math.floor(info.componentInfo.elapsedInMilliseconds / 1000);
        // let tmpCounter = counter.value;
        // LogService.infoFormat('counterHandler: ', tmpCounter);
        if (tmpCalculatedCounterInSeconds !== counter.value) {
          counter.value = tmpCalculatedCounterInSeconds;
          lapsedTimeTextRef.value = CountDownAnimeHelper.toRemainingTimeText(tmpCalculatedCounterInSeconds);
        }
      }
    },
    [workoutCounterRef.current],
  );

  useEffect(() => {
    if (workoutCounterRef.current != null) {
      workoutCounterRef.current.addListener(counterHandler);
    }
    return () => {
      if (workoutCounterRef.current != null) {
        workoutCounterRef.current.removeListener(counterHandler);
      }
    };
  }, [workoutCounterRef.current]);

  // useEffect(() => {
  //   LogService.debug('start---------------------CountDownAnime');
  //   LogService.debug('tts effect text: ', explanationText);
  //   // Tts.speak(explanationText);
  //   // return () => {
  //   //   Tts.stop();
  //   // };

  //   if (playStartSound) {
  //     const playSound = async () => {
  //       try {
  //         const succces = await playStartSound();
  //         LogService.debug('played successfully result: %s', succces);
  //       } catch (error) {
  //         LogService.debug('couldnt play!! result: %s', error);
  //       }

  //       LogService.debug('speak: ');
  //       Tts.speak(explanationText + ' ' + reps + ' ' + t(ResKey.WorkoutPlayerRep));
  //     };

  //     playSound();
  //   } else {
  //     LogService.debug('speak2: ');
  //     Tts.speak(explanationText);
  //   }

  //   return () => {
  //     Tts.stop();
  //   };
  // }, []);

  useEffect(() => {
    if (onStarted != null) {
      LogService.debug('onStarted called');
      onStarted();
    }

    return () => {};
  }, []);

  const containerTextAnimStyle = useAnimatedStyle(() => {
    return {
      // height: AnimeConstants.Dimension,
      // paddingHorizontal: AnimeConstants.Dimension / 8,
      // paddingVertical: AnimeConstants.Dimension / 4,

      height: animeDimensionWitdhRef.current,
      paddingHorizontal: animeDimensionWitdhRef.current / 8,
      paddingVertical: animeDimensionWitdhRef.current / 4,
    };
  }, []);

  const containerCounterTextAnimStyle = useAnimatedStyle(() => {
    return {
      // height: AnimeConstants.Dimension / 2,
      // width: AnimeConstants.Dimension,
      // paddingBottom: (AnimeConstants.Dimension * 1.25) / 16,

      height: animeDimensionWitdhRef.current / 2,
      width: animeDimensionWitdhRef.current,
      paddingBottom: (animeDimensionWitdhRef.current * 1.25) / 16,
    };
  }, []);

  const containerRepTextAnimStyle = useAnimatedStyle(() => {
    return {
      // height: AnimeConstants.Dimension / 2,
      // width: AnimeConstants.Dimension,
      // paddingTop: (AnimeConstants.Dimension * 1.25) / 16,

      height: animeDimensionWitdhRef.current / 2,
      width: animeDimensionWitdhRef.current,
      paddingTop: (animeDimensionWitdhRef.current * 1.25) / 16,
    };
  }, []);

  LogService.debug('RepAnime render================================');

  return (
    <View style={styles.container}>
      <CircularProgress
        progressColor={ColorConstants.primary}
        strokeShadowColor={AnimeConstants.StrokeShadowColor}
        strokeOpacity={AnimeConstants.StrokeOpacity}
        percentage={percentage}
        radius={animeDimensionWitdhRef.current / 2}
        strokeWidth={AnimeConstants.ProgressStrokeWidth}>
        <Animated.View style={[styles.containerRepText, containerRepTextAnimStyle]}>
          <Text style={styles.textRep}>{t(ResKey.FieldRep) + ': ' + reps}</Text>
        </Animated.View>
        <Animated.View style={[styles.containerText, containerTextAnimStyle]}>
          <CountDownExplanation explanationText={explanationText} />
        </Animated.View>
        <Animated.View style={[styles.containerCounterText, containerCounterTextAnimStyle]}>
          <TextDisplay style={styles.textCounter} text={lapsedTimeTextRef} />
        </Animated.View>
      </CircularProgress>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    alignContent: 'center',
    textAlignVertical: 'center',
    // backgroundColor: BackgColor,
    // backgroundColor: 'green',
    // padding: 20,
  },

  containerText: {
    // backgroundColor: 'green',
    position: 'absolute',
    // height: AnimeConstants.Dimension,
    justifyContent: 'center',
    // paddingHorizontal: AnimeConstants.ProgressStrokeWidth * 2,
    // paddingHorizontal: AnimeConstants.Dimension / 8,
    // paddingVertical: AnimeConstants.Dimension / 4,
    // borderColor: 'green',
    // borderWidth: 1,
    // flex: 1,
  },
  containerCounterText: {
    // backgroundColor: 'green',
    position: 'absolute',
    bottom: 0,
    // height: AnimeConstants.Dimension / 2,
    // width: AnimeConstants.Dimension,
    justifyContent: 'flex-end',
    // paddingHorizontal: AnimeConstants.ProgressStrokeWidth * 2,
    // paddingHorizontal: AnimeConstants.Dimension / 8,
    // paddingBottom: (AnimeConstants.Dimension * 1.25) / 16,
    // borderColor: 'blue',
    // borderWidth:
  },
  containerRepText: {
    // backgroundColor: 'green',
    position: 'absolute',
    top: 0,
    // height: AnimeConstants.Dimension / 2,
    // width: AnimeConstants.Dimension,
    justifyContent: 'flex-start',
    // paddingHorizontal: AnimeConstants.ProgressStrokeWidth * 2,
    // paddingHorizontal: AnimeConstants.Dimension / 8,
    // paddingTop: (AnimeConstants.Dimension * 1.25) / 16,
    // borderColor: 'blue',
    // borderWidth: 1,
  },
  textCounter: {
    // backgroundColor: 'brown',
    // bottom: 0,
    color: ColorConstants.primary,
    fontSize: AnimeConstants.FontSize,
    fontFamily: FontConstants.familyRegular,
    fontWeight: FontConstants.weightBold,
    textAlign: 'center',
    // borderColor: 'yellow',
    // borderWidth: 1,
  },

  textRep: {
    // backgroundColor: 'brown',
    color: ColorConstants.primary,
    fontSize: AnimeConstants.FontSize * 0.6,
    fontFamily: FontConstants.familyRegular,
    fontWeight: FontConstants.weightBold,
    textAlign: 'center',
    // borderColor: 'yellow',
    // borderWidth: 1,
  },
});
