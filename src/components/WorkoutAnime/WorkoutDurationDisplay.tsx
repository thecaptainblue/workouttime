import {memo, useCallback, useEffect} from 'react';
import {WorkoutCounter} from '../../views/WorkoutPlayer/WorkoutCounter';
import {useSharedValue} from 'react-native-reanimated';
import {WorkoutTimeHelper} from '../../@types/WorkoutTimeHelper';
import {LogService} from '../../services/Log/LogService';
import {StyleSheet, Text, View} from 'react-native';
import {TextDisplay} from '../TextDisplay';
import {ColorConstants, FontConstants, SizeConstants} from '../../constants/StyleConstants';
import {CounterInfo} from '../../views/WorkoutPlayer/CounterInfo';
import {useTranslation} from 'react-i18next';
import {ResKey} from '../../lang/ResKey';

interface WorkoutDurationDisplayProps {
  workoutCounterRef: React.MutableRefObject<WorkoutCounter | null>;
}

function WorkoutDurationDisplayInner(props: WorkoutDurationDisplayProps) {
  const {workoutCounterRef} = props;
  const elapsedDurationText = useSharedValue(WorkoutTimeHelper.display(WorkoutTimeHelper.fromSeconds(0)));
  const {t} = useTranslation();

  const counterHandler = useCallback(
    (info: CounterInfo) => {
      // elapsedTime icin floor daha uygun
      if (info.workoutInfo != null) {
        const duration = WorkoutTimeHelper.fromSeconds(Math.floor(info.workoutInfo.elapsedInMilliseconds / 1000));
        elapsedDurationText.value = WorkoutTimeHelper.display(duration);
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

  LogService.debugFormat('WorkoutDurationDisplay rerender');
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{t(ResKey.FieldElapsed)}</Text>
      <TextDisplay style={styles.text} text={elapsedDurationText} />
    </View>
  );
}

export const WorkoutDurationDisplay = memo(WorkoutDurationDisplayInner);

const styles = StyleSheet.create({
  container: {
    // flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
    margin: SizeConstants.paddingSmallX,
  },
  text: {
    color: ColorConstants.onSurfaceDepth20,
    fontSize: FontConstants.sizeRegularX,
    fontFamily: FontConstants.familyRegular,
  },
});
