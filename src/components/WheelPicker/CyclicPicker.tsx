import React, { useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  TextStyle,
  StyleProp,
  ColorValue,
  ViewStyle,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector, PanGesture } from 'react-native-gesture-handler';
import CyclicPickerItem from './CyclicPickerItem';
import { LogService } from '../../services/Log/LogService';
import { snapPointByMod } from '../../helper/Redash';
import MaskedView from '@react-native-masked-view/masked-view';
import GradientView from './GradientView';
import { ColorConstants, FontConstants } from '../../constants/StyleConstants';
import { NumericInput, NumericInputRefProps } from '../NumericInput';

export interface PickerInput {
  value: number;
  label: string;
}

interface CyclicPickerProps {
  defaultValue: number;
  values: { value: number; label: string }[];
  itemHeight: number;
  visibleItems: number;
  onChangeSelectedValue?: (value: number, index: number) => void;
  textStyle?: StyleProp<TextStyle>;
  selectedItemColor?: ColorValue;
  baseItemColor?: ColorValue;
  parentContainerStyle?: StyleProp<ViewStyle>;
}

const hiddenItemSize = 2;
const AnimDurationReactionOffset = 250;
const AnimEasing = Easing.bezier(0.22, 1, 0.36, 1);
const velocityYMaxAbs = 3000;

const CyclicPicker = ({
  values,
  defaultValue,
  itemHeight,
  visibleItems,
  onChangeSelectedValue,
  textStyle,
  selectedItemColor = 'white',
  baseItemColor = 'grey',
  parentContainerStyle,
}: CyclicPickerProps) => {
  const edgeOffset = 70;
  const Perspective = 600;
  const overallPanelSize = visibleItems + hiddenItemSize;
  // const overallPanelHeight = overallPanelSize * itemHeight;
  const radiusSizeOverallRelative = overallPanelSize / 2;
  const radiusSizeOverallRelativeCapped = Math.floor(radiusSizeOverallRelative);
  // const radiusHeightOverallRealativeCapped = radiusSizeOverallRelativeCapped * itemHeight;
  const radiusSizeRel = visibleItems * 0.5;
  const radiusSizeRelCapped = Math.floor(radiusSizeRel);
  const radiusHeightRelCapped = radiusSizeRelCapped * itemHeight;
  // const radiusHeight = radiusSizeRel * itemHeight;
  // const max = values.length;
  const defaultValueIndex = values.findIndex(item => item.value === defaultValue);
  const selectedValueIndexRef = useRef(defaultValueIndex);
  const positionMod = itemHeight * values.length * overallPanelSize;
  const position = useSharedValue(defaultValueIndex >= 0 ? -defaultValueIndex * itemHeight : 0);
  const offset = useSharedValue(0);
  const toValue = useSharedValue(0);
  const translateReal = useDerivedValue(() => {
    return position.value + itemHeight * radiusSizeOverallRelativeCapped; // % (itemHeight * values.length)
    // return position.value;
  }, []);
  // animasyonu callbackini oncesinde calistirmak icin kullandigim dummy degisken
  const tmpPosition = useSharedValue(0);

  const isTextInputEnabled = useSharedValue(false);
  const panGestureRef = useRef<PanGesture>(undefined);
  const textInputRef = useRef<NumericInputRefProps | null>(null);
  const willTextInputOpen = useSharedValue(true);
  const isMaskedViewSupportedRef = useRef(isMaskedViewSupported());
  const isMaskedViewSuported = isMaskedViewSupportedRef.current;

  const changeSelectedValue = useCallback((selectedIndex: number) => {
    if (selectedIndex !== selectedValueIndexRef.current) {
      console.log('changeSelectedValue selectedValueIndex: ', selectedValueIndexRef.current);
      selectedValueIndexRef.current = selectedIndex;
      if (onChangeSelectedValue) {
        onChangeSelectedValue(values[selectedIndex].value, selectedIndex);
      }
    }
  }, []);

  const changeCurrentValue = useCallback((value: number) => {
    const valueIndex = values.findIndex(item => item.value === value);
    if (valueIndex >= 0) {
      console.log('changeCurrentValue: index:', valueIndex);
      // selectedValueIndexRef.current = valueIndex;
      changeSelectedValue(valueIndex);
      position.value = -valueIndex * itemHeight;
    }
  }, []);

  const enableInput = useCallback(
    (enable: boolean) => {
      console.log(
        'CyclicPicker; enableInput callback enable:%s isTextInputEnabled:%s selectedIndex:%s willTextInputOpen:%s',
        enable,
        isTextInputEnabled.value,
        selectedValueIndexRef.current,
        willTextInputOpen.value,
      );
      if (isTextInputEnabled.value != enable) {
        if (enable === false || (willTextInputOpen.value === true && enable)) {
          const selectedText = values[selectedValueIndexRef.current].label;

          isTextInputEnabled.value = enable;
          if (textInputRef.current) {
            textInputRef.current.enableInput(enable, selectedText);
          }
        }
      }
    },
    [textInputRef.current, selectedValueIndexRef.current, willTextInputOpen.value, isTextInputEnabled.value],
  );

  const onEndAnimationCallback = useCallback((finished?: boolean) => {
    'worklet';
    // console.log('onEndAnimationCallback finished:%s ', finished);
    if (finished) {
      willTextInputOpen.value = true;
      // console.log(
      //   'onEndAnimationCallback animation ended; position:%s toValue:%s willTextInputOpen:%s',
      //   position.value.toFixed(2),
      //   toValue.value.toFixed(2),
      //   willTextInputOpen.value,
      // );
      const selectedIndex = calculateIndex(toValue.value, itemHeight, values.length);
      runOnJS(changeSelectedValue)(selectedIndex);
    } else {
    }
  }, []);

  const textInputUpdateText = useCallback(
    (text: string) => {
      if (textInputRef.current) {
        textInputRef.current.updateText(text);
      }
    },
    [textInputRef.current],
  );

  const panGesture = Gesture.Pan()
    .onBegin(({ translationY, velocityY, y }) => {
      // console.log('onBegin translationY:%s y:%s ', translationY, y);
      offset.value = position.value;
      // runOnJS(enableInput)(false);// orta bolgede degilse calistir.
      if (!isInMiddleItemArea(radiusSizeRelCapped, itemHeight, y)) {
        runOnJS(enableInput)(false);
      }
    })
    .onStart(translationY => {
      // console.log('onStart translationY:%s ', translationY);
      // runOnJS(enableInput)(false);
      willTextInputOpen.value = false;
      if (isTextInputEnabled.value) {
        runOnJS(enableInput)(false);
      }
    })
    .onUpdate(({ translationY, velocityY }) => {
      const cappedVelocity = capVelocityY(velocityY, velocityYMaxAbs);
      position.value = (offset.value + translationY) % positionMod;
      toValue.value = snapPointByMod(position.value, cappedVelocity, itemHeight); // burda deger position mod disina cikabilir.
      const selectedIndex = calculateIndex(toValue.value, itemHeight, values.length);
      tmpPosition.value = position.value;
      // console.log(
      //   'onUpdate; position:%s  toValue:%s translationY:%s selectedIndex:%s positionMod:%s velocityY:%s cappedVelocity:%s willTextInputOpen:%s',
      //   position.value.toFixed(2),
      //   toValue.value.toFixed(2),
      //   translationY.toFixed(2),
      //   selectedIndex,
      //   positionMod,
      //   velocityY.toFixed(2),
      //   cappedVelocity.toFixed(2),
      //   willTextInputOpen.value,
      // );
    })
    .onEnd(({ translationY, velocityY }) => {
      const selectedIndex = calculateIndex(toValue.value, itemHeight, values.length);
      const selectedText = values[selectedIndex].label;
      const cappedVelocity = capVelocityY(velocityY, velocityYMaxAbs);
      const diff = Math.abs(toValue.value - position.value);
      const velFactor = 0.15;
      const dur = diff / ((Math.abs(velocityYMaxAbs) / 1000) * velFactor);
      // console.log(
      //   'onEnd; position:%s toValue:%s  willTextInputOpen:%s  selectedIndex:%s cappedVelocity:%s diff:%s dur:%s',
      //   position.value.toFixed(2),
      //   toValue.value.toFixed(2),
      //   willTextInputOpen.value,
      //   selectedIndex,
      //   cappedVelocity.toFixed(2),
      //   diff.toFixed(2),
      //   dur.toFixed(2),
      // );
      runOnJS(textInputUpdateText)(selectedText); // flickeri onlemek icin onceden guncelliyorum.
      // cancelAnimation(position);
      //kaydetmeye hemen basildiginda guncel degeri almasi icin tmpPosition uzerinden (daha kisa sure ile)  animationCallback cagriliyor.
      tmpPosition.value = withTiming(
        toValue.value,
        { duration: Math.max(dur - AnimDurationReactionOffset, 0) },
        onEndAnimationCallback,
      );
      position.value = withTiming(toValue.value, { duration: dur, easing: AnimEasing }); //animationCallback ustte dummy position ile cagriliyor.

      ///////////////decay

      // position.value = withSequence(
      //   withDecay(
      //     {
      //       // clamp: cappedVelocity >= 0 ? [position.value, toValue.value] : [toValue.value, position.value],
      //       velocity: cappedVelocity,
      //       deceleration: 0.999,
      //       velocityFactor: 1,
      //       rubberBandEffect: false,
      //     },
      //     onEndAnimationCallback,
      //     // finished => {
      //     //   console.log(
      //     //     'withDecay animationCallback; finished:%s position:%s toValue:%s',
      //     //     finished,
      //     //     position.value.toFixed(2),
      //     //     toValue.value.toFixed(2),
      //     //   );
      //     // },
      //   ),
      //   // withTiming(toValue.value, {duration: 800, easing: AnimEasing}, onEndAnimationCallback),
      // );
    })
    .onChange(event => {
      // console.log('onChange; position:%s toValue:%s', position.value, toValue.value);
    })
    .withRef(panGestureRef);

  const tapGesture = Gesture.Tap()
    .onBegin(() => {
      // console.log('Tap onBegin');
    })
    .onStart(() => {
      // console.log('Tap onStart willTextInputOpen', willTextInputOpen.value);
      runOnJS(enableInput)(true);
    })
    .requireExternalGestureToFail(panGestureRef);
  // .blocksExternalGesture(panGesture);

  let content: React.JSX.Element[] = [];

  for (let index = 0; index < visibleItems + hiddenItemSize; index++) {
    let tmpItem = (
      <CyclicPickerItem
        key={'id' + index.toString()}
        index={index}
        itemHeight={itemHeight}
        position={translateReal}
        visibleItemSize={visibleItems}
        values={values}
        hiddenItemSize={hiddenItemSize}
        perspective={Perspective}
        textStyle={[textStyle, !isMaskedViewSuported && styles.overrideTextStyleMaskNotSupported]}
        isMiddleItemUnvisible={isTextInputEnabled}
      />
    );
    content[index] = tmpItem;
  }

  const maskElement = <View style={[styles.list, { transform: [{ perspective: Perspective }] }]}>{content}</View>;

  const handleTextInputSubmitText = useCallback(
    (text: string): void => {
      LogService.debugFormat('handleSubmitText {0}', text);
      // isTextInputEnabled.value = false;
      const num = Number.parseInt(text);
      if (!Number.isNaN(num) && num >= 0) {
        changeCurrentValue(num);
      }
      runOnJS(enableInput)(false);
    },
    [textInputRef.current],
  );

  const handleTextInputOnBlur = useCallback(
    (text: string): void => {
      // eger tekerlek cevriliyorsa text'i guncelleme
      if (willTextInputOpen.value) {
        handleTextInputSubmitText(text);
      }
    },
    [willTextInputOpen.value],
  );

  const inputViewAnimStyle = useAnimatedStyle(() => {
    return { opacity: isTextInputEnabled.value ? 1 : 0 };
  }, []);

  const textInputAnimProp = useAnimatedProps(() => {
    return { disabled: !isTextInputEnabled.value };
  }, []);

  LogService.debug('rerender CyclicPicker');

  return (
    <View style={[styles.parentContainer, parentContainerStyle]}>
      <GestureDetector gesture={panGesture}>
        <View
          style={[
            styles.container,
            { height: itemHeight * visibleItems },
            // {backgroundColor: 'orange'}
          ]}>
          {isMaskedViewSuported && (
            <MaskedView {...{ maskElement }}>
              <GradientView
                viewStyle={[{ height: itemHeight * visibleItems }]}
                fromColor={baseItemColor}
                middleOffset={0}
                edgeOffset={edgeOffset}
                toColor={selectedItemColor}
              />
            </MaskedView>
          )}
          {!isMaskedViewSuported && maskElement}
          <View
            style={{
              pointerEvents: 'box-none',
              position: 'absolute',
              // bottom: (itemHeight * visibleItems) / 2,
              height: '100%',
              width: '100%',
              justifyContent: 'center',
              // borderColor: 'red',
              // borderWidth: 1,
              // zIndex: -1,
              // opacity: 0,
            }}>
            <GestureDetector gesture={tapGesture}>
              {/* // TouchableWithoutFeedback prevents scrollview dismiss keyboard by handling touch */}
              <TouchableWithoutFeedback>
                <View>
                  <Animated.View
                    focusable={false}
                    style={[
                      {
                        opacity: 0,
                        // backgroundColor: 'white',
                      },
                      inputViewAnimStyle,
                    ]}>
                    <NumericInput
                      ref={textInputRef}
                      disabled={true}
                      // animatedProps={textInputAnimProp}
                      containerStyle={styles.numericInputContainerStyle}
                      textStyle={[
                        styles.numericInputTextStyle,
                        textStyle,
                        { color: selectedItemColor },
                        // {fontSize: 50, color: ColorConstants.background}
                      ]}
                      textCaretStyle={{ color: ColorConstants.primary, fontWeight: FontConstants.weightBold }}
                      rangeMin={0}
                      rangeMax={59}
                      formatInput="{0:00}"
                      selectionColor={ColorConstants.surfaceEl10}
                      // selectionColor={'rgba(169, 171, 170, 0.5)'}
                      onTextSubmit={handleTextInputSubmitText}
                      onBlur={handleTextInputOnBlur}
                    // onBlur={handleTextInputSubmitText}
                    />
                  </Animated.View>
                </View>
              </TouchableWithoutFeedback>
            </GestureDetector>
          </View>
        </View>
      </GestureDetector>
    </View>
  );
};

export default CyclicPicker;
// export default React.memo(Picker);

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
  overrideTextStyleMaskNotSupported: {
    color: 'black',
  },
  numericInputContainerStyle: {
    justifyContent: 'center',
    paddingVertical: 10,
  },
  numericInputTextStyle: {
    // paddingHorizontal: 5,
  },
});

function calculateIndex(position: number, itemHeight: number, itemSize: number): number {
  'worklet';
  let result: number = -1;
  if (position <= 0) {
    // const selectedIndex = Math.abs(
    //   Math.floor(((toValue.value - radiusHeightRelCapped) % (itemHeight * (values.length - 1))) / itemHeight),
    // );
    result = Math.floor((position % (itemHeight * itemSize)) / -itemHeight);
  } else {
    const tmpIndex = Math.floor((position % (itemHeight * itemSize)) / itemHeight);
    result = (itemSize - tmpIndex) % itemSize;
  }

  return result;
}

function isInMiddleItemArea(radiusSizeRelCapped: number, itemHeight: number, pointerY: number) {
  'worklet';
  const middleAreaStart = radiusSizeRelCapped * itemHeight;
  const middleAreaEnd = middleAreaStart + itemHeight;
  let result = false;
  if (pointerY >= middleAreaStart && pointerY <= middleAreaEnd) {
    result = true;
  }
  return result;
}

function isMaskedViewSupported(): boolean {
  let result = true;
  LogService.debug('isMaskedViewSupported {0} {1}', Platform.OS, Platform.Version);
  // android 7 is 25.x
  if (Platform.OS === 'android' && Platform.Version < 26) {
    result = false;
  }
  return result;
}

function capVelocityY(velocityY: number, maxValue: number): number {
  'worklet';
  let result = velocityY;
  if (velocityY > 0) {
    result = Math.min(velocityY, Math.abs(maxValue));
  } else {
    result = Math.max(velocityY, Math.abs(maxValue) * -1);
  }

  return result;
}
