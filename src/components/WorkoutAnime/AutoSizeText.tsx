import {memo} from 'react';
import {StyleProp, StyleSheet, Text, TextStyle} from 'react-native';

export interface AutoSizeTextProps {
  text: String;
  numberOfLines?: number;
  textStyle?: StyleProp<TextStyle>;
}

function AutoSizeTextInner(props: AutoSizeTextProps) {
  const {text, textStyle, numberOfLines} = props;
  return (
    <Text
      style={[styles.text, textStyle]}
      numberOfLines={numberOfLines}
      ellipsizeMode="tail"
      // maxFontSizeMultiplier={2} android de calismiyor sanirim.
      adjustsFontSizeToFit={true}
      minimumFontScale={0.6}>
      {text}
    </Text>
  );
}
export const AutoSizeText = memo(AutoSizeTextInner);

const styles = StyleSheet.create({
  text: {
    // borderColor: 'red',
    // borderWidth: 1,
  },
});
