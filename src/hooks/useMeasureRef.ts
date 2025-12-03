import Animated, { AnimatedRef, MeasuredDimensions, SharedValue, measure, runOnJS, runOnUI, useAnimatedReaction, useAnimatedRef, useSharedValue } from "react-native-reanimated";
import { useIsFocusedShared } from "./useIsFocusedShared";
import { useCallback, useEffect, useRef, useState } from "react";
import { String, StringBuilder } from "typescript-string-operations";
import { useFocusEffect } from "@react-navigation/native";
import LogHelper from "../helper/LogHelper";
import { LogService } from "../services/Log/LogService";
import useWhatChanged from "./useWhatChanged";

export function useMeasureRef(areaMeasurement: SharedValue<MeasuredDimensions | null>, parentName?: string) {
    // useWhatChanged({ areaMeasurement, parentName }, "useMeasureRef " + parentName);
    const isMeasuredUpdated = useSharedValue(false);
    const isFocused = useIsFocusedShared();
    // const latestAnimatedRef = useSharedValue<AnimatedRef<any> | null>(null);
    // const latestAnimatedRef = useRef<AnimatedRef<any> | null>(null);
    // const [latestAnimatedRef, setLatestAnimatedRef] = useState<AnimatedRef<any> | null>(null);
    const latestAnimatedRef = useRef<any>(null);
    // nedense animatedRefi iki render arasina tasiyamiyorum, layoutlarda farklilik var mi diye bakacagim bu haliyle biraksam olur mu diye
    // const areaMeasurement = useSharedValue<MeasuredDimensions | null>(null);
    const onlayoutChanged = useCallback((animatedRef: AnimatedRef<any>) => {
        // 'worklet';
        //soru: olcmek yerine direk layoutu alsam nasil olur.
        // cevap: absolute degerlere ihtiyacim oldugundan layout isimi cozmuyor.
        // console.log('useMeasureRef name: ', name);
        const text = new StringBuilder(String.format('useMeasureRef name: {0} onlayoutChanged; isFocused: {1} isMeasuredUpdated: {2} ', parentName, isFocused.value, isMeasuredUpdated.value));
        // console.log('latestAnimatedFerRef.current :  %s ----------------------------------------', latestAnimatedRef.current);

        latestAnimatedRef.current = animatedRef;
        if (animatedRef.current) {
            if (isFocused.value) {
                isMeasuredUpdated.value = true
                text.append('will measure ');
                runOnUI(() => {
                    const measurement = measure(animatedRef);
                    if (measurement !== null) {
                        // console.log('useMeasureRef name: %s onlayoutChanged; measurement: %s', parentName, measurement);
                        // text.append(" measurement: ")
                        // text.append(measurement);
                        areaMeasurement.value = measurement;
                    }
                    // console.log('========  useMeasureRef name: %s onlayoutChanged; measurement: %s', parentName, measurement);
                })();
            } else {
                text.append('is not focused so wont measure ');
                // console.log('useMeasureRef when focus is false animatedRef : ', animatedRef);
                isMeasuredUpdated.value = false;
            }

        } else {
            text.append(' animatedRef is null !!!');
        }
        // console.log(text.toString());
    }, []);
    const onlayoutChangedRef = useRef(onlayoutChanged);
    onlayoutChangedRef.current = onlayoutChanged;

    /* 
    latestAnimatedRef sadece render sonrasinda not null oluyor bu yuzden useEffect kullanmak zorunda kaldim. reaction calismadi.
    */
    useFocusEffect(useCallback(() => {

        // console.log('==== useMeasureRef useFocusEffect %s latestAnimatedRef: %s isMeasuredUpdated: %s ', name, latestAnimatedRef.current == null || latestAnimatedRef.current == undefined ? 'null' : ' not null', isMeasuredUpdated.value);
        const text = new StringBuilder(String.format('useMeasureRef useFocusEffect {0} latestAnimatedRef: {1} isMeasuredUpdated: {2} . ', parentName, latestAnimatedRef.current == null || latestAnimatedRef.current == undefined ? 'null' : ' not null', isMeasuredUpdated.value));

        if (latestAnimatedRef.current !== null && latestAnimatedRef.current !== undefined && isMeasuredUpdated.value == false) {
            text.append("  measure again ");
            runOnUI(() => {
                const measurement = measure(latestAnimatedRef.current);
                if (measurement !== null) {
                    // console.log('========  useMeasureRef name: %s useFocusEffect; measurement: %s', parentName, measurement);
                    // text.append(String.format(' measurement {0}', measurement)); // ui da calistigi icin StringBuilder ve String.format sorun cikartiyor.
                    areaMeasurement.value = measurement;
                    isMeasuredUpdated.value = true
                }
                // console.log('========  useMeasureRef name: %s useFocusEffect; measurement: %s', parentName, measurement);
            })();
        } else {
            text.append(" wont measure !!!");
        }
        // console.log(text.toString());
    }, []));

    LogService.debug(String.format('rerender useMeasureRef {0} ', parentName,));
    return onlayoutChangedRef;
}