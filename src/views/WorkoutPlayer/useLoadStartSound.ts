import { useEffect, useRef } from "react";
import { LogService } from "../../services/Log/LogService";
import { ServiceRegistry } from "../../services/ServiceRegistry";
import { SoundService } from "../../services/SoundService";
import Tts from "react-native-tts";
import Sound from "react-native-sound";

export default function useLoadStartSound(startSoundPromiseRef: React.MutableRefObject<(() => Promise<boolean>) | undefined>, endSoundPromiseRef: React.MutableRefObject<(() => Promise<boolean>) | undefined>, setIsLoaded?: React.Dispatch<React.SetStateAction<boolean>>,) {
    // workoutPlayer icerisinde useEffect icindeydi ama ben burada baslangica aldim.
    // Sound.setCategory('Playback');
    // let tmpWhistle = SoundService.getInstance().getWhistle();
    // const registryRef = useRef(ServiceRegistry.getInstance());
    const firstTimeRef = useRef(true);
    if (firstTimeRef.current) {
        LogService.debug('useLoadStartSound tts bellsound---------------');
        firstTimeRef.current = false;
        const registryRef = ServiceRegistry.getInstance();
        let soundService: SoundService = registryRef.getService(SoundService.baseName) as SoundService;
        startSoundPromiseRef.current = createSoundPromise(soundService.getWhistle());
        endSoundPromiseRef.current = createSoundPromise(soundService.getWhistleTriple());
    }

    useEffect(() => {
        // bu useEffect'e cagrilmassa ikinci kez ayni workout calistiginda okuma sesi gelmiyor
        setIsLoaded?.(true);
        return () => {
            LogService.debug('useLoadStartSound tts effect end');
            Tts.stop();
        };
    }, []);
}

function createSoundPromise(tmpWhistle: Sound | null) {
    let result: (() => Promise<boolean>) | undefined;
    if (tmpWhistle != null) {
        LogService.debug('tts bellsound---------------');
        const startSoundPromise = () =>
            new Promise<boolean>((resolve, reject) => {
                tmpWhistle?.play(success => {
                    if (success) {
                        resolve(success);
                    } else {
                        reject(success);
                    }
                });
            });
        result = startSoundPromise;
    }
    return result;
}