import { Instant } from "@js-joda/core";
import { LogService } from "../../services/Log/LogService";
import { useEffect, useRef } from "react";
import { String } from 'typescript-string-operations';
import Tts from "react-native-tts";

export default function usePlayEnd(speakTexts: string[], playSound?: () => Promise<boolean>) {
    const tmpStartTimeRef = useRef(Instant.now());
    const firstTimeRef = useRef(true);
    if (firstTimeRef.current) {
        firstTimeRef.current = false;
        LogService.debug('usePlayEnd start text: ', speakTexts);
        let tmpCurrentTime = Instant.now();
        let tdBeginPlayTimeFromStart = tmpCurrentTime.toEpochMilli() - tmpStartTimeRef.current.toEpochMilli();
        LogService.debug(
            String.format('usePlayEnd tf================================= from start to begin play {0}', tdBeginPlayTimeFromStart),
        );
        if (playSound) {
            const playSoundFnc = async () => {
                try {
                    tmpCurrentTime = Instant.now();
                    let tdBeginPlayTimeFromStart2 = tmpCurrentTime.toEpochMilli() - tmpStartTimeRef.current.toEpochMilli();
                    const succces = await playSound();
                    LogService.debug(
                        String.format('usePlayEnd played successfully result: {0} td: {1}', succces, tdBeginPlayTimeFromStart2),
                    );
                } catch (error) {
                    LogService.debug(String.format('usePlayEnd couldnt play!! result: %s', error));
                }

                tmpCurrentTime = Instant.now();
                let tdEndPlayTimeFromStart = tmpCurrentTime.toEpochMilli() - tmpStartTimeRef.current.toEpochMilli();
                LogService.debug(
                    String.format('usePlayEnd tf================================= from start to end play {0}', tdEndPlayTimeFromStart),
                );

                LogService.debug(String.format('usePlayEnd speak:  {0}', speakTexts));
                speak(speakTexts);
            };

            playSoundFnc();

        } else {
            LogService.debug(String.format('usePlayEnd speak2:  {0}', speakTexts));
            speak(speakTexts);
        }
    }

    useEffect(() => {
        return () => {
            LogService.debug('usePlayEnd end ');
            Tts.stop();
        };
    }, []);

}

function speak(speakTexts: string[]) {
    for (let speakText of speakTexts) {
        // console.log('speakText ', speakText)
        Tts.speak(speakText);
    }
}