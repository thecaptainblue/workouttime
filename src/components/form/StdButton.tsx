import React from 'react';
import {Pressable, Text} from 'react-native';
import {FormStyles} from './FormStyles';
interface StdButtonProps {
  title: string;
  onPress: () => void;
}
export default function StdButton({title, onPress}: StdButtonProps) {
  return (
    <Pressable
      style={FormStyles.buttonAdd}
      onPress={onPress}
      // disabled={!isValid}
    >
      <Text style={FormStyles.buttonText}>{title}</Text>
    </Pressable>
  );
}
