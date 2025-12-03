import { useIsFocused } from "@react-navigation/native";
import { useDerivedValue } from "react-native-reanimated";

export function useIsFocusedShared() {
    const isFocused = useIsFocused();
    const isFocusedShared = useDerivedValue(() => {
        return isFocused;
    }, [isFocused]);

    return isFocusedShared;
}