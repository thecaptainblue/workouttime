import React, {useEffect, useImperativeHandle, useState} from 'react';
import {StyleProp, StyleSheet, TextStyle, View} from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface FakeCaretProps {
  textParentStyle?: StyleProp<TextStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export type FakeCaretRefProps = {
  hide: () => void;
  show: () => void;
};
const AnimDuration = 500;
const AnimDelayDuration = 100;
const StopPosition = 0;
function FakeCaretInner({textParentStyle, textStyle}: FakeCaretProps, ref: React.ForwardedRef<FakeCaretRefProps>) {
  const [visible, setVisible] = useState(false);
  //   const [animation, setAnimation] = useState();

  const fontSizeStyle = StyleSheet.flatten(textStyle)?.fontSize
    ? StyleSheet.flatten(textStyle)?.fontSize
    : StyleSheet.flatten(textParentStyle)?.fontSize;

  useImperativeHandle(
    ref,
    () => ({
      show: () => {
        if (!visible) {
          setVisible(true);
        }
      },
      hide: () => {
        if (visible) {
          setVisible(false);
        }
      },
    }),
    [visible],
  );

  const fadeAim = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      fadeAim.value = withRepeat(
        withSequence(
          withDelay(
            AnimDelayDuration,
            withTiming(1, {
              duration: AnimDuration,
            }),
          ),
          withDelay(AnimDelayDuration, withTiming(0)),
        ),
        0,
      );
    } else {
      cancelAnimation(fadeAim);
      fadeAim.value = StopPosition;
    }
  }, [visible]);

  const textAnimStyle = useAnimatedStyle(() => {
    return {opacity: fadeAim.value};
  }, []);

  return (
    <View
      style={[
        {
          //   opacity: fadeAim,
        },
        {
          //   flexDirection: 'column',
          // backgroundColor: 'cyan',
          //   width: 20,
          //   height: '50%',
          //   alignSelf: 'flex-end',
          // alignItems: 'center',
          // alignContent: 'center',
          // justifyContent: 'center',
          //   position: 'absolute',
          //   top: -50,
        },
      ]}>
      <Animated.Text
        style={[
          {
            fontSize: fontSizeStyle,
            //   position: 'absolute',
            //   top: -40,
            //   bottom: 40,
            opacity: 0,
            //   bottom: -10,
            // textAlign: 'center',
            // verticalAlign: 'middle',
            // alignItems: 'center',
            // alignContent: 'center',
            // justifyContent: 'center',
            // alignSelf: 'center',
            top: fontSizeStyle ? -fontSizeStyle * 0.03 : null,
            // top:  textStyle?.fontSize ? 1*-0.03: ,
            position: 'absolute', // ust view deki justify contentin icine girmeyip icerigi sola goturmesini engelliyor.
          },
          textStyle,
          textAnimStyle,
        ]}>
        |
      </Animated.Text>
    </View>
  );
}
export const FakeCaret = React.forwardRef(FakeCaretInner);
