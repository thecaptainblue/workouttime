import React, {
  ForwardedRef,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  ColorValue,
  InputModeOptions,
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  TargetedEvent,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  TextInputSubmitEditingEventData,
  TextStyle,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import {FakeCaret, FakeCaretRefProps} from './FakeCaret';
import {LogService} from '../services/Log/LogService';
import {StringHelper} from '../helper/json/StringHelper';
import {String} from 'typescript-string-operations';
import Animated, {useAnimatedStyle, useSharedValue} from 'react-native-reanimated';
import useWhatChanged from '../hooks/useWhatChanged';
import useUpdatedRef from '../hooks/useUpdatedRef';

const Constants = {
  BorderRadius: 10,
};

export type TextInputWTRefProps = {
  enableInput: (isEnabled: boolean, selectedValue: string) => void;
  updateText: (text: string) => void;
};

export interface TextInputWTProps {
  disabled?: boolean;
  selectionColor?: ColorValue;
  selectionBorderRadius?: number | undefined;
  containerStyle?: StyleProp<ViewStyle>;
  containerInnerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  textCaretStyle?: StyleProp<TextStyle>;
  rangeMin?: number;
  rangeMax?: number;
  onTextSubmit?: (text: string) => void;
  onBlur?: (text: string) => void;
  onChangeText?: (text: string) => void;
  inputMode?: InputModeOptions;
  formatInput?: string;
  placeholder?: string | undefined;
  defaultValue?: string;
}

function TextInputWTInner(props: TextInputWTProps, ref: ForwardedRef<TextInputWTRefProps>) {
  const {
    disabled,
    containerStyle,
    containerInnerStyle,
    textStyle,
    textCaretStyle,
    rangeMin,
    rangeMax,
    selectionColor = 'grey',
    onTextSubmit,
    onBlur,
    onChangeText,
    inputMode,
    formatInput,
    placeholder,
    selectionBorderRadius,
    defaultValue,
  } = props;
  useWhatChanged(props, 'TextInputWTInner');
  const refCaret = useRef<FakeCaretRefProps | null>(null);
  const touchableRef = useRef<TouchableWithoutFeedback | null>(null);
  const inputRef = useRef<TextInput | null>(null);
  const [inputText, setInputText] = useState(defaultValue ? defaultValue : '');
  const inputTextRef = useUpdatedRef(inputText);
  // const [isSelected, setIsSelected] = useState(false);
  const isSelected = useSharedValue(false);
  const isSelectedRef = useRef(isSelected.value);
  const [isFocused, setIsFocused] = useState(false);
  const [isDisabled, setIsDisabled] = useState(disabled);
  const isDisabledReference = useRef(isDisabled);
  isDisabledReference.current = isDisabled;
  const isSkipRef = useRef(false);
  const expectedTextOnSkip = useRef('');

  const isPlaceHolderShown = StringHelper.isEmpty(inputText) && placeholder && !StringHelper.isEmpty(placeholder);

  useEffect(() => {
    // console.log('useEffect inputTextChanged newText:', inputText);
    if (onChangeText) {
      onChangeText(inputText);
    }
  }, [inputText]);

  const processOnFocus = useCallback(() => {
    // console.log('processOnFocus ');
    // refCaret.current?.show();
    setIsFocused(true);
  }, []);

  const changeIsSelected = useCallback((value: boolean) => {
    'worklet';
    if (isSelectedRef.current !== value) {
      isSelected.value = value;
      isSelectedRef.current = value;
    }
  }, []);

  const takeFocus = useCallback(() => {
    // console.log('takeFocus ');
    inputRef.current?.focus();
    // setIsSelected(true);
    // isSelected.value = true;
    changeIsSelected(true);
  }, []);

  const changeInputText = useCallback(
    (text: string) => {
      let newText = text;
      if (inputMode && inputMode == 'numeric') {
        newText = text.replace(/[^0-9]/g, '');
      }
      const inputText = inputTextRef.current;
      if (inputText !== newText) {
        if (inputMode && inputMode == 'numeric') {
          const currentValue = Number.parseInt(inputText);
          let numValue = Number.parseInt(newText);
          let isInRange = true;
          if (rangeMin && numValue < rangeMin) {
            isInRange = false;
          }
          if (rangeMax && numValue > rangeMax) {
            isInRange = false;
          }

          LogService.debug(
            String.format(
              'changeInputText: newText:{0} currentValue:{1} numValue:{2},',
              newText,
              currentValue,
              numValue,
            ),
          );
          if (currentValue != numValue && isInRange) {
            if (StringHelper.isEmpty(newText)) {
              setInputText(newText);
            } else {
              setInputText(numValue.toString());
            }
          }
        } else {
          setInputText(newText);
        }
      }
    },
    [rangeMin, rangeMax],
  );

  useImperativeHandle(
    ref,
    () => ({
      enableInput: (isEnabled: boolean, selectedValue: string) => {
        if (isEnabled === isDisabledReference.current) {
          // runOnJS((isEnabled: boolean) => {
          LogService.debug(String.format('enableInput Imperative, {0}', isEnabled));
          if (isEnabled) {
            // setInputText(selectedValue);
            changeInputText(selectedValue);
            setIsDisabled(false);
            takeFocus();
            processOnFocus();
          } else {
            setIsDisabled(true);
            inputRef.current?.blur();
          }
          // })(isEnabled);
        }
      },
      updateText(text: string) {
        // setInputText(text);
        changeInputText(text);
      },
    }),
    [processOnFocus, takeFocus, isDisabled, changeInputText],
  );

  useEffect(() => {
    // console.log('caret sm, isFocused:%s inputText:%s isSelected.value:%s', isFocused, inputText, isSelected.value);
    if (isFocused) {
      if (StringHelper.isEmpty(inputText) || !isSelectedRef.current) {
        refCaret.current?.show();
      }
    }
  }, [isFocused, isSelectedRef.current, inputText]);

  const formatInputText = useCallback(
    (text: string): string => {
      let formattedText = text;
      if (formatInput) {
        formattedText = String.format(formatInput, text);
      }
      return formattedText;
    },
    [formatInput],
  );

  const handleOnFocus = useCallback(
    (e: NativeSyntheticEvent<TargetedEvent>) => {
      // console.log('handleOnFocus ');
      // // refCaret.current?.show();
      // setIsFocused(true);
      processOnFocus();
    },
    [processOnFocus],
  );

  const handleOnBlur = useCallback(
    (e: NativeSyntheticEvent<TargetedEvent>) => {
      // console.log('handleOnBlur');
      refCaret.current?.hide();
      const formattedText = formatInputText(inputText);
      // setIsSelected(false);
      // isSelected.value = false;
      changeIsSelected(false);
      setIsFocused(false);
      onBlur?.(formattedText);
    },
    [formatInputText, inputText],
  );

  const handleOnPressIn = useCallback(() =>
    // e: GestureResponderEvent
    {
      // console.log('handleOnPressIn isFocused: ', isFocused);
      if (!isFocused) {
        takeFocus();
      }
    }, [isFocused]);

  const handleOnKeyPress = useCallback(
    (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      const newKey = e.nativeEvent.key;
      console.log('handleOnKeyPress newKey ', newKey);
      if (isSelectedRef.current) {
        // isSelected.value = false;
        changeIsSelected(false);
        isSkipRef.current = true;
        changeInputText(newKey);
      } else {
        expectedTextOnSkip.current = inputTextRef.current + newKey;
      }
    },
    [isSelectedRef.current, changeInputText],
  );

  const handleTextInputOnChangeText = useCallback(
    (text: string) => {
      console.log('handleTextInputOnChangeText', text);
      changeIsSelected(false);
      if (!isSkipRef.current) {
        changeInputText(text);
      } else {
        if (text === expectedTextOnSkip.current) {
          console.log('changeSkipReference');
          isSkipRef.current = false;
          changeInputText(text);
        }
      }
    },
    [changeInputText],
  );

  const handleSubmitEditing = useCallback(
    (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
      const formattedText = formatInputText(inputText);
      onTextSubmit?.(formattedText);
    },
    [formatInputText, inputText],
  );
  const selectionAnimStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: !isPlaceHolderShown && isSelected.value ? selectionColor : 'transparent',
      // opacity: isSelected.value ? 0.5 : 1
    };
  }, [isPlaceHolderShown]);

  const formattedText = formatInputText(inputText);
  const displayText =
    isSelectedRef.current == true || (isSelectedRef.current == false && isFocused == false) ? formattedText : inputText;

  // LogService.infoFormat(
  //   'displayText:{0} isSelectedRef:{1} formattedText:{2} inputText:{3} isFocused:{4}',
  //   displayText,
  //   isSelectedRef.current,
  //   formattedText,
  //   inputText,
  //   isFocused,
  // );

  LogService.debug('rerender TextInputWT inputText: ', inputText);
  // LogService.debugFormat('rerender TextInputWT inputText:{0}, formattedText:{1}', inputText, formattedText);

  return (
    <TouchableWithoutFeedback
      // accessibilityRole="button"
      onPressIn={handleOnPressIn}
      ref={touchableRef}
      disabled={isDisabled}>
      <View
        // focusable={true}
        // onFocus={handleOnFocus}
        // onBlur={handleOnBlur}
        style={[
          styles.container,
          {
            // alignItems: 'flex-end',
            // //@ts-ignore
            // cursor: 'pointer',
            // flex: 1,
            // borderColor: 'orange',
            // borderWidth: 1,
            // flexDirection: 'row',
            // alignItems: 'center',
          },
          containerStyle,
        ]}
        // focusable={true}
      >
        <Animated.View
          style={[
            styles.selection,
            containerInnerStyle,
            {borderRadius: selectionBorderRadius ? selectionBorderRadius : Constants.BorderRadius},
            selectionAnimStyle,
          ]}>
          {!isPlaceHolderShown && <Text style={[styles.textInput, textStyle]}>{displayText}</Text>}
        </Animated.View>
        <FakeCaret
          ref={refCaret}
          textParentStyle={textStyle ? textStyle : styles.textInput}
          textStyle={textCaretStyle}
        />
        {isPlaceHolderShown && <Text style={[styles.textInput, textStyle, {opacity: 0.5}]}>{placeholder}</Text>}
        <View pointerEvents="none" style={styles.textInputContainer}>
          <TextInput
            ref={inputRef}
            // editable={true} // Set to false to prevent editing
            onFocus={handleOnFocus}
            onBlur={handleOnBlur}
            onSubmitEditing={handleSubmitEditing}
            // keyboardType="numeric"
            inputMode={inputMode}
            onChangeText={handleTextInputOnChangeText}
            onKeyPress={handleOnKeyPress}
            value={inputText}
            onPressIn={() => console.log('onPressInTextInput')}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
export const TextInputWT = memo(forwardRef(TextInputWTInner));

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // flex: 1,
    // padding: 20
  },
  textInputContainer: {
    opacity: 0,
    position: 'absolute',
    zIndex: -1,
    top: 0,
  },
  textInput: {
    // borderColor: 'orange',
    // borderWidth: 1,
    fontSize: 40,
  },
  selection: {
    // backgroundColor: isSelected.value ? selectionColor : 'transparent',
    borderRadius: Constants.BorderRadius,
    // opacity: 0.5,
    // paddingHorizontal: 10,
  },
});
