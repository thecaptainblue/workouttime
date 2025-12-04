import React, { useCallback, useEffect, useRef } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import { MainStackParamList } from '../../@types/MainStackParamList';
import { LogService } from '../../services/Log/LogService';
import { ColorConstants, FontConstants, SizeConstants } from '../../constants/StyleConstants';
import { useTranslation } from 'react-i18next';
import useLoadStartSound from './useLoadStartSound';
import { ResKey } from '../../lang/ResKey';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import usePlayEnd from '../../components/WorkoutAnime/usePlayEnd';
import { ScreenNames } from '../Screens/ScreenNames';
import { useOverrideHardwareBackPress } from '../../hooks/useOverrideHardwareBackPress';
import { useAd } from '../../providers/AdProvider';

type WorkoutPlayerEndProps = NativeStackScreenProps<MainStackParamList, ScreenNames.MainWorkoutPlayerEnd>;

export default function WorkoutPlayerEnd(props: WorkoutPlayerEndProps) {
  const { workoutTimeText, exerciseTimeText, restTimeText } = props.route.params;
  const startSoundPromiseRef = useRef<() => Promise<boolean>>(undefined);
  const endSoundPromiseRef = useRef<() => Promise<boolean>>(undefined);
  const { t } = useTranslation();
  useLoadStartSound(startSoundPromiseRef, endSoundPromiseRef);
  usePlayEnd([t(ResKey.WorkoutPlayerEnd), t(ResKey.WorkoutPlayerEndMessage)], endSoundPromiseRef.current);
  const { showInterstitialAd, isInterstitialAdLoaded } = useAd();
  const adShownRef = useRef(false);

  useEffect(() => {
    LogService.debug('start========================WorkoutPlayerEnd');
    // const workout = props.route.params.workout;
  }, []);

  useEffect(() => {
    if (isInterstitialAdLoaded && !adShownRef.current) {
      showInterstitialAd();
      adShownRef.current = true;
    }
  }, [isInterstitialAdLoaded, showInterstitialAd]);

  const handleBackButton = useCallback(() => {
    // console.log('Back button pressed!');
    props.navigation.navigate(ScreenNames.MainHome);
    return true;
  }, []);
  useOverrideHardwareBackPress(handleBackButton);

  LogService.debug('rerender WorkoutPlayerEnd');

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{t(ResKey.WorkoutPlayerEnd)}</Text>
      <View style={styles.subContainer}>
        <Text style={styles.subText}>{t(ResKey.WorkoutPlayerEndCongratulations)}</Text>
        <MaterialIcon
          name="rocket-launch"
          size={FontConstants.sizeLargeXX}
          color={ColorConstants.primary}
          style={styles.icon}
        />
      </View>
      <View style={styles.subContainer}>
        <Text style={styles.subText}>{t(ResKey.WorkoutPlayerEndPraise)}</Text>
      </View>
      <View style={styles.containerCounter}>
        <View style={styles.containerSubCounter}>
          <Text style={styles.durationText}>{t(ResKey.WorkoutPlayerEndTotalDuration)}</Text>
          <Text style={[styles.durationText, styles.durationTextTime]}>{workoutTimeText}</Text>
        </View>
        <View style={styles.containerSubCounter}>
          <Text style={styles.durationText}>{t(ResKey.WorkoutPlayerEndExerciseDuration)}</Text>
          <Text style={[styles.durationText, styles.durationTextTime]}>{exerciseTimeText}</Text>
        </View>
        <View style={styles.containerSubCounter}>
          <Text style={styles.durationText}>{t(ResKey.WorkoutPlayerEndRestDuration)}</Text>
          <Text style={[styles.durationText, styles.durationTextTime]}>{restTimeText}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // paddingTop: SizeConstants.paddingLarge,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subContainer: {
    // flex: 1,
    // paddingTop: SizeConstants.paddingLarge,
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
    // alignContent: 'center',
    // verticalAlign: 'middle',
    // borderColor: 'red',
    // borderWidth: 1,
    marginTop: SizeConstants.paddingLarge,
  },
  containerCounter: {
    // backgroundColor: 'red',
    marginTop: SizeConstants.paddingLarge,
  },
  containerSubCounter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: SizeConstants.paddingSmallX },
  text: {
    // backgroundColor: 'yellow',
    color: ColorConstants.primary,
    fontSize: FontConstants.sizeLargeXXXX * 1.5,
    fontFamily: FontConstants.familyRegular,
    textAlign: 'center',
  },
  subText: {
    // backgroundColor: 'yellow',
    // flex: 1,
    color: ColorConstants.onSurfaceDepth10,
    fontSize: FontConstants.sizeLargeXX,
    fontFamily: FontConstants.familyRegular,
    textAlign: 'center',
    // marginTop: SizeConstants.paddingLarge,
    // verticalAlign: 'middle',
    // textAlignVertical: 'center',
  },
  durationText: {
    color: ColorConstants.onSurfaceDepth10,
    fontSize: FontConstants.sizeRegular,
    fontFamily: FontConstants.familyRegular,
    textAlign: 'center',
  },
  durationTextTime: {
    marginLeft: SizeConstants.paddingRegular,
  },
  icon: {
    marginLeft: SizeConstants.paddingRegular,
  },
});
