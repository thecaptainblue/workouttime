import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { LogService } from '../../services/Log/LogService';
import Animated, {
  SharedValue,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ColorConstants, FontConstants, SizeConstants } from '../../constants/StyleConstants';
import { SelectionList } from '../SelectionList';
import { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { ListInsertionPositionType } from './ListInsertionPositionType';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ResKey } from '../../lang/ResKey';
import { SelectionData, duplicateSelectionData } from './BottomMenuHelper';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import LogHelper from '../../helper/LogHelper';
import IconMaterialDesign from 'react-native-vector-icons/MaterialIcons';
import useWhatChanged from '../../hooks/useWhatChanged';
import { useMeasureRender } from '../../hooks/useMeasureRender';

// appin heightini aliyor , bu yuzden bu view'in topuna heighti verirsen direk asagiya inecektir.
// const {height} = Dimensions.get('window');

interface BottomMenuWorkoutItemProps {
  onReorderPressed: () => void;
  onDuplicatePressed: (duplicateType: ListInsertionPositionType) => void;
  openStatusObserver?: SharedValue<boolean>;
  parentName?: string;
}

export type BottomMenuWorkoutItemRefProps = {
  changeStatus: (willOpen: boolean) => void;
  isStatusOpen: () => boolean;
  enable: (isEnabled: boolean) => void;
};

const AnimDuration = 400;
const SwipeThreshold = 50;
const ButtonContainerMiddleMargin = 1;
const ComponentLogName = '-BottomMenuWorkoutItem';
const offsetOutsideClick = {
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
};

function BottomMenuWorkoutItemInner(
  props: BottomMenuWorkoutItemProps,
  ref: React.ForwardedRef<BottomMenuWorkoutItemRefProps>,
) {
  const { onReorderPressed, onDuplicatePressed, openStatusObserver, parentName } = props;
  // useMeasureRender(ComponentLogName + parentName);
  // useWhatChanged(props, ComponentLogName + parentName);
  const { t } = useTranslation();
  const [isDisplay, setDisplay] = useState(false);
  const isOpen = useSharedValue(false);
  const isEnabled = useSharedValue(true);
  const viewHeight = useSharedValue(0);
  const translate = useSharedValue(0);
  const tmpTranslation = useSharedValue(0);
  const animatedRef = useAnimatedRef<Animated.View>();
  const duplicateSelectionTypeRef = useRef(ListInsertionPositionType.JustBelow);

  // useEffect(() => {
  //   LogService.debug(ComponentLogName + parentName + ' useEffect');
  // }, []);

  const closeExpand = useCallback(() => {
    if (isOpen.value) {
      isOpen.value = false;
      LogService.debug('close bottom menu');
    }
  }, []);

  const onlayoutChangedRef = useOutsideClick({
    onOutsideClicked: closeExpand,
    offset: offsetOutsideClick,
    dynamicOffsetY: translate,
    parentName: parentName + ComponentLogName,
  });

  const isStatusOpen = useCallback(() => {
    return isOpen.value;
  }, []);

  const changeStatus = useCallback((willOpen: boolean) => {
    if (isEnabled.value) {
      isOpen.value = willOpen;
    }
  }, []);

  const enable = useCallback((enabled: boolean) => {
    'worklet';
    isEnabled.value = enabled;
  }, []);

  useImperativeHandle(ref, () => ({ changeStatus, isStatusOpen, enable }), [changeStatus, isStatusOpen, enable]);

  const scrollTo = useCallback((destination: number) => {
    'worklet';
    translate.value = withTiming(destination, { duration: AnimDuration });
  }, []);

  const animViewStyle = useAnimatedStyle(() => {
    return {
      //   opacity: opacity.value,
      //   transform: [{scale: scaleMenu.value}],
      //   width: isOpen.value ? withTiming('100%', {duration: 1000}) : 0,
      // display: isDisplay.value ? 'flex' : 'none',
      // display: 'flex',
      // width: '100%',
      bottom: -viewHeight.value,
      transform: [{ translateY: translate.value }],
      zIndex: 0,
      opacity: translate.value < viewHeight.value ? 1 : 0
      //   display: isOpen.value ? withTiming('flex', {duration: 1000}) : withTiming('none', {duration: 1000}),
    };
  }, []);

  useAnimatedReaction(
    () => {
      return isOpen.value;
    },
    (isOpenValue, previousValue) => {
      if (isOpenValue != previousValue) {
        // opacity.value = isOpenValue ? 1 : 0;
        // scaleMenu.value = isOpenValue ? withTiming(1, timingConfig) : withTiming(0, timingConfig);
        scrollTo(isOpenValue ? -viewHeight.value : viewHeight.value);
      }
    },
  );
  const handleOnDuplicateSelectionChanged = useCallback((selectedKey: string) => {
    duplicateSelectionTypeRef.current = selectedKey as ListInsertionPositionType;
    // console.log('handleOnDuplicateSelectionChanged, ', duplicateSelectionType);
  }, []);

  useAnimatedReaction(
    () => {
      return isOpen.value;
    },
    (isOpenValue, previous) => {
      if (openStatusObserver && isOpenValue !== previous) {
        openStatusObserver.value = isOpenValue;
      }
    },
    [],
  );

  {
    /*
  const gestureSome = Gesture.Tap().onBegin(event => {
    console.log('gesture some pressed............................');
  });

  <GestureHandlerRootView
      // style={{flex: 1}}
      > 
      <GestureDetector gesture={gestureSome}>
        <TouchableWithoutFeedback
          // onTouchStart={() => console.log('backDropPressed................................')}
          // onPointerDown={() => console.log('backDrop pointerDown................................')}
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.6)',
            // pointerEvents: 'auto',
            // zIndex: 0,
          }}>
          <View
            // onTouchStart={() => console.log('backDropPressed................................')}
            style={{
              // flex: 1,
              ...StyleSheet.absoluteFillObject,
              pointerEvents: 'box-only',
              backgroundColor: 'rgba(0,0,0,0.4)',
              //  backgroundColor: 'gray', opacity: 0.5
            }}></View>
        </TouchableWithoutFeedback>
      </GestureDetector>
    </GestureHandlerRootView> */
  }

  const swipeGesture = Gesture.Pan()
    .onBegin(event => {
      // console.log('onBegin translation', event.translationY);
    })
    .onStart(event => {
      tmpTranslation.value = translate.value;
      // console.log('onStart translation', event.translationY);
    })
    .onUpdate(event => {
      let translateValue = tmpTranslation.value + event.translationY;
      if (translateValue < -viewHeight.value) {
        translateValue = -viewHeight.value;
      } else if (translateValue > -viewHeight.value && translateValue < 0) {
        //dont change
      } else if (translateValue > 0) {
        translateValue = 0;
      }

      translate.value = translateValue;
      // console.log(
      //   'onUpdate translation tmpTrans:%s, transY: %s transResult:%s',
      //   tmpTranslation.value,
      //   event.translationY,
      //   translateValue,
      // );
    })
    .onEnd(event => {
      // console.log('onEnd translation translate:%s, transY: %s ', translate.value, event.translationY);
      if (translate.value > -viewHeight.value + SwipeThreshold) {
        isOpen.value = false;
      } else if (translate.value < -viewHeight.value + SwipeThreshold) {
        scrollTo(-viewHeight.value);
      }
    });

  const selectionKeyNameExtractor = useCallback(
    (item: SelectionData, index: number): [itemKey: string, itemName: string] => {
      return [item.key, item.name];
    },
    [],
  );

  // LogService.debug('rerender BottomMenuWorkoutItemInner isFocused %s -----------------------', isFocused);
  LogService.debug('rerender BottomMenuWorkoutItemInner');

  return (
    // <GestureHandlerRootView style={styles.containerGestureHandler}>
    <GestureDetector gesture={swipeGesture}>
      <Animated.View
        ref={animatedRef}
        style={[styles.container, isDisplay ? animViewStyle : null]}
        // entering={FadeInDown}
        // exiting={FadeOutDown}
        onLayout={event => {
          console.log('BottomMenu ', LogHelper.toString(event.nativeEvent.layout));
          viewHeight.value = event.nativeEvent.layout.height;
          // isDisplay.value = true;
          setDisplay(true);
          if (onlayoutChangedRef.current) {
            onlayoutChangedRef.current(animatedRef);
          }
        }}>
        <View style={styles.header} />
        <View
          style={[
            styles.buttonMainContainer,
            { borderTopStartRadius: SizeConstants.borderRadius, borderTopEndRadius: SizeConstants.borderRadius },
          ]}>
          <View style={[styles.buttonContainer, { marginRight: ButtonContainerMiddleMargin }]}>
            <TouchableHighlight
              underlayColor={ColorConstants.primaryOverlayColor}
              style={[styles.button]}
              onPress={() => {
                // console.log('onPressonBottomMenu-----------------------------');
                onReorderPressed();
              }}>
              <View style={styles.buttonContent}>
                <IconMaterialDesign
                  name="reorder"
                  size={FontConstants.sizeLargeXX}
                  // color={ColorConstants.primary}
                  // animatedProps={iconAnimatedProps}
                  style={styles.icon}
                />
                <Text style={styles.text}>{t(ResKey.BottomMenuReorder)}</Text>
              </View>
            </TouchableHighlight>
          </View>
          <View
            style={[
              styles.buttonContainer,
              { marginLeft: ButtonContainerMiddleMargin },
              styles.buttonContainerWithSubContainer,
            ]}>
            <View style={styles.buttonSubContainer}>
              <TouchableHighlight
                underlayColor={ColorConstants.primaryOverlayColor}
                style={[
                  styles.button,
                  {
                    // backgroundColor: 'orange',
                    // height: '100%',
                    // borderRightWidth: 1,
                  },
                ]}
                onPress={() => onDuplicatePressed(duplicateSelectionTypeRef.current)}>
                <View style={styles.buttonContent}>
                  <IconMaterialDesign
                    name="content-copy"
                    size={FontConstants.sizeLargeXX}
                    // color={ColorConstants.primary}
                    // animatedProps={iconAnimatedProps}
                    style={styles.icon}
                  />
                  <Text style={styles.text}>{t(ResKey.BottomMenuDuplicate)}</Text>
                </View>
              </TouchableHighlight>
              <View style={styles.selectionContainer}>
                <SelectionList
                  data={duplicateSelectionData}
                  keyNameExtractor={selectionKeyNameExtractor}
                  onSelectionChanged={handleOnDuplicateSelectionChanged}
                  // initialSelectedKey={'1'}
                  initialSelectedKey={duplicateSelectionTypeRef.current}
                />
              </View>
            </View>
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
    // </GestureHandlerRootView>
  );
}

export const BottomMenuWorkoutItem = React.forwardRef(BottomMenuWorkoutItemInner);
const styles = StyleSheet.create({
  containerGestureHandler: {
    // flex: 1
  },
  container: {
    position: 'absolute',
    flex: 1,
    // flexDirection: 'column',

    // bottom: -100,
    // alignItems: 'center',
    // flex: 1,
    // zIndex: -1,
    // opacity: 0,
    // width: '100%',
    // height: 500,
    // width: 300,
    left: 0,
    right: 0,
    // display: 'none',
    // width: 0,
    zIndex: -1,
    opacity: 0,
  },
  // item: {
  //   flex: 1,
  //   // backgroundColor: 'green',
  //   // alignItems: 'center',
  //   // // fontSize: FontConstants.sizeXXLarge,
  //   // padding: SizeConstants.paddingRegular,
  //   // // marginVertical: 10,
  //   // // borderTopWidth: 1,
  //   // // borderRadius: 10,
  //   // width: '100%',
  // },
  header: {
    // flex: 1,
    // // backgroundColor: ColorConstants.surfaceEl7,
    backgroundColor: ColorConstants.transparent,
    // alignItems: 'center',
    // // fontSize: FontConstants.sizeXXLarge,
    paddingTop: SizeConstants.paddingRegular,
    // // marginVertical: 10,
    // // borderTopWidth: 1,
    // // borderRadius: 10,
    // // width: '100%',
    // borderTopWidth: 1,
    // flexDirection: 'row',
  },
  buttonMainContainer: {
    flex: 1,
    // backgroundColor: ColorConstants.surfaceEl7,
    backgroundColor: ColorConstants.surfaceEl7,
    alignItems: 'center',
    // fontSize: FontConstants.sizeXXLarge,
    paddingVertical: 3, //SizeConstants.paddingRegular,
    // paddingHorizontal: 3, //SizeConstants.paddingRegular,
    // marginVertical: 10,
    // borderTopWidth: 1,
    // borderRadius: 10,
    // width: '100%',
    // borderTopWidth: 1,
    flexDirection: 'row',
  },
  buttonContainer: {
    // width: '100%',
    // height: '100%',
    flex: 1,
    // flexDirection: 'row',
    alignItems: 'center',

    // alignContent: 'center',
    // backgroundColor: 'red',
    // justifyContent: 'center',
    // backgroundColor: 'red',
    // verticalAlign: 'middle',
    borderColor: ColorConstants.primary,
    borderWidth: 0.5,
    borderRadius: SizeConstants.borderRadius,
    marginHorizontal: SizeConstants.paddingSmall,
    // paddingVertical: SizeConstants.paddingSmallX,
  },
  buttonContainerWithSubContainer: {
    flex: 1.5,
  },
  buttonSubContainer: {
    // width: '100%',
    // height: '100%',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',

    // alignContent: 'center',
    // backgroundColor: 'red',
    // justifyContent: 'space-between',
    // backgroundColor: 'red',
    // verticalAlign: 'middle',
  },
  button: {
    flex: 1,
    // flexDirection: 'column',
    alignItems: 'center',
    alignContent: 'center',
    // backgroundColor: 'blue',
    justifyContent: 'center',
    // verticalAlign: 'middle',
    width: '100%',
    height: '100%',
    borderRadius: SizeConstants.borderRadius,
  },
  buttonContent: {
    flex: 1,
    // flexDirection: 'column',
    alignItems: 'center',
    alignContent: 'center',
    // backgroundColor: 'blue',
    // justifyContent: 'space-around',
    justifyContent: 'space-evenly',
    // verticalAlign: 'middle',
  },
  selectionContainer: {
    // width: '100%',
    // height: '100%',
    flex: 1,
    // flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SizeConstants.paddingSmallX,

    // alignContent: 'center',
    // backgroundColor: 'red',
    // justifyContent: 'center',
    // backgroundColor: 'red',
    // verticalAlign: 'middle',
    // borderColor: 'red',
    // borderWidth: 1,
  },
  icon: {
    color: ColorConstants.primary,
    // margin: 10,
  },
  text: {
    // flex: 1,
    color: ColorConstants.primary,
    // backgroundColor: 'yellow',
    fontSize: FontConstants.sizeRegular,
    textAlign: 'center',
    alignContent: 'center',
  },
});
