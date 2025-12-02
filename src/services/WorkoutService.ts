import { LogService } from "./Log/LogService";
import { ServiceBase } from "./ServiceBase";
import { IService } from "./IService";
import { FSService } from "./FS/FSService";
import { ServiceRegistry } from "./ServiceRegistry";
import { FSName } from "./FS/FSName";
import { JsHelper } from "../helper/JsHelper";
import { WorkoutHelper } from "../@types/Data/WorkoutHelper";
import { WorkoutTimeHelper } from "../@types/WorkoutTimeHelper";
import { WorkoutData } from "../@types/Data/WorkoutData";
import LogHelper from "../helper/LogHelper";

export class WorkoutService extends ServiceBase implements IService {
    static Basename: string = 'WorkoutService';
    name: string = WorkoutService.Basename;

    private serviceRegistry: ServiceRegistry = ServiceRegistry.getInstance();
    private fsService: FSService | null = null;

    private workouts: WorkoutData[] = [];

    initialize(): void {
        this.fsService = this.serviceRegistry.getService(FSService.BaseName) as FSService;
        this.initializeWorkouts();

    }

    private initializeWorkouts() {
        LogService.debug('initializeWorkouts ==============');
        let tmpWorkouts: WorkoutData[] | null = null;

        tmpWorkouts = this.loadWorkouts();

        // // LogService.infoFormat('initializeWorkouts; {0}', LogHelper.toString(tmpWorkouts));
        // // TODO comment the code below if not
        // if (tmpWorkouts == null || tmpWorkouts.length == 0) {
        //     // LogService.info('initializeWorkouts db is empty create default workouts');
        //     // tmpWorkouts = WorkoutService.getInitialWorkouts();
        //     tmpWorkouts = WorkoutService.getTestWorkouts();
        //     this.saveWorkouts(tmpWorkouts);
        //     // this.upgradeLegacyWorkoutData(tmpWorkouts);
        // }

        // todo : duzeldiginden emin olduktan sonra kaldirilabilir.
        //isinsma workout'undaki breaklarin gorunmeme sorunu 
        // const isTest = true;
        // if (isTest) {
        //     const jsonText = JsHelper.stringify(isinmaJson);
        //     // LogService.infoFormat('initializeWorkouts isinma jsonText  {0}', jsonText);
        //     const isinmaWorkout = JsHelper.parse(jsonText) as WorkoutData;
        //     // LogService.infoFormat('initializeWorkouts isinma workout {0}', LogHelper.toString(isinmaWorkout));
        //     tmpWorkouts.push(isinmaWorkout);

        //     let keys: string[] = [];
        //     const newWorkouts = tmpWorkouts.filter(item => {
        //         if (keys.includes(item.id)) {
        //             return false;
        //         } else {
        //             keys.push(item.id);
        //             return true;
        //         }
        //     })
        //     // LogService.infoFormat('initializeWorkouts isinma keys {0}', LogHelper.toString(keys));
        //     this.saveWorkouts(newWorkouts);
        //     tmpWorkouts = newWorkouts;
        // }

        // tmpWorkouts?.forEach(item => LogService.infoFormat('loadWorkouts after upgrade notification:{0}', item.notifications.length));
        this.workouts = tmpWorkouts
    }

    finalize(): void {
        this.fsService = null;
    }

    getWorkouts(): WorkoutData[] | null {
        return this.workouts;
    }

    changeWorkouts(workouts: WorkoutData[]) {
        this.workouts = workouts
        this.saveWorkouts(this.workouts);
    }

    addWorkout(workout: WorkoutData, insertionIndex?: number) {
        // LogService.debug(StringOp.format('addWorkout ', workout))

        if (insertionIndex != null && insertionIndex >= 0 && insertionIndex < this.workouts.length) {
            this.workouts.splice(insertionIndex, 0, workout);
        } else {
            this.workouts.push(workout);
        }
        this.saveWorkouts(this.workouts);
    }

    addWorkouts(workouts: WorkoutData[], insertionIndex?: number) {
        // LogService.debug(StringOp.format('addWorkout ', workout))

        if (insertionIndex != null && insertionIndex >= 0 && insertionIndex < this.workouts.length) {
            this.workouts.splice(insertionIndex, 0, ...workouts);
        } else {
            this.workouts.push(...workouts);
        }
        this.saveWorkouts(this.workouts);
    }

    updateWorkout(workout: WorkoutData) {
        // LogService.debug(StringOp.format('addWorkout ', workout))
        let index = this.workouts.findIndex(item => item.id === workout.id);
        if (index >= 0) {
            this.workouts.splice(index, 1, workout);
            this.saveWorkouts(this.workouts);
        }
    }

    removeWorkout(workout: WorkoutData) {
        if (workout != null) {
            this.removeWorkoutByid(workout.id);
        }
    }

    removeWorkoutByid(workoutId: string) {
        console.log('removeWorkoutByid workoutId:', workoutId);
        let isRemoved: boolean = false;

        let index = this.workouts.findIndex((workout => {
            return workout.id === workoutId
        }));
        console.log('removeWorkoutByid index:', index);
        if (index >= 0) {

            this.workouts.splice(index, 1);
            isRemoved = true;
        }

        if (isRemoved) {
            this.saveWorkouts(this.workouts);
        }
    }

    private saveWorkouts(workouts: WorkoutData[]) {
        // let jsonText: string = JSON.stringify(workouts);
        let jsonText: string = JsHelper.stringify(workouts);
        // LogService.infoFormat('saveWorkouts jsonText:{0}', jsonText)
        this.fsService?.save(FSName.Workouts, jsonText);
    }

    private loadWorkouts(): WorkoutData[] {
        let workouts: WorkoutData[] = [];

        if (this.fsService?.hasKey(FSName.Workouts)) {
            let jsonText = this.fsService?.get(FSName.Workouts);
            // console.log('workouts jsonText:', jsonText);
            if (jsonText != null) {
                // workouts = JSON.parse(jsonText);
                workouts = JsHelper.parse(jsonText);
                // console.log('loadWorkouts workouts:', workouts);
                // LogService.debug('loadWorkouts workouts: ', workouts);
                // workouts = this.checkWorkout(workouts);
                this.upgradeLegacyWorkoutData(workouts);

                // workouts?.forEach(item => LogService.infoFormat('loadWorkouts after upgrade notification:{0}', item.notifications.length));
            }
        }

        return workouts;
    }

    private upgradeLegacyWorkoutData(legacyWorkouts: WorkoutData[] | null) {
        if (legacyWorkouts != null) {
            for (let legacyWorkout of legacyWorkouts) {
                if (legacyWorkout.notifications == undefined) {
                    // LogService.infoFormat("upgradeLegacyWorkoutData  undefined");
                    legacyWorkout.notifications = [];
                }
            }
        }
    }

    private checkWorkout(workouts: WorkoutData[] | null): WorkoutData[] | null {
        let result: WorkoutData[] | null = null;
        if (workouts !== null) {
            result = workouts.filter(workout => {
                let tmpResult = false;
                if (workout !== null && workout !== undefined && workout.id !== null) {

                    tmpResult = true;
                } else {
                    console.log('there is null or undefined workout in fs !!! workout: ', workout)
                }
                return tmpResult;
            });
        }

        return result
    }

    public static getInitialWorkouts(): WorkoutData[] {
        let result: WorkoutData[] = [];
        let id = 0;
        result.push(WorkoutService.getWorkoutExample(String(id++)));
        return result;
    }

    private static getTestWorkouts(): WorkoutData[] {
        let result: WorkoutData[] = [];
        let id = 0;
        result.push(WorkoutService.getWorkoutExample(String(id++)));
        // TODO yukseltme test icin , testen sonra yorumu kaldir
        // result.push(WorkoutService.getWorkoutFizikKuvvet(String(id++)));
        // result.push(WorkoutService.getWorkoutFizik(String(id++)));
        // result.push(WorkoutService.getWorkoutBackExercise(String(id++)));
        // // result.push(WorkoutService.getWorkoutUpperBodyShort(String(id++)));
        // result.push(WorkoutService.getWorkoutUpperBody(String(id++)));
        // result.push(WorkoutService.getWorkoutMiddleBodyOutsideShort(String(id++)));
        // result.push(WorkoutService.getWorkoutStretch(String(id++)));
        // result.push(WorkoutService.getWorkoutMeditation(String(id++)));
        // result.push(WorkoutService.getWorkoutLongBreak(String(id++)));
        return result;
    }

    private static getWorkoutFizikKuvvet(workoutId: string): WorkoutData {
        let tmpName = "Fizik Kuvvet";
        let workout = WorkoutHelper.createWorkout(workoutId, tmpName);
        let id = 0;
        let tmpGroup;
        let tmpExercise;
        let exerciseAra = WorkoutHelper.createExerciseTimeBased(String(id++), 'Ara', '', true, 1, WorkoutTimeHelper.fromSeconds(30)); // duration: 30

        //1
        tmpGroup = WorkoutHelper.createGroup(String(id++), 'Kontrast', '', 4);

        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), 'Sıcak', '', false, 1, WorkoutTimeHelper.from(3, 0)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), 'Soğuk', '', false, 1, WorkoutTimeHelper.from(1, 0)));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);

        //2
        WorkoutHelper.addComponentToWorkout(workout, WorkoutHelper.copy(exerciseAra, (String(id++))));


        //3 group pompalama
        tmpExercise = WorkoutHelper.createExerciseTimeBased(String(id++), 'Aç Kapa', '', false, 15, WorkoutTimeHelper.fromSeconds(13));
        WorkoutHelper.addComponentToWorkout(workout, tmpExercise);

        //4
        WorkoutHelper.addComponentToWorkout(workout, WorkoutHelper.copy(exerciseAra, (String(id++))));

        //5 
        tmpGroup = WorkoutHelper.createGroup(String(id++), 'Kol Düz El Yukarıda Geriye Çek', '', 1);
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), 'El Yukarı', '', false, 10, WorkoutTimeHelper.fromSeconds(13)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, (String(id++))));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);

        //6
        tmpGroup = WorkoutHelper.createGroup(String(id++), 'Kol Düz El Asağıda Geriye Çek', '', 1);
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), 'El Aşağı', '', false, 10, WorkoutTimeHelper.fromSeconds(13)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, (String(id++))));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);

        //7
        tmpGroup = WorkoutHelper.createGroup(String(id++), 'Baş Parmak Masaya', '', 1);
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), 'Baş Parmak Masaya', '', false, 10, WorkoutTimeHelper.fromSeconds(13)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, (String(id++))));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);

        //8
        tmpGroup = WorkoutHelper.createGroup(String(id++), 'Kol Düz Avuç İçi yukarı', '', 1);
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), 'Çek Bırak Avuç Yukarı', '', false, 10, WorkoutTimeHelper.fromSeconds(7)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, (String(id++))));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);

        //9
        tmpGroup = WorkoutHelper.createGroup(String(id++), 'Kol Düz Avuç İçi Aşağı', '', 1);
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), 'Çek Bırak Avuç Aşağı', '', false, 10, WorkoutTimeHelper.fromSeconds(7)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, (String(id++))));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);

        //10
        tmpGroup = WorkoutHelper.createGroup(String(id++), 'El Sallama Hareketi', '', 1);
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), 'Sağ Sol', '', false, 10, WorkoutTimeHelper.fromSeconds(5)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, (String(id++))));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);

        //11
        tmpGroup = WorkoutHelper.createGroup(String(id++), 'İki El Birleştirilir Aşağıya', '', 1);
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), 'Aşağı Yukarı', '', false, 10, WorkoutTimeHelper.fromSeconds(10)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, (String(id++))));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);

        //12
        tmpGroup = WorkoutHelper.createGroup(String(id++), 'Ağırlık Avuç Aşağı Geriye Çek Bırak', '', 2);
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), 'Ağırlık Avuç Aşağı Geriye Çek Bırak', '', false, 10, WorkoutTimeHelper.fromSeconds(9)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, (String(id++))));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);

        //13
        tmpGroup = WorkoutHelper.createGroup(String(id++), 'Ağırlık Avuç Yukarı Geriye Çek Bırak', '', 2);
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), 'Ağırlık Avuç Yukarı Geriye Çek Bırak', '', false, 10, WorkoutTimeHelper.fromSeconds(9)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, (String(id++))));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);

        //14
        tmpGroup = WorkoutHelper.createGroup(String(id++), 'Ağırlık Avuç Yukarı Dışa Doğru Aşağı Döndür', '', 2);
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), 'Ağırlık Avuç Yukarı Dışa Doğru Aşağı Döndür', '', false, 10, WorkoutTimeHelper.fromSeconds(9)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, (String(id++))));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);

        //15
        tmpGroup = WorkoutHelper.createGroup(String(id++), 'Ağırlık Avuç Yana Eli Geriye Çek Bırak', '', 2);
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), 'Ağırlık Avuç Yana Eli Geriye Çek Bırak', '', false, 10, WorkoutTimeHelper.fromSeconds(9)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, (String(id++))));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);

        //16
        tmpGroup = WorkoutHelper.createGroup(String(id++), 'Ağırlık Avuç Yukarı İçe Doğru Döndür', '', 2);
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), 'Ağırlık Avuç Yukarı İçe Doğru Döndür', '', false, 10, WorkoutTimeHelper.fromSeconds(9)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, (String(id++))));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);

        //17
        tmpGroup = WorkoutHelper.createGroup(String(id++), 'Topu Sık Bırak', '', 2);
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), 'Topu Sık Bırak', '', false, 10, WorkoutTimeHelper.fromSeconds(9)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, (String(id++))));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);

        // LogService.debug('workout5 ', workout);
        return workout;
    }

    private static getWorkoutFizik(workoutId: string): WorkoutData {
        let tmpName = "Fizik";
        let workout = WorkoutHelper.createWorkout(workoutId, tmpName);
        let id = 0;
        let tmpGroup;
        let tmpExercise;
        let exerciseAra = WorkoutHelper.createExerciseTimeBased(String(id++), 'Ara', '', true, 1, WorkoutTimeHelper.fromSeconds(30)); // duration: 30


        //1
        tmpGroup = WorkoutHelper.createGroup(String(id++), 'Kontrast', '', 4);
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), 'Sıcak', '', false, 1, WorkoutTimeHelper.from(3, 0)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), 'Soğuk', '', false, 1, WorkoutTimeHelper.from(1, 0)));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);

        //2
        WorkoutHelper.addComponentToWorkout(workout, WorkoutHelper.copy(exerciseAra, (String(id++))));


        //3 group pompalama
        tmpExercise = WorkoutHelper.createExerciseTimeBased(String(id++), 'Aç Kapa', '', false, 2, WorkoutTimeHelper.fromSeconds(25));
        WorkoutHelper.addComponentToWorkout(workout, tmpExercise);

        //4
        WorkoutHelper.addComponentToWorkout(workout, WorkoutHelper.copy(exerciseAra, (String(id++))));

        //5 
        tmpGroup = WorkoutHelper.createGroup(String(id++), 'Kol Düz El Yukarıda Geriye Çek', '', 2);
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), 'El Yukarı', '', false, 10, WorkoutTimeHelper.fromSeconds(13)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, (String(id++))));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);

        //6
        tmpGroup = WorkoutHelper.createGroup(String(id++), 'Kol Düz El Asağıda Geriye Çek', '', 2);
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), 'El Aşağı', '', false, 10, WorkoutTimeHelper.fromSeconds(13)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, (String(id++))));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);

        //7
        tmpGroup = WorkoutHelper.createGroup(String(id++), 'Baş Parmak Asağıya', '', 2);
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), 'Baş Parmak Aşağıya', '', false, 10, WorkoutTimeHelper.fromSeconds(13)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, (String(id++))));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);

        //8
        tmpGroup = WorkoutHelper.createGroup(String(id++), 'Kol Düz Avuç İçi yukarı', '', 2);
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), 'Çek Bırak Avuç Yukarı', '', false, 10, WorkoutTimeHelper.fromSeconds(7)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, (String(id++))));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);

        //9
        tmpGroup = WorkoutHelper.createGroup(String(id++), 'Kol Düz Avuç İçi Aşağı', '', 2);
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), 'Çek Bırak Avuç Aşağı', '', false, 10, WorkoutTimeHelper.fromSeconds(7)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, (String(id++))));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);

        //10
        tmpGroup = WorkoutHelper.createGroup(String(id++), 'El Sallama Hareketi', '', 2);
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), 'Sağ Sol', '', false, 10, WorkoutTimeHelper.fromSeconds(5)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, (String(id++))));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);

        //11
        tmpGroup = WorkoutHelper.createGroup(String(id++), 'İki El Birleştirilir Aşağıya', '', 2);
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), 'Aşağı Yukarı', '', false, 10, WorkoutTimeHelper.fromSeconds(10)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, (String(id++))));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);

        // LogService.debug('workout5 ', workout);
        return workout;
    }


    private static getWorkoutTest(workoutId: string, name?: string): WorkoutData {
        let tmpName = "Fizik";
        if (name != null) {
            tmpName = name;
        }
        let workout = WorkoutHelper.createWorkout(workoutId, tmpName);
        let id = 0;
        let tmpGroup;
        let tmpExercise;
        let exerciseAra = WorkoutHelper.createExerciseTimeBased(String(id++), 'Ara', '', true, 1, WorkoutTimeHelper.fromSeconds(10)); // duration: 30


        //1
        tmpGroup = WorkoutHelper.createGroup(String(id++), 'Kontrast', '', 2); //group 4
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), 'Sıcak', '', false, 1, WorkoutTimeHelper.from(0, 14))); // group 1 duration: 3 * OneMinInSeconds
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), 'Soğuk', '', false, 1, WorkoutTimeHelper.from(0, 17))); // duration: 1 * OneMinInSeconds
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);

        //2
        WorkoutHelper.addComponentToWorkout(workout, WorkoutHelper.copy(exerciseAra, String(id++)));


        //3 group pompalama
        tmpExercise = WorkoutHelper.createExerciseTimeBased(String(id++), 'Aç Kapa', '', false, 2, WorkoutTimeHelper.fromSeconds(13)); // group 25
        WorkoutHelper.addComponentToWorkout(workout, tmpExercise);

        //4
        WorkoutHelper.addComponentToWorkout(workout, WorkoutHelper.copy(exerciseAra, (String(id++))));

        //5 
        tmpGroup = WorkoutHelper.createGroup(String(id++), 'Kol Düz El Yukarıda Geriye Çek', '', 2);
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), 'El Yukarı', '', false, 2, WorkoutTimeHelper.fromSeconds(13))); // group 10
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, (String(id++))));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);

        //6
        tmpGroup = WorkoutHelper.createGroup(String(id++), 'Kol Düz El Asağıda Geriye Çek', '', 2);
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), 'El Aşağı', '', false, 2, WorkoutTimeHelper.fromSeconds(13))); // group 10
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, (String(id++))));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);

        //7
        tmpGroup = WorkoutHelper.createGroup(String(id++), 'Baş Parmak Asağıya', '', 2);
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), 'Baş Parmak Aşağıya', '', false, 2, WorkoutTimeHelper.fromSeconds(13))); // group 10
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, (String(id++))));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);

        //8
        tmpGroup = WorkoutHelper.createGroup(String(id++), 'Kol Düz Avuç İçi yukarı', '', 2);
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), 'Çek Bırak Avuç Yukarı', '', false, 2, WorkoutTimeHelper.fromSeconds(7))); // group 10
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, (String(id++))));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);

        //9
        tmpGroup = WorkoutHelper.createGroup(String(id++), 'Kol Düz Avuç İçi Aşağı', '', 2);
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), 'Çek Bırak Avuç Aşağı', '', false, 2, WorkoutTimeHelper.fromSeconds(7))); // group 10
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, (String(id++))));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);

        //10
        tmpGroup = WorkoutHelper.createGroup(String(id++), 'El Sallama Hareketi', '', 2);
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), 'Sağ Sol', '', false, 2, WorkoutTimeHelper.fromSeconds(5)));  // group 10
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, (String(id++))));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);

        //11
        tmpGroup = WorkoutHelper.createGroup(String(id++), 'İki El Birleştirilir Aşağıya', '', 2);
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), 'Aşağı Yukarı', '', false, 2, WorkoutTimeHelper.fromSeconds(10)));  // group 10
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, (String(id++))));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);

        // LogService.debug('workout5 ', workout);
        return workout;
    }

    private static getWorkoutTestRep(workoutId: string, name?: string): WorkoutData {
        let tmpName = "Fizik";
        if (name != null) {
            tmpName = name;
        }
        let workout = WorkoutHelper.createWorkout(workoutId, tmpName);
        let id = 0;
        let tmpGroup;
        let tmpExercise;
        let exerciseAra = WorkoutHelper.createExerciseTimeBased(String(id++), 'Ara', '', true, 1, WorkoutTimeHelper.fromSeconds(10)); // duration: 30

        WorkoutHelper.addComponentToWorkout(workout, WorkoutHelper.createExerciseRepBased(String(id++), 'Sinav', '', 1, WorkoutTimeHelper.from(0, 30), 15));

        WorkoutHelper.addComponentToWorkout(workout, WorkoutHelper.copy(exerciseAra, String(id++)));
        //1
        tmpGroup = WorkoutHelper.createGroup(String(id++), 'Kontrast', '', 2);

        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseRepBased(String(id++), 'Mekik', '', 1, WorkoutTimeHelper.from(0, 30), 50));

        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, String(id++)));

        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), 'Sıcak', '', false, 1, WorkoutTimeHelper.from(0, 14)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), 'Soğuk', '', false, 1, WorkoutTimeHelper.from(0, 17)));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);


        WorkoutHelper.addComponentToWorkout(workout, WorkoutHelper.copy(exerciseAra, String(id++)));

        tmpExercise = WorkoutHelper.createExerciseTimeBased(String(id++), 'Aç Kapa', '', false, 2, WorkoutTimeHelper.fromSeconds(13));
        WorkoutHelper.addComponentToWorkout(workout, tmpExercise);

        //4
        WorkoutHelper.addComponentToWorkout(workout, WorkoutHelper.copy(exerciseAra, (String(id++))));

        //5 
        tmpGroup = WorkoutHelper.createGroup(String(id++), 'Kol Düz El Yukarıda Geriye Çek', '', 2);
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), 'El Yukarı', '', false, 2, WorkoutTimeHelper.fromSeconds(13))); // group 10
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, (String(id++))));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);

        return workout;
    }


    private static getWorkoutBackExercise(workoutId: string, name?: string): WorkoutData {
        let tmpName = "Back Exercise 3";
        if (name != null) {
            tmpName = name;
        }
        let workout = WorkoutHelper.createWorkout(workoutId, tmpName);
        let id = 0;
        let tmpGroup;
        let tmpExercise;
        let exerciseAra = WorkoutHelper.createExerciseTimeBased(String(id++), 'Break', '', true, 1, WorkoutTimeHelper.fromSeconds(5));
        let exerciseName = '';

        WorkoutHelper.addComponentToWorkout(workout, WorkoutHelper.copy(exerciseAra, String(id++)));
        //1
        exerciseName = 'Pull Both Leg';
        tmpGroup = WorkoutHelper.createGroup(String(id++), exerciseName, '', 3);
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), exerciseName, '', false, 1, WorkoutTimeHelper.from(0, 10)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, String(id++)));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);

        exerciseName = 'Raise Left Leg';
        tmpGroup = WorkoutHelper.createGroup(String(id++), exerciseName, '', 3);
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), exerciseName, '', false, 1, WorkoutTimeHelper.from(0, 10)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, String(id++)));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);


        exerciseName = 'Raise Right Leg';
        tmpGroup = WorkoutHelper.createGroup(String(id++), exerciseName, '', 3);
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), exerciseName, '', false, 1, WorkoutTimeHelper.from(0, 10)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, String(id++)));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);


        exerciseName = 'Pull Left Leg';
        tmpGroup = WorkoutHelper.createGroup(String(id++), exerciseName, '', 3);
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), exerciseName, '', false, 1, WorkoutTimeHelper.from(0, 10)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, String(id++)));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);

        exerciseName = 'Pull Right Leg';
        tmpGroup = WorkoutHelper.createGroup(String(id++), exerciseName, '', 3);
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), exerciseName, '', false, 1, WorkoutTimeHelper.from(0, 10)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, String(id++)));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);

        exerciseName = 'Bridge';
        tmpGroup = WorkoutHelper.createGroup(String(id++), exerciseName, '', 2);
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), exerciseName, '', false, 10, WorkoutTimeHelper.from(0, 6)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, String(id++), WorkoutTimeHelper.from(0, 10)));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);

        WorkoutHelper.addComponentToWorkout(workout, WorkoutHelper.copy(exerciseAra, String(id++), WorkoutTimeHelper.from(0, 10)));

        exerciseName = 'Half Plank';
        tmpGroup = WorkoutHelper.createGroup(String(id++), exerciseName, '', 3);
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), exerciseName, '', false, 1, WorkoutTimeHelper.from(0, 10)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, String(id++)));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);

        exerciseName = 'Secde';
        tmpGroup = WorkoutHelper.createGroup(String(id++), exerciseName, '', 3);
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), exerciseName, '', false, 1, WorkoutTimeHelper.from(0, 10)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, String(id++)));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);

        exerciseName = 'Push Ups';
        WorkoutHelper.addComponentToWorkout(workout, WorkoutHelper.createExerciseRepBased(String(id++), exerciseName, '', 1, WorkoutTimeHelper.from(0, 10), 30));

        return workout;
    }

    private static getWorkoutUpperBody(workoutId: string, name?: string): WorkoutData {
        let tmpName = "Ust Vucut";
        if (name != null) {
            tmpName = name;
        }
        let workout = WorkoutHelper.createWorkout(workoutId, tmpName);
        let id = 0;
        let tmpGroup;
        let tmpExercise;
        let exerciseAra = WorkoutHelper.createExerciseTimeBased(String(id++), 'Break', '', true, 1, WorkoutTimeHelper.fromSeconds(5));
        let exerciseAraUzun = WorkoutHelper.createExerciseTimeBased(String(id++), 'Long Break', '', true, 1, WorkoutTimeHelper.from(2, 30));
        let exerciseName = '';

        // WorkoutHelper.addComponentToWorkout(workout, WorkoutHelper.copy(exerciseAra, String(id++)));
        //1
        exerciseName = 'Barfiks 4 5 5';
        tmpGroup = WorkoutHelper.createGroup(String(id++), exerciseName, '', 1);
        exerciseName = 'Barfiks';
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseRepBased(String(id++), exerciseName, '', 1, WorkoutTimeHelper.from(0, 10), 4));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, String(id++), WorkoutTimeHelper.fromSeconds(25)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseRepBased(String(id++), exerciseName, '', 1, WorkoutTimeHelper.from(0, 10), 5));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, String(id++), WorkoutTimeHelper.fromSeconds(35)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseRepBased(String(id++), exerciseName, '', 1, WorkoutTimeHelper.from(0, 10), 5));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);

        WorkoutHelper.addComponentToWorkout(workout, WorkoutHelper.copy(exerciseAraUzun, String(id++)));

        exerciseName = 'Push Up 10-13-13';
        tmpGroup = WorkoutHelper.createGroup(String(id++), exerciseName, '', 1);
        exerciseName = 'Push Up';
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseRepBased(String(id++), exerciseName, '', 1, WorkoutTimeHelper.from(0, 10), 10));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, String(id++), WorkoutTimeHelper.fromSeconds(15)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseRepBased(String(id++), exerciseName, '', 1, WorkoutTimeHelper.from(0, 10), 13));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, String(id++), WorkoutTimeHelper.fromSeconds(15)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseRepBased(String(id++), exerciseName, '', 1, WorkoutTimeHelper.from(0, 10), 13));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);

        WorkoutHelper.addComponentToWorkout(workout, WorkoutHelper.copy(exerciseAraUzun, String(id++)));

        exerciseName = 'Lift Halter 10-9-9';
        tmpGroup = WorkoutHelper.createGroup(String(id++), exerciseName, '', 1);
        exerciseName = 'Lift Halter';
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseRepBased(String(id++), exerciseName, '', 1, WorkoutTimeHelper.from(0, 10), 10));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, String(id++), WorkoutTimeHelper.from(1, 30)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseRepBased(String(id++), exerciseName, '', 1, WorkoutTimeHelper.from(0, 10), 9));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, String(id++), WorkoutTimeHelper.from(2, 0)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseRepBased(String(id++), exerciseName, '', 1, WorkoutTimeHelper.from(0, 10), 9));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);

        WorkoutHelper.addComponentToWorkout(workout, WorkoutHelper.copy(exerciseAraUzun, String(id++)));

        exerciseName = 'Band Chest 10-13-13';
        tmpGroup = WorkoutHelper.createGroup(String(id++), exerciseName, '', 1);
        exerciseName = 'Band Chest';
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseRepBased(String(id++), exerciseName, '', 1, WorkoutTimeHelper.from(0, 10), 10));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, String(id++), WorkoutTimeHelper.fromSeconds(15)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseRepBased(String(id++), exerciseName, '', 1, WorkoutTimeHelper.from(0, 10), 13));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, String(id++), WorkoutTimeHelper.fromSeconds(15)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseRepBased(String(id++), exerciseName, '', 1, WorkoutTimeHelper.from(0, 10), 13));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);

        WorkoutHelper.addComponentToWorkout(workout, WorkoutHelper.copy(exerciseAraUzun, String(id++)));

        exerciseName = 'Push Halter Chest 10-10-10';
        tmpGroup = WorkoutHelper.createGroup(String(id++), exerciseName, '', 1);
        exerciseName = 'Push Halter Chest';
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseRepBased(String(id++), exerciseName, '', 1, WorkoutTimeHelper.from(0, 10), 10));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, String(id++), WorkoutTimeHelper.from(1, 30)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseRepBased(String(id++), exerciseName, '', 1, WorkoutTimeHelper.from(0, 10), 10));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, String(id++), WorkoutTimeHelper.from(2, 0)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseRepBased(String(id++), exerciseName, '', 1, WorkoutTimeHelper.from(0, 10), 10));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);

        WorkoutHelper.addComponentToWorkout(workout, WorkoutHelper.copy(exerciseAraUzun, String(id++)));

        exerciseName = 'Dumbbell Bicep Curl 10-10-10';
        tmpGroup = WorkoutHelper.createGroup(String(id++), exerciseName, '', 1);
        exerciseName = 'Dumbbell Bicep Curl';
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseRepBased(String(id++), exerciseName, '', 1, WorkoutTimeHelper.from(0, 10), 10));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, String(id++), WorkoutTimeHelper.from(1, 30)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseRepBased(String(id++), exerciseName, '', 1, WorkoutTimeHelper.from(0, 10), 10));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, String(id++), WorkoutTimeHelper.from(2, 0)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseRepBased(String(id++), exerciseName, '', 1, WorkoutTimeHelper.from(0, 10), 10));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);
        return workout;
    }


    private static getWorkoutUpperBodyShort(workoutId: string, name?: string): WorkoutData {
        let tmpName = "Ust Vucut Kisa";
        if (name != null) {
            tmpName = name;
        }
        let workout = WorkoutHelper.createWorkout(workoutId, tmpName);
        let id = 0;
        let tmpGroup;
        let tmpExercise;
        let exerciseAra = WorkoutHelper.createExerciseTimeBased(String(id++), 'Break', '', true, 1, WorkoutTimeHelper.fromSeconds(5));
        let exerciseAraUzun = WorkoutHelper.createExerciseTimeBased(String(id++), 'Long Break', '', true, 1, WorkoutTimeHelper.from(2, 30));
        let exerciseName = '';

        // WorkoutHelper.addComponentToWorkout(workout, WorkoutHelper.copy(exerciseAra, String(id++)));
        //1
        exerciseName = 'Barfiks 3 5 4';
        tmpGroup = WorkoutHelper.createGroup(String(id++), exerciseName, '', 1);
        exerciseName = 'Barfiks';
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseRepBased(String(id++), exerciseName, '', 1, WorkoutTimeHelper.from(0, 10), 3));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, String(id++), WorkoutTimeHelper.fromSeconds(15)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseRepBased(String(id++), exerciseName, '', 1, WorkoutTimeHelper.from(0, 10), 5));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, String(id++), WorkoutTimeHelper.fromSeconds(15)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseRepBased(String(id++), exerciseName, '', 1, WorkoutTimeHelper.from(0, 10), 4));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);

        WorkoutHelper.addComponentToWorkout(workout, WorkoutHelper.copy(exerciseAraUzun, String(id++)));

        exerciseName = 'Stretch Leg Forward';
        tmpGroup = WorkoutHelper.createGroup(String(id++), exerciseName, '', 1);
        exerciseName = 'Stretch Leg Forward';
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseRepBased(String(id++), exerciseName, '', 1, WorkoutTimeHelper.from(0, 10), 3));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, String(id++), WorkoutTimeHelper.fromSeconds(15)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseRepBased(String(id++), exerciseName, '', 1, WorkoutTimeHelper.from(0, 10), 4));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, String(id++), WorkoutTimeHelper.fromSeconds(15)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseRepBased(String(id++), exerciseName, '', 1, WorkoutTimeHelper.from(0, 10), 5));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);

        WorkoutHelper.addComponentToWorkout(workout, WorkoutHelper.copy(exerciseAraUzun, String(id++)));

        exerciseName = 'Push Up 10-13-13';
        tmpGroup = WorkoutHelper.createGroup(String(id++), exerciseName, '', 1);
        exerciseName = 'Push Up';
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseRepBased(String(id++), exerciseName, '', 1, WorkoutTimeHelper.from(0, 10), 10));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, String(id++), WorkoutTimeHelper.fromSeconds(15)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseRepBased(String(id++), exerciseName, '', 1, WorkoutTimeHelper.from(0, 10), 13));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, String(id++), WorkoutTimeHelper.fromSeconds(15)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseRepBased(String(id++), exerciseName, '', 1, WorkoutTimeHelper.from(0, 10), 13));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);


        WorkoutHelper.addComponentToWorkout(workout, WorkoutHelper.copy(exerciseAraUzun, String(id++)));


        exerciseName = 'Band Chest 10-13-13';
        tmpGroup = WorkoutHelper.createGroup(String(id++), exerciseName, '', 1);
        exerciseName = 'Band Chest';
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseRepBased(String(id++), exerciseName, '', 1, WorkoutTimeHelper.from(0, 10), 10));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, String(id++), WorkoutTimeHelper.fromSeconds(15)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseRepBased(String(id++), exerciseName, '', 1, WorkoutTimeHelper.from(0, 10), 13));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, String(id++), WorkoutTimeHelper.fromSeconds(15)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseRepBased(String(id++), exerciseName, '', 1, WorkoutTimeHelper.from(0, 10), 13));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);

        return workout;
    }


    private static getWorkoutMiddleBodyOutsideShort(workoutId: string, name?: string): WorkoutData {
        let tmpName = "Orta Vucut Disari Kisa";
        if (name != null) {
            tmpName = name;
        }
        let workout = WorkoutHelper.createWorkout(workoutId, tmpName);
        let id = 0;
        let tmpGroup;
        let tmpExercise;
        let exerciseAra = WorkoutHelper.createExerciseTimeBased(String(id++), 'Break', '', true, 1, WorkoutTimeHelper.fromSeconds(5));
        let exerciseAraUzun = WorkoutHelper.createExerciseTimeBased(String(id++), 'Long Break', '', true, 1, WorkoutTimeHelper.from(2, 30));
        let exerciseName = '';



        exerciseName = 'Stretch Leg Forward';
        tmpGroup = WorkoutHelper.createGroup(String(id++), exerciseName, '', 2);
        exerciseName = 'Stretch Leg Forward';
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseRepBased(String(id++), exerciseName, '', 1, WorkoutTimeHelper.from(0, 10), 1));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, String(id++), WorkoutTimeHelper.fromSeconds(15)));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);


        exerciseName = 'Plank';
        tmpGroup = WorkoutHelper.createGroup(String(id++), exerciseName, '', 1);
        exerciseName = 'Plank';
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, String(id++), WorkoutTimeHelper.fromSeconds(5)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), exerciseName, '', false, 1, WorkoutTimeHelper.from(0, 10)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, String(id++), WorkoutTimeHelper.fromSeconds(15)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), exerciseName, '', false, 1, WorkoutTimeHelper.from(0, 20)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, String(id++), WorkoutTimeHelper.fromSeconds(15)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), exerciseName, '', false, 1, WorkoutTimeHelper.from(0, 30)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, String(id++), WorkoutTimeHelper.fromSeconds(15)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), exerciseName, '', false, 1, WorkoutTimeHelper.from(0, 40)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, String(id++), WorkoutTimeHelper.fromSeconds(15)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), exerciseName, '', false, 1, WorkoutTimeHelper.from(0, 50)));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);

        WorkoutHelper.addComponentToWorkout(workout, WorkoutHelper.copy(exerciseAraUzun, String(id++)));

        exerciseName = 'Plank Right';
        tmpGroup = WorkoutHelper.createGroup(String(id++), exerciseName, '', 1);
        exerciseName = 'Plank Right';
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, String(id++), WorkoutTimeHelper.fromSeconds(5)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), exerciseName, '', false, 1, WorkoutTimeHelper.from(0, 5)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, String(id++), WorkoutTimeHelper.fromSeconds(15)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), exerciseName, '', false, 1, WorkoutTimeHelper.from(0, 8)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, String(id++), WorkoutTimeHelper.fromSeconds(15)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), exerciseName, '', false, 1, WorkoutTimeHelper.from(0, 10)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, String(id++), WorkoutTimeHelper.fromSeconds(15)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), exerciseName, '', false, 1, WorkoutTimeHelper.from(0, 20)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, String(id++), WorkoutTimeHelper.fromSeconds(15)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), exerciseName, '', false, 1, WorkoutTimeHelper.from(0, 30)));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);

        WorkoutHelper.addComponentToWorkout(workout, WorkoutHelper.copy(exerciseAraUzun, String(id++)));

        exerciseName = 'Plank Left';
        tmpGroup = WorkoutHelper.createGroup(String(id++), exerciseName, '', 1);
        exerciseName = 'Plank Left';
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, String(id++), WorkoutTimeHelper.fromSeconds(5)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), exerciseName, '', false, 1, WorkoutTimeHelper.from(0, 5)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, String(id++), WorkoutTimeHelper.fromSeconds(15)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), exerciseName, '', false, 1, WorkoutTimeHelper.from(0, 8)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, String(id++), WorkoutTimeHelper.fromSeconds(15)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), exerciseName, '', false, 1, WorkoutTimeHelper.from(0, 10)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, String(id++), WorkoutTimeHelper.fromSeconds(15)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), exerciseName, '', false, 1, WorkoutTimeHelper.from(0, 20)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, String(id++), WorkoutTimeHelper.fromSeconds(15)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseTimeBased(String(id++), exerciseName, '', false, 1, WorkoutTimeHelper.from(0, 30)));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);

        return workout;
    }

    private static getWorkoutStretch(workoutId: string, name?: string): WorkoutData {
        let tmpName = "Isinma";
        if (name != null) {
            tmpName = name;
        }
        let workout = WorkoutHelper.createWorkout(workoutId, tmpName);
        let id = 0;
        let exerciseAra = WorkoutHelper.createExerciseTimeBased(String(id++), 'Break', '', true, 1, WorkoutTimeHelper.fromSeconds(5));
        let exerciseAraOrta = WorkoutHelper.createExerciseTimeBased(String(id++), 'Break', '', true, 1, WorkoutTimeHelper.from(0, 10));
        let exerciseName = '';

        WorkoutHelper.addComponentToWorkout(workout, exerciseAra);

        exerciseName = 'Head Turn Right And Left';
        WorkoutHelper.addComponentToWorkout(workout, WorkoutHelper.createExerciseTimeBased(String(id++), exerciseName, '', false, 1, WorkoutTimeHelper.from(0, 20)));

        exerciseName = 'Head Stretch Forward And Back';
        WorkoutHelper.addComponentToWorkout(workout, WorkoutHelper.createExerciseTimeBased(String(id++), exerciseName, '', false, 1, WorkoutTimeHelper.from(0, 20)));

        exerciseName = 'Head Push From Right';
        WorkoutHelper.addComponentToWorkout(workout, WorkoutHelper.createExerciseTimeBased(String(id++), exerciseName, '', false, 1, WorkoutTimeHelper.from(0, 20)));

        exerciseName = 'Head Push From Left';
        WorkoutHelper.addComponentToWorkout(workout, WorkoutHelper.createExerciseTimeBased(String(id++), exerciseName, '', false, 1, WorkoutTimeHelper.from(0, 20)));

        exerciseName = 'Head Push From Front';
        WorkoutHelper.addComponentToWorkout(workout, WorkoutHelper.createExerciseTimeBased(String(id++), exerciseName, '', false, 1, WorkoutTimeHelper.from(0, 20)));

        exerciseName = 'Head Push From Back';
        WorkoutHelper.addComponentToWorkout(workout, WorkoutHelper.createExerciseTimeBased(String(id++), exerciseName, '', false, 1, WorkoutTimeHelper.from(0, 20)));

        exerciseName = 'Head Stretch Right And Left';
        WorkoutHelper.addComponentToWorkout(workout, WorkoutHelper.createExerciseTimeBased(String(id++), exerciseName, '', false, 1, WorkoutTimeHelper.from(0, 20)));

        exerciseName = 'Head Stretch Front And Back';
        WorkoutHelper.addComponentToWorkout(workout, WorkoutHelper.createExerciseTimeBased(String(id++), exerciseName, '', false, 1, WorkoutTimeHelper.from(0, 20)));

        WorkoutHelper.addComponentToWorkout(workout, WorkoutHelper.copy(exerciseAra, String(id++)));

        exerciseName = 'Wrist Circles Both Directions';
        WorkoutHelper.addComponentToWorkout(workout, WorkoutHelper.createExerciseTimeBased(String(id++), exerciseName, '', false, 1, WorkoutTimeHelper.from(0, 20)));

        WorkoutHelper.addComponentToWorkout(workout, WorkoutHelper.copy(exerciseAraOrta, String(id++)));

        exerciseName = 'Horizontal Arm Swings';
        WorkoutHelper.addComponentToWorkout(workout, WorkoutHelper.createExerciseTimeBased(String(id++), exerciseName, '', false, 1, WorkoutTimeHelper.from(0, 20)));

        WorkoutHelper.addComponentToWorkout(workout, WorkoutHelper.copy(exerciseAraOrta, String(id++)));

        exerciseName = 'Contralateral Vertical Arm Swings';
        WorkoutHelper.addComponentToWorkout(workout, WorkoutHelper.createExerciseTimeBased(String(id++), exerciseName, '', false, 1, WorkoutTimeHelper.from(0, 20)));

        WorkoutHelper.addComponentToWorkout(workout, WorkoutHelper.copy(exerciseAraOrta, String(id++)));

        exerciseName = 'Oval Arm Swings';
        WorkoutHelper.addComponentToWorkout(workout, WorkoutHelper.createExerciseTimeBased(String(id++), exerciseName, '', false, 1, WorkoutTimeHelper.from(0, 20)));

        WorkoutHelper.addComponentToWorkout(workout, WorkoutHelper.copy(exerciseAraOrta, String(id++)));

        exerciseName = 'Trunk Rotations';
        WorkoutHelper.addComponentToWorkout(workout, WorkoutHelper.createExerciseTimeBased(String(id++), exerciseName, '', false, 1, WorkoutTimeHelper.from(0, 20)));

        WorkoutHelper.addComponentToWorkout(workout, WorkoutHelper.copy(exerciseAraOrta, String(id++)));

        exerciseName = 'Band Dislocations Front And Back';
        WorkoutHelper.addComponentToWorkout(workout, WorkoutHelper.createExerciseTimeBased(String(id++), exerciseName, '', false, 1, WorkoutTimeHelper.from(0, 20)));

        WorkoutHelper.addComponentToWorkout(workout, WorkoutHelper.copy(exerciseAraOrta, String(id++)));

        exerciseName = 'Band Pull-Aparts';
        WorkoutHelper.addComponentToWorkout(workout, WorkoutHelper.createExerciseTimeBased(String(id++), exerciseName, '', false, 1, WorkoutTimeHelper.from(0, 20)));

        return workout;
    }

    private static getWorkoutMeditation(workoutId: string, name?: string): WorkoutData {
        let tmpName = "Meditation";
        if (name != null) {
            tmpName = name;
        }
        let workout = WorkoutHelper.createWorkout(workoutId, tmpName);
        let id = 0;

        let exerciseAraOrta = WorkoutHelper.createExerciseTimeBased(String(id++), 'Meditate', '', false, 1, WorkoutTimeHelper.from(11, 0));

        WorkoutHelper.addComponentToWorkout(workout, exerciseAraOrta);

        return workout;
    }

    private static getWorkoutLongBreak(workoutId: string, name?: string): WorkoutData {
        let tmpName = "Long Break";
        if (name != null) {
            tmpName = name;
        }
        let workout = WorkoutHelper.createWorkout(workoutId, tmpName);
        let id = 0;

        let exerciseAraOrta = WorkoutHelper.createExerciseTimeBased(String(id++), 'Long Break', '', true, 1, WorkoutTimeHelper.from(2, 30));

        WorkoutHelper.addComponentToWorkout(workout, exerciseAraOrta);

        return workout;
    }

    private static getWorkoutExample(workoutId: string, name?: string): WorkoutData {
        let tmpName = "Workout Example";
        if (name != null) {
            tmpName = name;
        }
        let workout = WorkoutHelper.createWorkout(workoutId, tmpName);
        let id = 0;
        let tmpGroup;
        let exerciseAra = WorkoutHelper.createExerciseTimeBased(String(id++), 'Break in Group Exercise', '', true, 1, WorkoutTimeHelper.fromSeconds(5));
        let exerciseName = '';

        // WorkoutHelper.addComponentToWorkout(workout, WorkoutHelper.copy(exerciseAra, String(id++)));
        //1
        exerciseName = 'Get Ready';
        WorkoutHelper.addComponentToWorkout(workout, WorkoutHelper.createExerciseTimeBased(String(id++), exerciseName, '', true, 1, WorkoutTimeHelper.fromSeconds(5)));

        exerciseName = 'Time Based Exercise Like Plank';
        WorkoutHelper.addComponentToWorkout(workout, WorkoutHelper.createExerciseTimeBased(String(id++), exerciseName, '', false, 1, WorkoutTimeHelper.fromSeconds(15)));

        exerciseName = 'Repetition Based Exercise Like Pull Up, Click OK after done';
        WorkoutHelper.addComponentToWorkout(workout, WorkoutHelper.createExerciseRepBased(String(id++), exerciseName, '', 1, WorkoutTimeHelper.fromSeconds(30), 5));

        exerciseName = 'Group Exercises Push Up 10-13-13';
        tmpGroup = WorkoutHelper.createGroup(String(id++), exerciseName, '', 1);
        exerciseName = 'Push Up in Group Exercise';
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseRepBased(String(id++), exerciseName, '', 1, WorkoutTimeHelper.from(0, 10), 10));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, String(id++), WorkoutTimeHelper.fromSeconds(15)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseRepBased(String(id++), exerciseName, '', 1, WorkoutTimeHelper.from(0, 10), 10));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.copy(exerciseAra, String(id++), WorkoutTimeHelper.fromSeconds(15)));
        WorkoutHelper.addComponentToGroup(tmpGroup, WorkoutHelper.createExerciseRepBased(String(id++), exerciseName, '', 1, WorkoutTimeHelper.from(0, 10), 10));
        WorkoutHelper.addComponentToWorkout(workout, tmpGroup);

        return workout;
    }
}