import { Pressable, PressableProps, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { ColorConstants, SizeConstants } from '../constants/StyleConstants';
import { OverlayState, OverlayView, StateOpacityArray } from './OverlayView';
import Animated, {
  SharedValue,
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import { useCallback, useMemo, useState } from 'react';
import { FormButtonOverlayOpacities } from './form/FormConstants';
// Removed as it's no longer needed for prop syncing
// import { scheduleOnRN } from 'react-native-worklets'; 

export interface ButtonWTIconProps extends PressableProps {
  containerStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  ignoreDisabledOverlayDisplay?: boolean;
  overlayOpacities?: StateOpacityArray;
  overlayStyle?: StyleProp<ViewStyle>;
  isPressAnimationActive?: boolean;
  pressedScale?: number;
  isDisabled?: SharedValue<boolean>;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const ButtonWTIconConstants = {
  pressedScale: 0.9,
};

export function ButtonWTIcon(props: ButtonWTIconProps) {
  const {
    children,
    containerStyle,
    ignoreDisabledOverlayDisplay,
    overlayOpacities = FormButtonOverlayOpacities,
    overlayStyle,
    isPressAnimationActive,
    pressedScale,
    isDisabled,
    ...restInputs
  } = props;
  const { disabled } = restInputs;
  const pressedScaleValue = useMemo(() => {
    return pressedScale != null ? pressedScale : ButtonWTIconConstants.pressedScale;
  }, [pressedScale]);

  const isPressed = useSharedValue(false);
  const overlayState = useSharedValue<OverlayState>(OverlayState.None);
  const overlayStateDerived = useDerivedValue(() => {
    let result = OverlayState.None;
    if (
      !(ignoreDisabledOverlayDisplay && ignoreDisabledOverlayDisplay === true) &&
      (disabled || isDisabled?.value == true)
    ) {
      result = OverlayState.Disabled;
    } else {
      if (isPressed.value) {
        result = OverlayState.Activated;
      } else {
        result = OverlayState.None;
      }
    }

    // console.log('ButtonWTIcon; overlayStateDerived: ', result);
    return result;
  }, [disabled, ignoreDisabledOverlayDisplay]);

  const disabledDerived = useDerivedValue(() => {
    let result: boolean | null | undefined = null;
    if (disabled != null) {
      result = disabled;
    } else if (isDisabled != null) {
      result = isDisabled.value;
    }
    return result;
  }, [disabled]);

  // --------------------------------------------------------------------------------------------------
  // REMOVED:
  // const [isDisabledState, setIsDisabledState] = useState<boolean | null | undefined>(disabledDerived.value);
  // useDerivedValue(() => {
  //   scheduleOnRN(setIsDisabledState, disabledDerived.value);
  // });
  // --------------------------------------------------------------------------------------------------

  useAnimatedReaction(
    () => {
      return overlayStateDerived.value;
    },
    (overlayStateDerivedValue, previous) => {
      if (overlayStateDerivedValue !== previous) {
        overlayState.value = overlayStateDerivedValue;
      }
    },
    [],
  );

  const onPressIn = useCallback(() => {
    // console.log('ButtonWTIcon; onPressIn');
    isPressed.value = true;
  }, []);

  const onPressOut = useCallback(() => {
    // console.log('ButtonWTIcon; onPressOut');
    isPressed.value = false;
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform:
        isPressAnimationActive == true && isPressed.value == true ? [{ scale: pressedScaleValue }] : [{ scale: 1 }],
    };
  }, []);

  const animatedProps = useAnimatedProps(() => {
    // We use the derived shared value to set the non-animated 'disabled' prop
    return { disabled: disabledDerived.value };
  }, []);

  return (
    <AnimatedPressable
      {...restInputs}
      style={[styles.button, animatedStyle, containerStyle]}
      onPress={props.onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      // Removed the static disabled prop assignment
      // disabled={isDisabledState} 
      animatedProps={animatedProps}
    >
      {children}
      <OverlayView state={overlayState} viewStyle={[styles.overlay, overlayStyle]} customOpacities={overlayOpacities} />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    // backgroundColor: 'blue',
    // padding: 10,

    alignItems: 'center',
  },
  overlay: {
    borderRadius: SizeConstants.borderRadius,
    // backgroundColor: ColorConstants.primary,
    backgroundColor: ColorConstants.onSurface,
  },
});