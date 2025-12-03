import { configureStore } from '@reduxjs/toolkit';
import soundReducer from './features/SoundSlice';
import workoutsSliceReducer, { StateWorkoutKey } from './features/workoutsSlice';
import workoutSingleSliceReducer from './features/workoutSingleSlice';
import groupsSliceReducer from './features/groupsSlice';
import profilingSliceReducer from './features/profilingSlice';
import dialogSliceReducer from './features/dialogSlice';



export const store = configureStore({
    reducer: {
        sound: soundReducer,
        workouts: workoutsSliceReducer,
        workoutSingle: workoutSingleSliceReducer,
        groups: groupsSliceReducer,
        profiling: profilingSliceReducer,
        dialog: dialogSliceReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            // warnAfter: 45,
            //todo: acilista verinin cekilmesi uzun surdugu icin. optimizasyon yapilacak
            ignoredPaths: [StateWorkoutKey + '.value'],
            ignoredActions: [StateWorkoutKey + '/SetWorkouts']
        },
    })
});