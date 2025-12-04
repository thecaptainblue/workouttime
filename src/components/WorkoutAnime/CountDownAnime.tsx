import {useCallback, useEffect, useRef} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import Animated, {Easing, cancelAnimation, useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';
import {ColorConstants, FontConstants} from '../../constants/StyleConstants';
import Tts from 'react-native-tts';
import {CountDownAnimeHelper} from './CountDownAnimeHelper';
import {LogService} from '../../services/Log/LogService';
import CountDownExplanation from './CountDownExplanation';
import {CircularProgress} from '../CircularProgress';
import {TextDisplay} from '../TextDisplay';
import {AnimeConstants} from './AnimeConstants';
import usePlaySound from './usePlaySound';
import {WorkoutCounter} from '../../views/WorkoutPlayer/WorkoutCounter';
import {CounterInfo} from '../../views/WorkoutPlayer/CounterInfo';
import {WorkoutPlayerInfo} from '../../views/WorkoutPlayer/WorkoutPlayerInfo';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

type CountdownAnimeProps = {
  playerInfo: WorkoutPlayerInfo;
  explanationText: string;
  durationInSeconds: number;
  workoutCounterRef: React.MutableRefObject<WorkoutCounter | null>;
  willStop?: boolean;
  playStartSound?: () => Promise<boolean>;
  onStarted?: () => void;
  onCompleted?: () => void;
};

export default function CountdownAnime({
  playerInfo,
  explanationText,
  durationInSeconds,
  workoutCounterRef,
  willStop,
  playStartSound,
  onStarted,
  onCompleted,
}: CountdownAnimeProps) {
  const percentage = useSharedValue(AnimeConstants.PercentageInital);
  const counter = useSharedValue(durationInSeconds);
  // const startTimeRef = useRef(Date.now());
  const remainingTimeInMilliSecondsRef = useRef(durationInSeconds * 1000);
  const remainingTimeText = useSharedValue(CountDownAnimeHelper.toRemainingTimeText(durationInSeconds));
  usePlaySound(explanationText, playStartSound);
  const animeDimensionWitdhRef = useRef(Math.min(windowHeight, windowWidth) * AnimeConstants.DimensionRatio);
  const isActiveRef = useRef(true);
  // const isStartedRef = useRef(false);

  // useEffect(() => {
  //   LogService.debug('effect.counter- willStop: ', willStop);
  //   if (willStop != undefined && willStop) {
  //     let lapsedTime = Date.now() - startTimeRef.current;
  //     remainingTimeInMilliSecondsRef.current = remainingTimeInMilliSecondsRef.current - lapsedTime;
  //     return;
  //   } else {
  //     startTimeRef.current = Date.now();
  //   }
  //   const counterIntervalId = setInterval(() => {
  //     let lapsedTimeInMilliseconds = Date.now() - startTimeRef.current;
  //     let tmpCalculatedCounterInSeconds = Math.ceil(
  //       (remainingTimeInMilliSecondsRef.current - lapsedTimeInMilliseconds) / 1000,
  //     );

  //     let tmpCounter = counter.value;
  //     if (tmpCounter > 0) {
  //       // LogService.debug('useEffect.counter: ', counterRef.current);
  //       if (tmpCalculatedCounterInSeconds !== tmpCounter) {
  //         counter.value = tmpCalculatedCounterInSeconds;
  //         remainingTimeText.value = CountDownAnimeHelper.toRemainingTimeText(tmpCalculatedCounterInSeconds);
  //         // console.log('remainingTimeText', remainingTimeText.value);

  //         if (tmpCalculatedCounterInSeconds > 0 && tmpCalculatedCounterInSeconds < 4) {
  //           Tts.speak(tmpCalculatedCounterInSeconds.toString());
  //         }
  //       }
  //     } else {
  //       clearInterval(counterIntervalId);
  //       if (onCompleted != null) {
  //         onCompleted();
  //       }
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
      if (isActiveRef.current && info.componentInfo != null && info.componentInfo.countdownInMilliseconds != null) {
        remainingTimeInMilliSecondsRef.current = info.componentInfo.countdownInMilliseconds;
        let tmpCalculatedCounterInSeconds = Math.ceil(info.componentInfo.countdownInMilliseconds / 1000);
        // let tmpCounter = counter.value;
        if (counter.value > 0) {
          if (tmpCalculatedCounterInSeconds !== counter.value) {
            // LogService.infoFormat(
            //   'counterHandler.counter: tmpCalculatedCounterInSeconds:{0} tmpCounter:{1}',
            //   tmpCalculatedCounterInSeconds,
            //   counter.value,
            // );
            counter.value = tmpCalculatedCounterInSeconds;
            remainingTimeText.value = CountDownAnimeHelper.toRemainingTimeText(tmpCalculatedCounterInSeconds);
            // console.log('remainingTimeText', remainingTimeText.value);

            if (tmpCalculatedCounterInSeconds > 0 && tmpCalculatedCounterInSeconds < 4) {
              Tts.speak(tmpCalculatedCounterInSeconds.toString());
            }
          }
        } else {
          isActiveRef.current = false;
          if (onCompleted != null) {
            onCompleted();
          }
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

  useEffect(() => {
    LogService.debug('effect.animation willStop: ', willStop);
    if (willStop != undefined && willStop) {
      cancelAnimation(percentage);
      return;
    }

    const toValuePercentage = 100;
    percentage.value = withTiming(toValuePercentage, {
      duration: remainingTimeInMilliSecondsRef.current,
      easing: Easing.linear,
    });

    let halfTime = (durationInSeconds * 1000) / 2;
    let tmpCounter = remainingTimeInMilliSecondsRef.current; // counterRef.current;
    LogService.debugFormat('-----------------------halfTime:{0},  counter:{1}', halfTime, tmpCounter);
  }, [willStop]);

  // useEffect(() => {
  //   LogService.debug('start---------------------CountDownAnime');
  //   LogService.debug('tts effect text: ', explanationText);
  //   // Tts.speak(explanationText);
  //   // return () => {
  //   //   Tts.stop();
  //   // };

  //   let tmpCurrentTime = Instant.now();
  //   let tdBeginPlayTimeFromStart = tmpCurrentTime.toEpochMilli() - tmpStartTimeRef.current.toEpochMilli();
  //   LogService.debug(
  //     String.format('tf================================= from start to begin play {0}', tdBeginPlayTimeFromStart),
  //   );
  //   if (playStartSound) {
  //     const playSound = async () => {
  //       try {
  //         tmpCurrentTime = Instant.now();
  //         let tdBeginPlayTimeFromStart2 = tmpCurrentTime.toEpochMilli() - tmpStartTimeRef.current.toEpochMilli();
  //         const succces = await playStartSound();
  //         LogService.debug(
  //           String.format('played successfully result: {0} td: {1}', succces, tdBeginPlayTimeFromStart2),
  //         );
  //       } catch (error) {
  //         LogService.debug(String.format('couldnt play!! result: %s', error));
  //       }

  //       tmpCurrentTime = Instant.now();
  //       let tdEndPlayTimeFromStart = tmpCurrentTime.toEpochMilli() - tmpStartTimeRef.current.toEpochMilli();
  //       LogService.debug(
  //         String.format('tf================================= from start to end play {0}', tdEndPlayTimeFromStart),
  //       );

  //       LogService.debug('speak: ');
  //       Tts.speak(explanationText);
  //     };

  //     playSound();
  //     // LogService.debug('speak2: ');
  //     // Tts.speak(explanationText);

  //     //////////////////////////////
  //     // playStartSound()
  //     //   .then(resolve => {
  //     //     LogService.debug('played successfully result: %s', resolve);
  //     //   })
  //     //   .catch(reject => {
  //     //     LogService.debug('couldnt play!! result: %s', reject);
  //     //   });
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
      // width: AnimeConstants.Dimension,
      // paddingHorizontal: AnimeConstants.Dimension / 8,
      // paddingVertical: AnimeConstants.Dimension / 4,
      height: animeDimensionWitdhRef.current,
      width: animeDimensionWitdhRef.current,
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

  LogService.debug('anime render================================');

  // LogService.debug('render percentageText: ', percentageText.value);
  return (
    <View style={styles.container}>
      <CircularProgress
        // strokeShadowColor={BackgColor}
        progressColor={ColorConstants.primary}
        strokeShadowColor={AnimeConstants.StrokeShadowColor}
        strokeOpacity={AnimeConstants.StrokeOpacity}
        percentage={percentage}
        radius={animeDimensionWitdhRef.current / 2}
        strokeWidth={AnimeConstants.ProgressStrokeWidth}>
        <Animated.View style={[styles.containerText, containerTextAnimStyle]}>
          <CountDownExplanation explanationText={explanationText} />
        </Animated.View>
        <Animated.View style={[styles.containerCounterText, containerCounterTextAnimStyle]}>
          <TextDisplay style={styles.textCounter} text={remainingTimeText} />
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
    // borderColor: 'white',
    // borderWidth: 1,
  },

  containerText: {
    // backgroundColor: 'green',
    position: 'absolute',
    // height: AnimeConstants.Dimension,
    // width: AnimeConstants.Dimension,
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
    // borderWidth: 1,
    // flex: 1,
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
});
