import Sound from "react-native-sound";
import { IService } from "./IService";
import { ServiceBase } from "./ServiceBase";
import { LogService } from "./Log/LogService";

export class SoundService extends ServiceBase implements IService {
    static baseName: string = 'SoundService';
    name: string = SoundService.baseName;


    private whistle: Sound | null = null;
    private whistleTriple: Sound | null = null;

    setWhistle(whistle: Sound | null) {
        this.whistle = whistle;
    }

    getWhistle(): Sound | null {
        return this.whistle;
    }

    getWhistleTriple(): Sound | null {
        return this.whistleTriple;
    }

    initialize(): void {
        this.initializeWhistleSound();
        this.initializeWhistleTripleSound();
    }

    finalize(): void {
        this.finalizeWhistleSound();
        this.finalizeWhistleTripleSound();
    }

    private initializeWhistleSound() {
        LogService.debug('initializeWhistleSound========================tts bellsound');
        Sound.setCategory('Playback');
        let tmpWhistle = new Sound('whistle_4_2.wav', Sound.MAIN_BUNDLE, error => {
            if (error) {
                LogService.debug('failed to load the sound', error);
                return;
            }
            // loaded successfully
            LogService.debug(
                'duration in seconds: ' +
                tmpWhistle.getDuration() +
                'number of channels: ' +
                tmpWhistle.getNumberOfChannels(),
            );
            tmpWhistle.setVolume(1);
            // let tmpStartTime = Instant.now();
            // tmpWhistle.play(result => {
            //     let tmpCurrentTime = Instant.now()
            //     let td =
            //         tmpCurrentTime.toEpochMilli() - tmpStartTime.toEpochMilli();
            //     LogService.debug(
            //         String.format(
            //             'tf================================= from start to end of play  result: {0}, td: {1}',
            //             result, td,
            //         ),
            //     );
            // });

        });
        this.setWhistle(tmpWhistle);
    }

    private finalizeWhistleSound() {
        let tmpWhistle = this.getWhistle();
        if (tmpWhistle != null) {
            tmpWhistle.release();
        }
    }

    private initializeWhistleTripleSound() {
        LogService.debug('initializeWhistleTripleSound========================tts bellsound');
        Sound.setCategory('Playback');
        let tmpWhistle = new Sound('whistle_4_triple.wav', Sound.MAIN_BUNDLE, error => {
            if (error) {
                LogService.debug('failed to load the sound', error);
                return;
            }
            // loaded successfully
            LogService.debug(
                'duration in seconds: ' +
                tmpWhistle.getDuration() +
                'number of channels: ' +
                tmpWhistle.getNumberOfChannels(),
            );
            tmpWhistle.setVolume(1);
            // let tmpStartTime = Instant.now();
            // tmpWhistle.play(result => {
            //     let tmpCurrentTime = Instant.now()
            //     let td =
            //         tmpCurrentTime.toEpochMilli() - tmpStartTime.toEpochMilli();
            //     LogService.debug(
            //         String.format(
            //             'tf================================= from start to end of play  result: {0}, td: {1}',
            //             result, td,
            //         ),
            //     );
            // });

        });
        this.whistleTriple = tmpWhistle;
    }

    private finalizeWhistleTripleSound() {
        let tmpWhistle = this.whistleTriple;
        if (tmpWhistle != null) {
            tmpWhistle.release();
        }
    }
}