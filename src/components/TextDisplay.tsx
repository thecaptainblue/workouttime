import {StyleProp, StyleSheet, TextInput, TextStyle} from 'react-native';
import Animated, {SharedValue, useAnimatedProps} from 'react-native-reanimated';
import {memo} from 'react';
import useWhatChanged from '../hooks/useWhatChanged';

Animated.addWhitelistedNativeProps({text: true});
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export interface TextDisplayProps {
  text: SharedValue<string>;
  style?: StyleProp<TextStyle>;
}

function TextDisplayInner(props: TextDisplayProps) {
  // animatedTextInput kullanildiginda yukaridan height verilirse kesilmis olarak gozukuyor.
  const {text, style} = props;
  useWhatChanged(props, 'TextDisplayInner');
  const animatedProps = useAnimatedProps(() => {
    // Here we use any because the text prop is not available in the type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return {text: text.value} as any;
  });

  // const animStyle = useAnimatedStyle(() => {
  //   return text.value == '00' ? someStyle.test : {};
  //   // return someStyle.test;
  // });

  // LogService.debug('rerender TextDisplay ');
  // return <Text style={style}>{displayText}</Text>;
  return (
    <AnimatedTextInput
      editable={false}
      caretHidden={true}
      readOnly={true}
      {...props}
      value={text.value}
      style={[
        defaultStyle.text,
        style,
        // animStyle,
        // {
        //   // verticalAlign: 'middle',
        //   // textAlign: 'center',
        //   // textAlignVertical: 'center',
        //   // justifyContent: 'center',
        //   // alignSelf: 'center',
        //   // alignContent: 'center',
        //   // alignItems: 'center',
        //   // fontSize: 30,
        //   padding: 0,
        //   // paddingTop: 10,
        //   // margin: 0,
        //   // marginTop: 10,
        //   // lineHeight: 40,
        //   // color: 'white',
        //   // fontFamily: 'SFProText-Semibold',
        //   // fontSize: 40,
        //   // fontWeight: FontConstants.weightBold,
        // },
      ]}
      animatedProps={animatedProps}
    />
  );
}

const defaultStyle = StyleSheet.create({
  text: {
    padding: 0,
  },
  // test: {
  //   // borderColor: 'blue',
  //   // borderWidth: 1,
  //   // justifyContent: 'center',
  //   // alignItems: 'center',
  //   // backgroundColor: 'blue',
  // },
});

//onceki
// export interface TextDisplayProps {
//   text: SharedValue<string>;
//   style?: StyleProp<TextStyle>;
// }

// export default function TextDisplayInner(props: TextDisplayProps) {
//   const {text, style} = props;
//   const [displayText, setDisplayText] = useState(text.value);

//   useAnimatedReaction(
//     () => {
//       return text.value;
//     },
//     currentText => {
//       if (currentText != null) {
//         runOnJS(setDisplayText)(currentText);
//       }
//     },
//   );

//   //   LogService.debug('rerender TextDisplay ', displayText);
//   return <Text style={style}>{displayText}</Text>;
// }

export const TextDisplay = memo(TextDisplayInner);
