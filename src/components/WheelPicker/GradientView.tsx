import React from 'react';
import {View, StyleSheet, ColorValue, StyleProp, ViewStyle} from 'react-native';
import Svg, {Defs, Rect, LinearGradient, Stop, NumberProp} from 'react-native-svg';

// const FROM_COLOR = 'rgb(255, 255, 255)';
// const TO_COLOR = 'rgb(0,102,84)';

interface GradientViewProps {
  fromColor: ColorValue;
  toColor: ColorValue;
  children?: React.ReactNode;
  viewStyle?: StyleProp<ViewStyle>;
  middleOffset: number;
  edgeOffset: number;
}
export default function GradientView({
  fromColor,
  toColor,
  viewStyle,
  children,
  middleOffset,
  edgeOffset,
}: GradientViewProps) {
  // middleOffset 0 olunca iki tane ayni degerli stop olusuyor bu da gostergeyi bozuyor bu yuzden 0 olmasini engelliyorum.
  return (
    <View
      style={[
        // {flex: 1},
        // {              height: itemHeight * radiusRelCapped,
        //   // backgroundColor: 'transparent',
        //   backgroundColor: 'red',},
        viewStyle,
      ]}>
      <Svg height="100%" width="100%" style={StyleSheet.absoluteFillObject}>
        <Defs>
          <LinearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset={'0%'} stopColor={fromColor} />
            <Stop offset={`${edgeOffset}%`} stopColor={fromColor} />

            <Stop offset={`${50 - (middleOffset === 0 ? 0.2 : middleOffset) / 2}%`} stopColor={toColor} />
            <Stop offset={`${50 + (middleOffset === 0 ? 0.2 : middleOffset) / 2}%`} stopColor={toColor} />

            <Stop offset={`${100 - edgeOffset}%`} stopColor={fromColor} />
            <Stop offset={'100%'} stopColor={fromColor} />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#grad)" />
      </Svg>
      {children}
    </View>
  );
}
