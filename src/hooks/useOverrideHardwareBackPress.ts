import { useFocusEffect } from "@react-navigation/native";
import { BackHandler } from "react-native";

export function useOverrideHardwareBackPress(handler: () => boolean | null | undefined) {

    useFocusEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handler);
        return () => backHandler.remove();
    });
    // console.log('rerender useOverrideHardwareBackPress');
}