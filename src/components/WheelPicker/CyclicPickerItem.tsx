import {StyleProp, StyleSheet, TextStyle} from 'react-native';
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import {convertToRadian} from '../../helper/AnimationHelper';
import {LogService} from '../../services/Log/LogService';
import {TextDisplayStateBased} from '../TextDisplayStateBased';
import useWhatChanged from '../../hooks/useWhatChanged';
import {TextDisplay} from '../TextDisplay';

export interface valuesItem {
  value: number;
  label: string;
}
interface PickerItemShared {
  topPosition: number;
  textDisplay: string;
  rotateXReal?: number;
  realScale?: number;
  isVisible: boolean;
}

interface CyclicPickerItemProps {
  index: number;
  itemHeight: number;
  position: SharedValue<number>;
  visibleItemSize: number;
  hiddenItemSize: number;
  values: valuesItem[];
  perspective: number;
  textStyle?: StyleProp<TextStyle>;
  isMiddleItemUnvisible?: SharedValue<boolean>;
}

const clampBound = 90;

export default function CyclicPickerItem(props: CyclicPickerItemProps) {
  const {
    index,
    itemHeight,
    position,
    visibleItemSize,
    values,
    hiddenItemSize,
    perspective,
    textStyle,
    isMiddleItemUnvisible,
  } = props;
  useWhatChanged(props, 'CyclicPickerItem');

  const pickerItemSharable = useDerivedValue(() => {
    return calculatePickerItem(
      visibleItemSize,
      hiddenItemSize,
      itemHeight,
      values,
      index,
      position,
      perspective,
      isMiddleItemUnvisible,
    );
  });

  const textDisplay = useDerivedValue(() => {
    return pickerItemSharable.value.textDisplay;
  });

  const animStyleItem = useAnimatedStyle(() => {
    // console.log(
    //   'topPosition:%s, midItemTop:%s, index:%s lowBound:%s, midBound:%s, highBound:%s',
    //   topPosition.value,
    //   midItemTop,
    //   index,
    //   lowBound,
    //   midBound,
    //   highBound,
    // );

    return {
      top: pickerItemSharable.value.topPosition,
      // transform: [
      //   {rotateX: `${pickerItemSharable.value.rotateXReal}` + 'deg'},
      //   {scale: pickerItemSharable.value.realScale},
      // ],
      // opacity: isUnvisible != null && isUnvisible.value ? 0 : 1,
      opacity: pickerItemSharable.value.isVisible ? 1 : 0,
    };
  }, []);

  // LogService.debug('rerender CPItem index  text ', index, textDisplay.value);

  return (
    <Animated.View key={index} style={[styles.item, {height: itemHeight}, animStyleItem]}>
      {/* <TextDisplayStateBased style={[styles.label, {lineHeight: itemHeight}, textStyle]} text={textDisplay} /> */}
      <TextDisplay style={[styles.label, {lineHeight: itemHeight}, textStyle]} text={textDisplay} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  item: {
    // height: ITEM_HEIGHT,
    justifyContent: 'center',
    // backgroundColor: 'blue',
    // transform: [{rotateX: '-60deg'}],
    position: 'absolute',
    // borderColor: 'orange',
    // borderWidth: 1,
    alignSelf: 'center',
    // left: '50%',
  },
  label: {
    color: 'white',
    fontFamily: 'SFProText-Semibold',
    fontSize: 24,
    // lineHeight: ITEM_HEIGHT,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});

function calculateIsVisible(
  isMiddleItemUnvisible: SharedValue<boolean> | undefined,
  topPosition: number,
  midItemTop: number,
  itemHeight: number,
) {
  'worklet';
  let isVisible = true;
  if (
    isMiddleItemUnvisible != null &&
    isMiddleItemUnvisible.value &&
    Math.abs(topPosition - midItemTop) <= itemHeight / 2
  ) {
    isVisible = false;
  }
  return isVisible;
}

function calculateRealScale(overallPanelHeight: number, rotateXReal: number, perspective: number) {
  'worklet';
  let result = 1;
  const radiusNormalized = overallPanelHeight / 2;
  const z = radiusNormalized * Math.cos(convertToRadian(rotateXReal)) - radiusNormalized;
  //todo: perpective ile item heightin bir baglantisi olmasi lazim ki item height degisikliklerinde oran bozulmasin.
  result = perspective / (perspective - z);
  return result;
}

function calculateRotateXReal(
  topPosition: number,
  hiddenItemSize: number,
  itemHeight: number,
  radiusOverallSizeCapped: number,
  overallPanelHeight: number,
) {
  'worklet';
  // cizimi daha yumusak yapmak icin bound size itemHeight kadar uzatilabilir ya da clampBound dusurulebilir.
  const lowBound = (-hiddenItemSize / 2) * itemHeight; // - itemHeight;
  const midBound = radiusOverallSizeCapped * itemHeight - (hiddenItemSize / 2) * itemHeight;
  const highBound = overallPanelHeight - itemHeight - (hiddenItemSize / 2) * itemHeight; //+ itemHeight;
  let angle = 0; // 0 yapinca index range disina cikinca gozukuyor.
  //display wheel; change angel display
  angle = interpolate(topPosition, [lowBound, midBound, highBound], [clampBound, 0, -clampBound], Extrapolation.CLAMP);
  // console.log(
  //   ' index: %s topPosition: %s lowBound: %s midBound: %s highBound: %s angle: %s ',
  //   index,
  //   topPosition.value,
  //   lowBound,
  //   midBound,
  //   highBound,
  //   angle,
  // );
  return angle;
}

function calculateTopPosition(
  position: SharedValue<number>,
  index: number,
  itemHeight: number,
  overallPanelHeight: number,
  hiddenItemSize: number,
) {
  'worklet';
  const currentPosition = position.value + index * itemHeight;
  let result;
  if (currentPosition >= 0) {
    result = currentPosition % overallPanelHeight;
  } else {
    const tmp = currentPosition % overallPanelHeight;
    result = overallPanelHeight + tmp;
  }
  result -= (hiddenItemSize / 2) * itemHeight;

  // if (tmpIndex == 0) {
  //   console.log(' currentPosition: %s result: %s', currentPosition, result);
  // }
  return result;
}

function calculateTextDisplay(virtualIndex: number, values: valuesItem[]) {
  'worklet';
  let result = '';
  if (virtualIndex >= 0 && virtualIndex < values.length) {
    result = values[virtualIndex].label;
    // defaultTextDisplay.current = values[virtualIndex.value].label;
    // console.log('virtualIndex derivedValue; textDisplay ', values[result].label);
  } else {
    // console.log(
    //   'wrong virtualIndex: %s currentPosition: %s position: %s index: %s',
    //   result,
    //   currentPosition,
    //   position.value,
    //   index,
    // );
  }

  return result;
}

function calculateVirtualIndex(
  position: SharedValue<number>,
  overallPanelHeight: number,
  values: valuesItem[],
  index: number,
  itemHeight: number,
  overallPanelSize: number,
) {
  'worklet';
  let result = -1;

  const currentPosition = (position.value % (overallPanelHeight * values.length)) + index * itemHeight;
  if (currentPosition >= 0) {
    //downward direction  translatey is positive
    const visibleHeightFactor = Math.floor(currentPosition / overallPanelHeight);
    result = values.length - ((visibleHeightFactor * overallPanelSize) % values.length) + index;
  } else {
    //upward direction translatey is negative
    const visibleHeightFactor = Math.floor(currentPosition / -overallPanelHeight);
    result = (visibleHeightFactor + 1) * overallPanelSize + index; // - hiddenItemSize / 2;
  }

  result = result % values.length;
  return result;
}

function calculatePickerItem(
  visibleItemSize: number,
  hiddenItemSize: number,
  itemHeight: number,
  values: valuesItem[],
  index: number,
  position: SharedValue<number>,
  perspective: number,
  isMiddleItemUnvisible: SharedValue<boolean> | undefined,
): PickerItemShared {
  'worklet';
  let result: PickerItemShared;
  const overallPanelSize = visibleItemSize + hiddenItemSize;
  const radiusOverallSizeCapped = Math.floor((visibleItemSize + hiddenItemSize) / 2);
  const visibleHeight = visibleItemSize * itemHeight;
  const overallPanelHeight = overallPanelSize * itemHeight;
  const allListHeight = values.length * itemHeight;
  const tmpIndex = index; //index - hiddenItemSize / 2;
  const midItemTop = Math.floor(visibleItemSize / 2) * itemHeight; // gorunur alanin baslangici 0 bu yuzden sadece visibleItemSize'i almak yeterli.
  const virtualIndex = calculateVirtualIndex(position, overallPanelHeight, values, index, itemHeight, overallPanelSize);
  const textDisplay = calculateTextDisplay(virtualIndex, values);
  const topPosition = calculateTopPosition(position, index, itemHeight, overallPanelHeight, hiddenItemSize);
  // const rotateXReal = calculateRotateXReal(
  //   topPosition,
  //   hiddenItemSize,
  //   itemHeight,
  //   radiusOverallSizeCapped,
  //   overallPanelHeight,
  // );
  // const realScale = calculateRealScale(overallPanelHeight, rotateXReal, perspective);
  const isVisible = calculateIsVisible(isMiddleItemUnvisible, topPosition, midItemTop, itemHeight);

  result = {
    topPosition: topPosition,
    // rotateXReal: rotateXReal,
    // realScale: realScale,
    isVisible: isVisible,
    textDisplay: textDisplay,
  };

  return result;
}
