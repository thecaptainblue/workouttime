import { Pressable, PressableProps, StyleSheet, View, ViewStyle } from 'react-native';
import { ColorConstants, FontConstants, SizeConstants } from '../constants/StyleConstants';
import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import { StyleProp } from 'react-native';
import Animated from 'react-native-reanimated';
import { LogService } from '../services/Log/LogService';

const ButtonWidthHeight = 70;

export interface FloatingButtonProps extends PressableProps {
  containerStyle?: StyleProp<ViewStyle>;
}

export function FloatingButton(props: FloatingButtonProps) {
  const { containerStyle } = props;

  LogService.debug('rerender FloatingButton');
  return (
    <Animated.View style={[styles.containerBottom, containerStyle]}>
      <Pressable
        {...props}
        style={({ pressed }) => (pressed ? [styles.buttonAdd, { transform: [{ scale: 0.9 }] }] : [styles.buttonAdd])}>
        <Icon name="plus" size={FontConstants.sizeLargeXXXX} color={ColorConstants.onSecondary} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  containerBottom: {
    position: 'absolute',
    bottom: 20,
    right: SizeConstants.paddingSmallX,
  },
  buttonAdd: {
    // borderWidth: 1,
    // borderColor: ButtonColor,
    backgroundColor: ColorConstants.analogous2,
    alignItems: 'center',
    justifyContent: 'center',

    width: ButtonWidthHeight,
    height: ButtonWidthHeight,
    borderRadius: ButtonWidthHeight / 2,
  },
});
