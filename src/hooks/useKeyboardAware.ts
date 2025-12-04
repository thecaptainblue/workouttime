import { useEffect } from "react";
import { Keyboard } from "react-native";
import { useAnimatedReaction, useDerivedValue, useSharedValue } from "react-native-reanimated";
import { useIsFocusedShared } from "./useIsFocusedShared";
import { LogService } from "../services/Log/LogService";

export function useKeyboardAware(name: string)
// : [Readonly<SharedValue<boolean>>, Readonly<SharedValue<boolean>>, Readonly<SharedValue<boolean>>,]
{
    const isKeyboardVisible = useSharedValue(false);
    const isFocusedShared = useIsFocusedShared();
    const lastValueSent = useSharedValue(false);
    const isKeyboardVisibleOnlyFocused = useDerivedValue(() => {

        let result = lastValueSent.value;
        if (isFocusedShared.value) {
            result = isKeyboardVisible.value;
            lastValueSent.value = result;
        }
        // console.log('useKeyboardAware name: %s isKeyboardVisible: %s isFocusedShared: %s lastValueSent:%s result:%s', name, isKeyboardVisible.value, isFocusedShared.value, lastValueSent.value, result);
        return result;
    }, []);

    const isVisibleResult = useSharedValue(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) => {
            isKeyboardVisible.value = true;
            // console.log('useKeyboardAware isKeyboardVisible: %s event: ', isKeyboardVisible.value, LogHelper.toString(event))
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            isKeyboardVisible.value = false;
            // console.log('useKeyboardAware isKeyboardVisible: ', isKeyboardVisible.value)
        });

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    useAnimatedReaction(() => { return isKeyboardVisibleOnlyFocused.value },
        (current, previous) => {
            if (current !== previous) {
                isVisibleResult.value = current
                // console.log('useKeyboardAware name: %s isVisibleResult: %s ', name, isVisibleResult.value,);
            }
        }, []);

    //////////
    // return [isKeyboardVisible, isFocusedShared];
    // return [isKeyboardVisibleOnlyFocused, isKeyboardVisible, isFocusedShared];
    LogService.debug('rerender useKeyboardAware ');
    return isVisibleResult;
}