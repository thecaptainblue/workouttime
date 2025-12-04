import { Instant } from "@js-joda/core";
import { LogService } from "../../services/Log/LogService";
import { useEffect, useRef } from "react";
import { String } from 'typescript-string-operations';
import Tts from "react-native-tts";
import { useTranslation } from "react-i18next";
import { ResKey } from "../../lang/ResKey";

export default function usePlaySound(explanationText: string, playStartSound?: () => Promise<boolean>, reps?: number) {
    const { t } = useTranslation();
    const tmpStartTimeRef = useRef(Instant.now());
    const firstTimeRef = useRef(true);
    if (firstTimeRef.current) {
        firstTimeRef.current = false;
        LogService.debugFormat('usePlaySound start text: {0}', explanationText);
        let tmpCurrentTime = Instant.now();
        let tdBeginPlayTimeFromStart = tmpCurrentTime.toEpochMilli() - tmpStartTimeRef.current.toEpochMilli();
        LogService.debugFormat('usePlaySound tf================================= from start to begin play {0} ms', tdBeginPlayTimeFromStart);
        let speakText: string;
        if (reps) {
            speakText = explanationText + ' ' + reps + ' ' + t(ResKey.WorkoutPlayerRep);
        } else {
            speakText = explanationText;
        }
        //todo: iki kere soylemesinin sebebi bu olabilir bir onceki calismayi beklerken ikincisi geliyor sonra ikisi bir okunuyor.
        if (playStartSound) {
            const playSound = async () => {
                try {
                    tmpCurrentTime = Instant.now();
                    let tdBeginPlayTimeFromStart2 = tmpCurrentTime.toEpochMilli() - tmpStartTimeRef.current.toEpochMilli();
                    const succces = await playStartSound();
                    LogService.debugFormat('usePlaySound played successfully result: {0} td: {1}', succces, tdBeginPlayTimeFromStart2)
                } catch (error) {
                    LogService.debugFormat('usePlaySound couldnt play!! result: {0}', error)
                }

                tmpCurrentTime = Instant.now();
                let tdEndPlayTimeFromStart = tmpCurrentTime.toEpochMilli() - tmpStartTimeRef.current.toEpochMilli();
                LogService.debugFormat('usePlaySound tf================================= from start to end play {0}, speak:{1}', tdEndPlayTimeFromStart, speakText)
                Tts.stop();
                Tts.speak(speakText);
            };

            playSound();

        } else {
            LogService.debugFormat('usePlaySound speak2:  {0}', speakText)
            Tts.stop();
            Tts.speak(speakText);
        }
    }

    useEffect(() => {
        return () => {
            LogService.debug('usePlaySound end ');
            Tts.stop();
        };
    }, []);
}