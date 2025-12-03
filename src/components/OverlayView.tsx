import { memo } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';

export interface StateOpacityArray {
  [index: number]: number;
}

export enum OverlayState {
  None,
  Selected,
  Activated,
  Disabled,
}

export interface OverlayViewProps {
  state: SharedValue<OverlayState>;
  viewStyle?: StyleProp<ViewStyle>;
  customOpacities?: StateOpacityArray;
  //   child: React.ReactNode;
}

function OverlayViewInner(props: OverlayViewProps) {
  const {
    state,
    viewStyle,
    customOpacities,
    // child
  } = props;

  const animatedStyle = useAnimatedStyle(() => {
    return { opacity: getOpacity(state.value, customOpacities) };
  }, []);

  return <Animated.View style={[styles.container, viewStyle, animatedStyle]}>{/* {child} */}</Animated.View>;
}

export const OverlayView = memo(OverlayViewInner);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0,
    zIndex: 1,
    backgroundColor: 'white',
    pointerEvents: 'box-none',
  },
});

function getOpacity(state: OverlayState, customValues?: StateOpacityArray): number {
  'worklet';
  let opacity = 0;
  if (customValues != null && customValues[state] != null) {
    opacity = customValues[state];
  } else {
    switch (state) {
      case OverlayState.None:
        opacity = 0;
        break;
      case OverlayState.Selected:
        opacity = 0.08;
        break;
      case OverlayState.Activated:
        opacity = 0.12;
        break;
      case OverlayState.Disabled:
        opacity = 0.38;
        break;
      default:
        opacity = 0;
        break;
    }
  }

  return opacity;
}
