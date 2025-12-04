import { StyleProp, Text, TextStyle } from 'react-native';
import { SharedValue, runOnJS, useAnimatedReaction } from 'react-native-reanimated';
import { memo, useState } from 'react';
import { LogService } from '../services/Log/LogService';
import useWhatChanged from '../hooks/useWhatChanged';

export interface TextDisplayProps {
  text: SharedValue<string>;
  style?: StyleProp<TextStyle>;
}

function TextDisplayInner(props: TextDisplayProps) {
  const { text, style } = props;
  useWhatChanged(props, 'TextDisplayInner');
  const [displayText, setDisplayText] = useState(text.value);

  useAnimatedReaction(
    () => {
      return text.value;
    },
    currentText => {
      if (currentText != null) {
        runOnJS(setDisplayText)(currentText);
      }
    },
  );

  // LogService.debug('rerender TextDisplay ', displayText);
  return <Text style={style}>{displayText}</Text>;
}

export const TextDisplayStateBased = memo(TextDisplayInner);
