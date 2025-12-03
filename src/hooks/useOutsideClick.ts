import { AnimatedRef, MeasuredDimensions, SharedValue, measure, runOnUI, useSharedValue } from "react-native-reanimated";
import { OffsetWindow } from "../@types/OffsetWindow";
import { MutableRefObject, useCallback, useEffect, useRef } from "react";
import { DeviceEventEmitter } from "react-native";
import { EventName } from "../@types/EventNames";
import { GestureStateChangeEvent, TapGestureHandlerEventPayload } from "react-native-gesture-handler";
import { useIsFocusedShared } from "./useIsFocusedShared";
import { useMeasureRef } from "./useMeasureRef";
import { LogService } from "../services/Log/LogService";
import { String, } from "typescript-string-operations";
import useWhatChanged from "./useWhatChanged";

export interface OutsideClickProps {
    onOutsideClicked: () => void;
    offset: OffsetWindow;
    dynamicOffsetX?: SharedValue<number>;
    dynamicOffsetY?: SharedValue<number>;
    parentName?: string;
}

export function useOutsideClick(
    props: OutsideClickProps
): MutableRefObject<(animatedRef: AnimatedRef<any>) => void> {
    const { onOutsideClicked, offset = { left: 0, right: 0, top: 0, bottom: 0 }, dynamicOffsetX, dynamicOffsetY, parentName } = props;
    // useWhatChanged(props, "useOutsideClick " + parentName);
    // const isFocused = useIsFocusedShared();
    const areaMeasurement = useSharedValue<MeasuredDimensions | null>(null);
    // const onlayoutChanged = useCallback((animatedRef: AnimatedRef<any>) => {
    //     //soru: olcmek yerine direk layoutu alsam nasil olur.
    //     // cevap: absolute degerlere ihtiyacim oldugundan layout isimi cozmuyor.
    //     console.log('onlayoutChanged ======================== isFocused: ', isFocused.value);
    //     if (animatedRef.current && isFocused != null && isFocused.value) {
    //         console.log('onlayoutChanged will measure ========================');
    //         runOnUI(() => {
    //             const measurement = measure(animatedRef);
    //             if (measurement !== null) {
    //                 // console.log('useOutsideClick measurement: ', measurement);
    //                 areaMeasurement.value = measurement;
    //             }
    //         })();
    //     }
    // }, []);
    // const onlayoutChangedRef = useRef(onlayoutChanged);
    // console.log('useOutsideClick name: ', name);
    const onlayoutChangedRef = useMeasureRef(areaMeasurement, parentName);

    useEffect(() => {
        const listener = DeviceEventEmitter.addListener(EventName.TouchedEvent, event => {
            const clickedEvent = event as GestureStateChangeEvent<TapGestureHandlerEventPayload>;
            // console.log('useOutsideClick event listener', clickedEvent);
            const measurement = areaMeasurement.value;
            // console.log('useOutsideClick measurement', measurement);
            if (measurement !== null) {
                const x1 = measurement.pageX - offset.left + (dynamicOffsetX != undefined ? dynamicOffsetX.value : 0);
                const x2 = measurement.pageX + measurement.width + offset.right + (dynamicOffsetX != undefined ? dynamicOffsetX.value : 0);
                const y1 = measurement.pageY - offset.top + (dynamicOffsetY != undefined ? dynamicOffsetY.value : 0);
                const y2 = measurement.pageY + measurement.height + offset.bottom + (dynamicOffsetY != undefined ? dynamicOffsetY.value : 0);
                // console.log('x1:%s ,x2:%s, y1:%s, y2:%s ', x1, x2, y1, y2);
                if (
                    !(
                        clickedEvent.absoluteX >= x1 &&
                        clickedEvent.absoluteX <= x2 &&
                        clickedEvent.absoluteY >= y1 &&
                        clickedEvent.absoluteY <= y2
                    )
                ) {
                    onOutsideClicked();
                }
            }
        });
        return () => {
            listener.remove();
        };
    }, []);
    LogService.debug(String.format('rerender useOutsideClick {0} ', parentName,));
    return onlayoutChangedRef;
}