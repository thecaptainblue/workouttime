import {StyleProp, StyleSheet, Text, TextStyle} from 'react-native';
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import {convertToRadian} from '../../helper/AnimationHelper';

interface PickerItemType {
  value: string;
  label: string;
}

interface PickerItemProps {
  translateY: SharedValue<number>;
  item: PickerItemType;
  index: number;
  radiusRel: number;
  itemHeight: number;
  radius: number;
  perspective: number;
  textStyle?: StyleProp<TextStyle>;
}

const clampBound = 90;

export default function PickerItem({
  translateY,
  item,
  index,
  radiusRel,
  itemHeight,
  radius,
  perspective,
  textStyle,
}: PickerItemProps) {
  const lowBound = -itemHeight;
  const radiusRelCapped = Math.floor(radiusRel);
  const midBound = radiusRelCapped * itemHeight;
  const highBound = (radiusRelCapped * 2 + 1) * itemHeight;

  const isSelectedIndex = useSharedValue(false);
  const rotateXReal = useDerivedValue(() => {
    let angle = 90; // 0 yapinca index range disina cikinca gozukuyor.
    const selectedIndexCapped = Math.floor((translateY.value - itemHeight * radiusRel) / -itemHeight);
    if (index >= selectedIndexCapped - radiusRelCapped && index <= selectedIndexCapped + radiusRelCapped) {
      //display wheel; change angel display
      const currentTranslate = index * itemHeight + translateY.value;
      angle = interpolate(
        currentTranslate,
        // [lowBound, midBound, highBound],
        [lowBound, midBound, highBound],
        [clampBound, 0, -clampBound],
        Extrapolation.CLAMP,
      );
      // if (
      //   index <= 0
      //   // && index >= -clampBound
      // ) {
      //   console.log('-----------------------------------------------------------------------------------------');
      //   console.log(
      //     'index: %s selectedIndex:%s translateY:%s angle: %s  currentTranslate: %s selectedTranslateY: %s lowBound: %s midBound: %s highBound: %s ',
      //     index,
      //     selectedIndexCapped,
      //     translateY.value,
      //     angle,
      //     currentTranslate,
      //     selectedTranslateY,
      //     lowBound,
      //     midBound,
      //     highBound,
      //   );
      // }
    }

    return angle;
  }, []);

  const realScale = useDerivedValue(() => {
    let result = 1;
    const radiusNormalized = radius * 1;
    const z = radiusNormalized * Math.cos(convertToRadian(rotateXReal.value)) - radiusNormalized;
    //todo: perpective ile item heightin bir baglantisi olmasi lazim ki item height degisikliklerinde oran bozulmasin.
    result = perspective / (perspective - z);

    // const selectedIndexCapped = Math.floor((translateY.value - itemHeight * radiusRel) / -itemHeight);
    // if (index >= selectedIndexCapped - radiusRelCapped && index <= selectedIndexCapped + radiusRelCapped) {
    // if (index == 2) {
    //   console.log('realScale: %s angle: %s', result, rotateXReal.value);
    // } else {
    //   result = 1;
    // }

    return result;
  }, []);

  const animStyleItem = useAnimatedStyle(() => {
    return {
      transform: [{rotateX: `${rotateXReal.value}` + 'deg'}, {scale: realScale.value}],
      // backgroundColor: isSelectedIndex.value ? 'red' : 'transparent',
    };
  }, []);

  return (
    <Animated.View key={item.value} style={[styles.item, {height: itemHeight}, animStyleItem]}>
      <Text style={[styles.label, , {lineHeight: itemHeight}, textStyle]}>{item.label}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  item: {
    // height: ITEM_HEIGHT,
    justifyContent: 'center',
    // backgroundColor: 'blue',
    // transform: [{rotateX: '-60deg'}],
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
