import { useEffect, useRef } from "react";
import { AppState } from "react-native";
import { LogService } from "../services/Log/LogService";
import LogHelper from "../helper/LogHelper";

export function useObserveAppState(backgroundCallback: (() => void | null)) {
    const appState = useRef(AppState.currentState);
    // LogService.infoFormat('useObserveAppState rerender appState:{0}', LogHelper.toString(appState));

    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === 'active'
            ) {
                // LogService.infoFormat('useObserveAppState App has come to the foreground! nextAppState:{0}', nextAppState);

            }
            else {
                // LogService.infoFormat('useObserveAppState App has gone to the background! nextAppState:{0}', nextAppState);
                if (backgroundCallback != null) {
                    backgroundCallback();
                }
            }

            appState.current = nextAppState;
            // LogService.infoFormat('AppState', appState.current);
        });

        return () => {
            subscription.remove();
        };
    }, []);
}