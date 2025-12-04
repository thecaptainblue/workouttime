import React, {useMemo, useRef} from 'react';
import {View, StyleSheet, TextStyle, StyleProp, ColorValue, ViewStyle} from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  //   interpolate,
  //   Extrapolate,
  //   multiply,
  //   cos,
  //   sub,
  //   asin,
  //   divide,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
// import MaskedView from '@react-native-community/masked-view';

// import GestureHandler from './GestureHandler';
// import {VISIBLE_ITEMS, ITEM_HEIGHT} from './Constants';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {snapPoint} from '../../helper/Redash';
import PickerItem from './PickerItem';
import MaskedView from '@react-native-masked-view/masked-view';
import GradientView from './GradientView';
import {LogService} from '../../services/Log/LogService';

export interface PickerInput {
  value: number;
  label: string;
}

interface PickerProps {
  defaultValue: number;
  values: {value: number; label: string}[];
  itemHeight: number;
  visibleItems: number;
  onChangeSelectedValue?: (value: number, index: number) => void;
  textStyle?: StyleProp<TextStyle>;
  selectedItemColor?: ColorValue;
  baseItemColor?: ColorValue;
  parentContainerStyle?: StyleProp<ViewStyle>;
}

const Picker = ({
  values,
  defaultValue,
  itemHeight,
  visibleItems,
  onChangeSelectedValue,
  textStyle,
  selectedItemColor = 'white',
  baseItemColor = 'grey',
  parentContainerStyle,
}: PickerProps) => {
  const edgeOffset = 70;
  const Perspective = 600;
  const radiusRel = visibleItems * 0.5;
  const radiusRelCapped = Math.floor(radiusRel);
  const radius = radiusRel * itemHeight;
  const max = values.length;
  const snapPoints = useMemo(() => {
    return new Array(max).fill(0).map((_, i) => -i * itemHeight);
  }, [values.length]);

  const defaultValueIndex = values.findIndex(item => item.value === defaultValue);

  const offset = useSharedValue(0);
  const position = useSharedValue(defaultValueIndex >= 0 ? -defaultValueIndex * itemHeight : 0);
  const toValue = useSharedValue(0);
  //   const translateReal = useSharedValue(0);
  const translateReal = useDerivedValue(() => {
    return position.value + itemHeight * radiusRelCapped;
    // return position.value;
  }, []);
  const selectedValueIndexRef = useRef(defaultValueIndex);

  const panGesture = Gesture.Pan()
    .onBegin(({translationY, velocityY}) => {
      offset.value = position.value;
    })
    .onUpdate(({translationY, velocityY}) => {
      // console.log('onUpdate; position:%s translationY:%s', position.value, translationY);
      //   position.value = offset.value + translationY;
      position.value = offset.value + translationY;
      toValue.value = snapPoint(position.value, velocityY, snapPoints);
    })
    .onEnd(({translationY, velocityY}) => {
      // console.log('onEnd; position:%s toValue:%s', position.value, toValue.value);
      position.value = withTiming(
        toValue.value,
        {duration: 1000, easing: Easing.bezier(0.22, 1, 0.36, 1)},
        finished => {
          if (finished) {
            const selectedIndex = Math.floor(toValue.value / -itemHeight);
            // console.log(' before selectedValueIndexRef.current: ', selectedValueIndexRef.current);
            if (selectedIndex !== selectedValueIndexRef.current) {
              // console.log('not equal selectedValueIndexRef.current: ', selectedValueIndexRef.current);
              selectedValueIndexRef.current = selectedIndex;
              if (onChangeSelectedValue) {
                runOnJS(onChangeSelectedValue)(values[selectedIndex].value, selectedIndex);
              }
            }
            // console.log(
            // 'selectedIndex: %s selectedValueIndexRef.current: %s',
            //   selectedIndex,
            //   selectedValueIndexRef.current,
            // );
          } else {
            // console.log(
            //   'position: %s selectedValueIndexRef.current: %s',
            //   position.value,
            //   selectedValueIndexRef.current,
            // );
          }
        },
      );
    })
    .onChange(event => {
      // console.log('onChange; position:%s toValue:%s', position.value, toValue.value);
    });

  const animStyleList = useAnimatedStyle(() => {
    return {transform: [{translateY: translateReal.value}]};
  }, []);

  const maskElement = (
    <Animated.View style={[styles.list, {transform: [{perspective: Perspective}]}, animStyleList]}>
      {values.map((v, i) => {
        return (
          <PickerItem
            key={v.value}
            index={i}
            item={{value: v.value.toString(), label: v.label}}
            radiusRel={radiusRel}
            translateY={translateReal}
            itemHeight={itemHeight}
            radius={radius}
            perspective={Perspective}
            textStyle={textStyle}
          />
        );
      })}
    </Animated.View>
  );

  LogService.debug('rerender Picker');
  return (
    <View style={[styles.parentContainer, parentContainerStyle]}>
      <GestureDetector gesture={panGesture}>
        <View
          style={[
            styles.container,
            {height: itemHeight * visibleItems},
            // {backgroundColor: 'orange'}
          ]}>
          <MaskedView {...{maskElement}}>
            <GradientView
              viewStyle={[{height: itemHeight * radiusRel * 2}]}
              fromColor={baseItemColor}
              middleOffset={0}
              edgeOffset={edgeOffset}
              toColor={selectedItemColor}
            />
          </MaskedView>
        </View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
    width: '100%',
  },
  container: {
    // width: 0.61 * width,
    // flex: 1,
    // width: '100%',
    // height: ITEM_HEIGHT * VISIBLE_ITEMS,
    overflow: 'hidden',
    // borderColor: 'red',
    // borderWidth: 1,
  },
  list: {
    // flex: 1,
    // transform: [{perspective: 600}],
  },
  // item: {
  //   height: ITEM_HEIGHT,
  //   justifyContent: 'center',
  //   backgroundColor: 'blue',
  //   // transform: [{rotateX: '-60deg'}],
  // },
  // label: {
  //   color: 'white',
  //   fontFamily: 'SFProText-Semibold',
  //   fontSize: 24,
  //   lineHeight: ITEM_HEIGHT,
  //   textAlign: 'center',
  //   textAlignVertical: 'center',
  // },
});

export default Picker;
// export default React.memo(Picker);
