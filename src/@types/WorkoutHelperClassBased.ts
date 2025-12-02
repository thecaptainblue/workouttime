
import { Workout } from './Workout';
import { ExerciseTimeBased } from './ExerciseTimeBased';
import { ExerciseGroup } from './ExerciseGroup';
import { ExerciseRepBased } from './ExerciseRepBased';
import { WorkoutTime } from './WorkoutTime';

export class WorkoutHelperClassBased {

    private static getInitialWorkouts(): Workout[] {
        let result: Workout[] = [];
        let id = 0;
        result.push(WorkoutHelperClassBased.getWorkoutFizikKuvvet(String(id++)));
        result.push(WorkoutHelperClassBased.getWorkoutFizik(String(id++)));
        result.push(WorkoutHelperClassBased.getWorkoutBackExercise(String(id++)));
        result.push(WorkoutHelperClassBased.getWorkoutTest(String(id++), "Fiziko"));
        result.push(WorkoutHelperClassBased.getWorkoutTestRep(String(id++), "Rep"));
        return result;
    }

    private static getWorkoutFizikKuvvet(workoutId: string): Workout {
        let tmpName = "Fizik Kuvvet";
        let workout = new Workout(workoutId, tmpName);
        let id = 0;
        let tmpGroup;
        let tmpExercise;
        let exerciseAra = new ExerciseTimeBased(String(id++), 'Ara', '', true, 1, WorkoutTime.fromSeconds(30)); // duration: 30

        //1
        tmpGroup = new ExerciseGroup(String(id++), 'Kontrast', '', 4);
        tmpGroup.addExercise(new ExerciseTimeBased(String(id++), 'Sıcak', '', false, 1, WorkoutTime.from(3, 0)));
        tmpGroup.addExercise(new ExerciseTimeBased(String(id++), 'Soğuk', '', false, 1, WorkoutTime.from(1, 0)));
        workout.addWorkoutComponent(tmpGroup);

        //2
        workout.addWorkoutComponent(exerciseAra.copy(String(id++)))

        //3 group pompalama
        tmpExercise = new ExerciseTimeBased(String(id++), 'Aç Kapa', '', false, 15, WorkoutTime.fromSeconds(13));
        workout.addWorkoutComponent(tmpExercise);

        //4
        workout.addWorkoutComponent(exerciseAra.copy(String(id++)));

        //5
        tmpGroup = new ExerciseGroup(String(id++), 'Kol Düz El Yukarıda Geriye Çek', '', 1);
        tmpGroup.addExercise(new ExerciseTimeBased(String(id++), 'El Yukarı', '', false, 10, WorkoutTime.fromSeconds(13)));
        tmpGroup.addExercise(exerciseAra.copy(String(id++)));
        workout.addWorkoutComponent(tmpGroup);

        //6
        tmpGroup = new ExerciseGroup(String(id++), 'Kol Düz El Asağıda Geriye Çek', '', 1);
        tmpGroup.addExercise(new ExerciseTimeBased(String(id++), 'El Aşağı', '', false, 10, WorkoutTime.fromSeconds(13)));
        tmpGroup.addExercise(exerciseAra.copy(String(id++)));
        workout.addWorkoutComponent(tmpGroup);

        //7
        tmpGroup = new ExerciseGroup(String(id++), 'Baş Parmak Masaya', '', 1);
        tmpGroup.addExercise(new ExerciseTimeBased(String(id++), 'Baş Parmak Masaya', '', false, 10, WorkoutTime.fromSeconds(13)));
        tmpGroup.addExercise(exerciseAra.copy(String(id++)));
        workout.addWorkoutComponent(tmpGroup);

        //8
        tmpGroup = new ExerciseGroup(String(id++), 'Kol Düz Avuç İçi yukarı', '', 1);
        tmpGroup.addExercise(new ExerciseTimeBased(String(id++), 'Çek Bırak Avuç Yukarı', '', false, 10, WorkoutTime.fromSeconds(7)));
        tmpGroup.addExercise(exerciseAra.copy(String(id++)));
        workout.addWorkoutComponent(tmpGroup);

        //9
        tmpGroup = new ExerciseGroup(String(id++), 'Kol Düz Avuç İçi Aşağı', '', 1);
        tmpGroup.addExercise(new ExerciseTimeBased(String(id++), 'Çek Bırak Avuç Aşağı', '', false, 10, WorkoutTime.fromSeconds(7)));
        tmpGroup.addExercise(exerciseAra.copy(String(id++)));
        workout.addWorkoutComponent(tmpGroup);

        //10
        tmpGroup = new ExerciseGroup(String(id++), 'El Sallama Hareketi', '', 1);
        tmpGroup.addExercise(new ExerciseTimeBased(String(id++), 'Sağ Sol', '', false, 10, WorkoutTime.fromSeconds(5)));
        tmpGroup.addExercise(exerciseAra.copy(String(id++)));
        workout.addWorkoutComponent(tmpGroup);

        //11
        tmpGroup = new ExerciseGroup(String(id++), 'İki El Birleştirilir Aşağıya', '', 1);
        tmpGroup.addExercise(new ExerciseTimeBased(String(id++), 'Aşağı Yukarı', '', false, 10, WorkoutTime.fromSeconds(10)));
        tmpGroup.addExercise(exerciseAra.copy(String(id++)));
        workout.addWorkoutComponent(tmpGroup);

        //12
        tmpGroup = new ExerciseGroup(String(id++), 'Ağırlık Avuç Aşağı Geriye Çek Bırak', '', 2);
        tmpGroup.addExercise(new ExerciseTimeBased(String(id++), 'Ağırlık Avuç Aşağı Geriye Çek Bırak', '', false, 10, WorkoutTime.fromSeconds(9)));
        tmpGroup.addExercise(exerciseAra.copy(String(id++)));
        workout.addWorkoutComponent(tmpGroup);

        //13
        tmpGroup = new ExerciseGroup(String(id++), 'Ağırlık Avuç Yukarı Geriye Çek Bırak', '', 2);
        tmpGroup.addExercise(new ExerciseTimeBased(String(id++), 'Ağırlık Avuç Yukarı Geriye Çek Bırak', '', false, 10, WorkoutTime.fromSeconds(9)));
        tmpGroup.addExercise(exerciseAra.copy(String(id++)));
        workout.addWorkoutComponent(tmpGroup);

        //14
        tmpGroup = new ExerciseGroup(String(id++), 'Ağırlık Avuç Yukarı Dışa Doğru Aşağı Döndür', '', 2);
        tmpGroup.addExercise(new ExerciseTimeBased(String(id++), 'Ağırlık Avuç Yukarı Dışa Doğru Aşağı Döndür', '', false, 10, WorkoutTime.fromSeconds(9)));
        tmpGroup.addExercise(exerciseAra.copy(String(id++)));
        workout.addWorkoutComponent(tmpGroup);

        //15
        tmpGroup = new ExerciseGroup(String(id++), 'Ağırlık Avuç Yana Eli Geriye Çek Bırak', '', 2);
        tmpGroup.addExercise(new ExerciseTimeBased(String(id++), 'Ağırlık Avuç Yana Eli Geriye Çek Bırak', '', false, 10, WorkoutTime.fromSeconds(9)));
        tmpGroup.addExercise(exerciseAra.copy(String(id++)));
        workout.addWorkoutComponent(tmpGroup);

        //16
        tmpGroup = new ExerciseGroup(String(id++), 'Ağırlık Avuç Yukarı İçe Doğru Döndür', '', 2);
        tmpGroup.addExercise(new ExerciseTimeBased(String(id++), 'Ağırlık Avuç Yukarı İçe Doğru Döndür', '', false, 10, WorkoutTime.fromSeconds(9)));
        tmpGroup.addExercise(exerciseAra.copy(String(id++)));
        workout.addWorkoutComponent(tmpGroup);

        //17
        tmpGroup = new ExerciseGroup(String(id++), 'Topu Sık Bırak', '', 2);
        tmpGroup.addExercise(new ExerciseTimeBased(String(id++), 'Topu Sık Bırak', '', false, 10, WorkoutTime.fromSeconds(9)));
        tmpGroup.addExercise(exerciseAra.copy(String(id++)));
        workout.addWorkoutComponent(tmpGroup);

        // LogService.debug('workout5 ', workout);
        return workout;
    }

    private static getWorkoutFizik(workoutId: string): Workout {
        let tmpName = "Fizik";
        let workout = new Workout(workoutId, tmpName);
        let id = 0;
        let tmpGroup;
        let tmpExercise;
        let exerciseAra = new ExerciseTimeBased(String(id++), 'Ara', '', true, 1, WorkoutTime.fromSeconds(30)); // duration: 30


        //1
        tmpGroup = new ExerciseGroup(String(id++), 'Kontrast', '', 4);
        tmpGroup.addExercise(new ExerciseTimeBased(String(id++), 'Sıcak', '', false, 1, WorkoutTime.from(3, 0)));
        tmpGroup.addExercise(new ExerciseTimeBased(String(id++), 'Soğuk', '', false, 1, WorkoutTime.from(1, 0)));
        workout.addWorkoutComponent(tmpGroup);

        //2
        workout.addWorkoutComponent(exerciseAra.copy(String(id++)))


        //3 group pompalama
        tmpExercise = new ExerciseTimeBased(String(id++), 'Aç Kapa', '', false, 2, WorkoutTime.fromSeconds(25));
        workout.addWorkoutComponent(tmpExercise);

        //4
        workout.addWorkoutComponent(exerciseAra.copy(String(id++)));

        //5
        tmpGroup = new ExerciseGroup(String(id++), 'Kol Düz El Yukarıda Geriye Çek', '', 2);
        tmpGroup.addExercise(new ExerciseTimeBased(String(id++), 'El Yukarı', '', false, 10, WorkoutTime.fromSeconds(13)));
        tmpGroup.addExercise(exerciseAra.copy(String(id++)));
        workout.addWorkoutComponent(tmpGroup);

        //6
        tmpGroup = new ExerciseGroup(String(id++), 'Kol Düz El Asağıda Geriye Çek', '', 2);
        tmpGroup.addExercise(new ExerciseTimeBased(String(id++), 'El Aşağı', '', false, 10, WorkoutTime.fromSeconds(13)));
        tmpGroup.addExercise(exerciseAra.copy(String(id++)));
        workout.addWorkoutComponent(tmpGroup);

        //7
        tmpGroup = new ExerciseGroup(String(id++), 'Baş Parmak Asağıya', '', 2);
        tmpGroup.addExercise(new ExerciseTimeBased(String(id++), 'Baş Parmak Aşağıya', '', false, 10, WorkoutTime.fromSeconds(13)));
        tmpGroup.addExercise(exerciseAra.copy(String(id++)));
        workout.addWorkoutComponent(tmpGroup);

        //8
        tmpGroup = new ExerciseGroup(String(id++), 'Kol Düz Avuç İçi yukarı', '', 2);
        tmpGroup.addExercise(new ExerciseTimeBased(String(id++), 'Çek Bırak Avuç Yukarı', '', false, 10, WorkoutTime.fromSeconds(7)));
        tmpGroup.addExercise(exerciseAra.copy(String(id++)));
        workout.addWorkoutComponent(tmpGroup);

        //9
        tmpGroup = new ExerciseGroup(String(id++), 'Kol Düz Avuç İçi Aşağı', '', 2);
        tmpGroup.addExercise(new ExerciseTimeBased(String(id++), 'Çek Bırak Avuç Aşağı', '', false, 10, WorkoutTime.fromSeconds(7)));
        tmpGroup.addExercise(exerciseAra.copy(String(id++)));
        workout.addWorkoutComponent(tmpGroup);

        //10
        tmpGroup = new ExerciseGroup(String(id++), 'El Sallama Hareketi', '', 2);
        tmpGroup.addExercise(new ExerciseTimeBased(String(id++), 'Sağ Sol', '', false, 10, WorkoutTime.fromSeconds(5)));
        tmpGroup.addExercise(exerciseAra.copy(String(id++)));
        workout.addWorkoutComponent(tmpGroup);

        //11
        tmpGroup = new ExerciseGroup(String(id++), 'İki El Birleştirilir Aşağıya', '', 2);
        tmpGroup.addExercise(new ExerciseTimeBased(String(id++), 'Aşağı Yukarı', '', false, 10, WorkoutTime.fromSeconds(10)));
        tmpGroup.addExercise(exerciseAra.copy(String(id++)));
        workout.addWorkoutComponent(tmpGroup);

        // LogService.debug('workout5 ', workout);
        return workout;
    }


    private static getWorkoutTest(workoutId: string, name?: string): Workout {
        let tmpName = "Fizik";
        if (name != null) {
            tmpName = name;
        }
        let workout = new Workout(workoutId, tmpName);
        let id = 0;
        let tmpGroup;
        let tmpExercise;
        let exerciseAra = new ExerciseTimeBased(String(id++), 'Ara', '', true, 1, WorkoutTime.fromSeconds(10)); // duration: 30


        //1
        tmpGroup = new ExerciseGroup(String(id++), 'Kontrast', '', 2); //group 4
        tmpGroup.addExercise(new ExerciseTimeBased(String(id++), 'Sıcak', '', false, 1, WorkoutTime.from(0, 14))); // group 1 duration: 3 * OneMinInSeconds
        tmpGroup.addExercise(new ExerciseTimeBased(String(id++), 'Soğuk', '', false, 1, WorkoutTime.from(0, 17))); // duration: 1 * OneMinInSeconds
        workout.addWorkoutComponent(tmpGroup);

        //2
        workout.addWorkoutComponent(exerciseAra.copy(String(id++)))


        //3 group pompalama
        tmpExercise = new ExerciseTimeBased(String(id++), 'Aç Kapa', '', false, 2, WorkoutTime.fromSeconds(13)); // group 25
        workout.addWorkoutComponent(tmpExercise);

        //4
        workout.addWorkoutComponent(exerciseAra.copy(String(id++)));

        //5
        tmpGroup = new ExerciseGroup(String(id++), 'Kol Düz El Yukarıda Geriye Çek', '', 2);
        tmpGroup.addExercise(new ExerciseTimeBased(String(id++), 'El Yukarı', '', false, 2, WorkoutTime.fromSeconds(13))); // group 10
        tmpGroup.addExercise(exerciseAra.copy(String(id++)));
        workout.addWorkoutComponent(tmpGroup);

        //6
        tmpGroup = new ExerciseGroup(String(id++), 'Kol Düz El Asağıda Geriye Çek', '', 2);
        tmpGroup.addExercise(new ExerciseTimeBased(String(id++), 'El Aşağı', '', false, 2, WorkoutTime.fromSeconds(13))); // group 10
        tmpGroup.addExercise(exerciseAra.copy(String(id++)));
        workout.addWorkoutComponent(tmpGroup);

        //7
        tmpGroup = new ExerciseGroup(String(id++), 'Baş Parmak Asağıya', '', 2);
        tmpGroup.addExercise(new ExerciseTimeBased(String(id++), 'Baş Parmak Aşağıya', '', false, 2, WorkoutTime.fromSeconds(13))); // group 10
        tmpGroup.addExercise(exerciseAra.copy(String(id++)));
        workout.addWorkoutComponent(tmpGroup);

        //8
        tmpGroup = new ExerciseGroup(String(id++), 'Kol Düz Avuç İçi yukarı', '', 2);
        tmpGroup.addExercise(new ExerciseTimeBased(String(id++), 'Çek Bırak Avuç Yukarı', '', false, 2, WorkoutTime.fromSeconds(7))); // group 10
        tmpGroup.addExercise(exerciseAra.copy(String(id++)));
        workout.addWorkoutComponent(tmpGroup);

        //9
        tmpGroup = new ExerciseGroup(String(id++), 'Kol Düz Avuç İçi Aşağı', '', 2);
        tmpGroup.addExercise(new ExerciseTimeBased(String(id++), 'Çek Bırak Avuç Aşağı', '', false, 2, WorkoutTime.fromSeconds(7))); // group 10
        tmpGroup.addExercise(exerciseAra.copy(String(id++)));
        workout.addWorkoutComponent(tmpGroup);

        //10
        tmpGroup = new ExerciseGroup(String(id++), 'El Sallama Hareketi', '', 2);
        tmpGroup.addExercise(new ExerciseTimeBased(String(id++), 'Sağ Sol', '', false, 2, WorkoutTime.fromSeconds(5)));  // group 10
        tmpGroup.addExercise(exerciseAra.copy(String(id++)));
        workout.addWorkoutComponent(tmpGroup);

        //11
        tmpGroup = new ExerciseGroup(String(id++), 'İki El Birleştirilir Aşağıya', '', 2);
        tmpGroup.addExercise(new ExerciseTimeBased(String(id++), 'Aşağı Yukarı', '', false, 2, WorkoutTime.fromSeconds(10)));  // group 10
        tmpGroup.addExercise(exerciseAra.copy(String(id++)));
        workout.addWorkoutComponent(tmpGroup);

        // LogService.debug('workout5 ', workout);
        return workout;
    }

    private static getWorkoutTestRep(workoutId: string, name?: string): Workout {
        let tmpName = "Fizik";
        if (name != null) {
            tmpName = name;
        }
        let workout = new Workout(workoutId, tmpName);
        let id = 0;
        let tmpGroup;
        let tmpExercise;
        let exerciseAra = new ExerciseTimeBased(String(id++), 'Ara', '', true, 1, WorkoutTime.fromSeconds(10)); // duration: 30

        workout.addWorkoutComponent(new ExerciseRepBased(String(id++), 'Sinav', '', 1, WorkoutTime.from(0, 30), 15));

        workout.addWorkoutComponent(exerciseAra.copy(String(id++)))
        //1
        tmpGroup = new ExerciseGroup(String(id++), 'Kontrast', '', 2);

        tmpGroup.addExercise(new ExerciseRepBased(String(id++), 'Mekik', '', 1, WorkoutTime.from(0, 30), 50));

        tmpGroup.addExercise(exerciseAra.copy(String(id++)))

        tmpGroup.addExercise(new ExerciseTimeBased(String(id++), 'Sıcak', '', false, 1, WorkoutTime.from(0, 14)));
        tmpGroup.addExercise(new ExerciseTimeBased(String(id++), 'Soğuk', '', false, 1, WorkoutTime.from(0, 17)));
        workout.addWorkoutComponent(tmpGroup);


        workout.addWorkoutComponent(exerciseAra.copy(String(id++)))

        tmpExercise = new ExerciseTimeBased(String(id++), 'Aç Kapa', '', false, 2, WorkoutTime.fromSeconds(13));
        workout.addWorkoutComponent(tmpExercise);

        //4
        workout.addWorkoutComponent(exerciseAra.copy(String(id++)));

        //5
        tmpGroup = new ExerciseGroup(String(id++), 'Kol Düz El Yukarıda Geriye Çek', '', 2);
        tmpGroup.addExercise(new ExerciseTimeBased(String(id++), 'El Yukarı', '', false, 2, WorkoutTime.fromSeconds(13))); // group 10
        tmpGroup.addExercise(exerciseAra.copy(String(id++)));
        workout.addWorkoutComponent(tmpGroup);

        return workout;
    }


    private static getWorkoutBackExercise(workoutId: string, name?: string): Workout {
        let tmpName = "Back Exercise 3";
        if (name != null) {
            tmpName = name;
        }
        let workout = new Workout(workoutId, tmpName);
        let id = 0;
        let tmpGroup;
        let tmpExercise;
        let exerciseAra = new ExerciseTimeBased(String(id++), 'Break', '', true, 1, WorkoutTime.fromSeconds(5));
        let exerciseName = '';

        workout.addWorkoutComponent(exerciseAra.copy(String(id++)))
        //1
        exerciseName = 'Pull Both Leg';
        tmpGroup = new ExerciseGroup(String(id++), exerciseName, '', 3);
        tmpGroup.addExercise(new ExerciseTimeBased(String(id++), exerciseName, '', false, 1, WorkoutTime.from(0, 10)));
        tmpGroup.addExercise(exerciseAra.copy(String(id++)))
        workout.addWorkoutComponent(tmpGroup);

        exerciseName = 'Raise Left Leg';
        tmpGroup = new ExerciseGroup(String(id++), exerciseName, '', 3);
        tmpGroup.addExercise(new ExerciseTimeBased(String(id++), exerciseName, '', false, 1, WorkoutTime.from(0, 10)));
        tmpGroup.addExercise(exerciseAra.copy(String(id++)))
        workout.addWorkoutComponent(tmpGroup);


        exerciseName = 'Raise Right Leg';
        tmpGroup = new ExerciseGroup(String(id++), exerciseName, '', 3);
        tmpGroup.addExercise(new ExerciseTimeBased(String(id++), exerciseName, '', false, 1, WorkoutTime.from(0, 10)));
        tmpGroup.addExercise(exerciseAra.copy(String(id++)))
        workout.addWorkoutComponent(tmpGroup);


        exerciseName = 'Pull Left Leg';
        tmpGroup = new ExerciseGroup(String(id++), exerciseName, '', 3);
        tmpGroup.addExercise(new ExerciseTimeBased(String(id++), exerciseName, '', false, 1, WorkoutTime.from(0, 10)));
        tmpGroup.addExercise(exerciseAra.copy(String(id++)))
        workout.addWorkoutComponent(tmpGroup);

        exerciseName = 'Pull Right Leg';
        tmpGroup = new ExerciseGroup(String(id++), exerciseName, '', 3);
        tmpGroup.addExercise(new ExerciseTimeBased(String(id++), exerciseName, '', false, 1, WorkoutTime.from(0, 10)));
        tmpGroup.addExercise(exerciseAra.copy(String(id++)))
        workout.addWorkoutComponent(tmpGroup);

        exerciseName = 'Bridge';
        tmpGroup = new ExerciseGroup(String(id++), exerciseName, '', 2);
        tmpGroup.addExercise(new ExerciseTimeBased(String(id++), exerciseName, '', false, 10, WorkoutTime.from(0, 6)));
        tmpGroup.addExercise(exerciseAra.copy(String(id++), WorkoutTime.from(0, 10)))
        workout.addWorkoutComponent(tmpGroup);

        workout.addWorkoutComponent(exerciseAra.copy(String(id++), WorkoutTime.from(0, 10)))

        exerciseName = 'Half Plank';
        tmpGroup = new ExerciseGroup(String(id++), exerciseName, '', 3);
        tmpGroup.addExercise(new ExerciseTimeBased(String(id++), exerciseName, '', false, 1, WorkoutTime.from(0, 10)));
        tmpGroup.addExercise(exerciseAra.copy(String(id++)))
        workout.addWorkoutComponent(tmpGroup);

        exerciseName = 'Secde';
        tmpGroup = new ExerciseGroup(String(id++), exerciseName, '', 3);
        tmpGroup.addExercise(new ExerciseTimeBased(String(id++), exerciseName, '', false, 1, WorkoutTime.from(0, 10)));
        tmpGroup.addExercise(exerciseAra.copy(String(id++)))
        workout.addWorkoutComponent(tmpGroup);

        exerciseName = 'Push Ups';
        workout.addWorkoutComponent(new ExerciseRepBased(String(id++), exerciseName, '', 1, WorkoutTime.from(0, 10), 30));

        return workout;
    }
}