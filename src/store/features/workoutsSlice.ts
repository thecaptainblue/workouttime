import { createSlice } from '@reduxjs/toolkit';
import { WorkoutData } from '../../@types/Data/WorkoutData';

export const StateWorkoutKey: string = 'workouts';

type WorkoutState = {
  value: WorkoutData[];
};

export type PayloadAddWorkout = {
  workout: WorkoutData,
  index?: number,
}

export type PayloadAddWorkouts = {
  workouts: WorkoutData[],
  index?: number,
}

export type PayloadUpdateWorkout = {
  workout: WorkoutData,
}

const initialState: WorkoutState = {
  value: [],
};

export const workoutsSlice = createSlice({
  name: StateWorkoutKey,
  initialState,
  reducers: {
    SetWorkouts: (state, action) => {
      const workouts = action.payload as WorkoutData[];

      state.value = [...workouts];
      // state.value?.forEach(item => LogService.infoFormat('SetWorkouts notification:{0}', item.notifications.length));
    },
    AddWorkout: (state, action) => {
      const payload = action.payload as PayloadAddWorkout;
      const { workout, index } = payload;
      // console.log('AddWorkout: index:%s , workout:%s', index, workout);
      if (index != null && index >= 0 && index < state.value.length) {
        state.value.splice(index, 0, workout);
      } else {
        state.value.push(workout);
      }
    },
    AddWorkouts: (state, action) => {
      const payload = action.payload as PayloadAddWorkouts;
      const { workouts, index } = payload;
      // console.log('AddWorkout: index:%s , workout:%s', index, workout);
      if (index != null && index >= 0 && index < state.value.length) {
        state.value.splice(index, 0, ...workouts);
      } else {
        state.value.push(...workouts);
      }
    },
    RemoveWorkout: (state, action) => {
      const workoutId: string = action.payload as string;
      const indexId = state.value.findIndex(item => item.id === workoutId);
      if (indexId >= 0) {
        state.value.splice(indexId, 1);
      }
    },
    UpdateWorkout: (state, action) => {
      const payload = action.payload as PayloadUpdateWorkout;
      const { workout } = payload;
      const indexId = state.value.findIndex(item => item.id === workout.id);
      if (indexId >= 0) {
        state.value.splice(indexId, 1, workout);
      }
    },
  },
});

export const { SetWorkouts, AddWorkout, AddWorkouts, RemoveWorkout, UpdateWorkout } = workoutsSlice.actions;
export const selectWorkouts = (state: any): WorkoutData[] => {
  // console.log('selectWorkouts called', state[StateWorkoutKey].value != null ? state[StateWorkoutKey].value.length : 'null');
  // (state[StateWorkoutKey].value as WorkoutData[] | null)?.forEach(item => LogService.infoFormat('selectWorkouts notification:{0}', item.notifications.length));
  return state[StateWorkoutKey].value;
};
export const selectWorkoutById = (state: any, id?: string): WorkoutData | null => {
  let result: WorkoutData | null = null;
  const workouts = state[StateWorkoutKey].value as WorkoutData[];
  if (id != null) {
    const foundItem = workouts.find(item => item.id === id);
    if (foundItem != null) {
      result = foundItem;
    }
  }
  return result
}
// export const selectWorkouts = (state: any): WorkoutData[] => {
//   console.log('state: ', state);
//   return state.workouts.value;
// }
export default workoutsSlice.reducer;
