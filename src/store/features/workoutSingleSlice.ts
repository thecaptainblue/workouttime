import { createSlice } from '@reduxjs/toolkit';
import { WorkoutData } from '../../@types/Data/WorkoutData';
import { WorkoutComponentData } from '../../@types/Data/WorkoutComponentData';
import { WorkoutHelper } from '../../@types/Data/WorkoutHelper';
import { LogService } from '../../services/Log/LogService';
import { String } from "typescript-string-operations";
import { NotificationData } from '../../@types/Data/NotificationData';

const StateSingleWorkoutKey: string = 'workoutSingle';

type WorkoutSingleState = {
  value: WorkoutData | null;
};

const initialState: WorkoutSingleState = {
  value: null,
};

export type PayloadSetComponent = {
  components: WorkoutComponentData[],
}

export type PayloadAddComponent = {
  idLadder: string[],
  // componentId: string | null,
  component: WorkoutComponentData,
  index?: number,
}

export type PayloadRemoveComponent = {
  idLadder: string[],
  componentId: string,
}

export type PayloadUpdateComponent = {
  idLadder: string[],
  componentId: string,
  component: WorkoutComponentData,
}

export type PayloadSetNotifications = {
  notifications: NotificationData[],
}

export type PayloadAddNotification = {
  notification: NotificationData,
  index?: number,
}

export type PayloadUpdateNotification = {
  notification: NotificationData,
}

export type PayloadRemoveNotification = {
  notificationId: string,
}

export const workoutSingleSlice = createSlice({
  name: StateSingleWorkoutKey,
  initialState,
  reducers: {
    SetSingleWorkout: (state, action) => {
      const workout = action.payload as WorkoutData;
      state.value = workout;
      // console.log('SetSingleWorkout state: ', state.value);
    },
    SetComponents: (state, action) => {
      const payload = action.payload as PayloadSetComponent;
      if (state.value != null) {
        state.value.components = payload.components;
      }
      // console.log('SetComponents state: ', state.value);
    },
    AddComponent: (state, action) => {
      const { idLadder, component, index } = action.payload as PayloadAddComponent;
      // console.log('AddComponent payload: ', payload);
      // console.log('AddComponent state: ', state.value);
      let tmpComponents: WorkoutComponentData[] | null = null;
      if (idLadder.length === 0) {
        // top level
        tmpComponents = state.value?.components as WorkoutComponentData[];
      }
      else {
        tmpComponents = WorkoutHelper.findComponentsWithIdLadder(state.value?.components as WorkoutComponentData[], idLadder);
        LogService.debug(String.format('AddComponent tmpComponents: {0}', tmpComponents));
      }

      if (tmpComponents != null) {
        if (index != null && index >= 0 && index < tmpComponents.length) {
          tmpComponents.splice(index, 0, component);
        } else {
          tmpComponents.push(component);
        }
      }
      // console.log('AddComponent state: ', state.value);
    },
    RemoveComponent: (state, action) => {
      const payload = action.payload as PayloadRemoveComponent;
      // console.log('AddComponent payload: ', payload);
      // console.log('AddComponent state: ', state.value);
      let tmpComponents: WorkoutComponentData[] | null = null;
      tmpComponents = state.value?.components as WorkoutComponentData[];
      tmpComponents = WorkoutHelper.findComponentsWithIdLadder(state.value?.components as WorkoutComponentData[], payload.idLadder);
      if (tmpComponents != null) {
        let index = tmpComponents.findIndex(item => item.id === payload.componentId);
        if (index >= 0) {
          tmpComponents.splice(index, 1);
        }

      }
      // console.log('RemoveComponent state: ', state.value);
    },
    UpdateComponent: (state, action) => {
      const payload = action.payload as PayloadUpdateComponent;
      // console.log('AddComponent payload: ', payload);
      // console.log('AddComponent state: ', state.value);
      let tmpComponents: WorkoutComponentData[] | null = null;
      tmpComponents = state.value?.components as WorkoutComponentData[];
      tmpComponents = WorkoutHelper.findComponentsWithIdLadder(state.value?.components as WorkoutComponentData[], payload.idLadder);
      if (tmpComponents != null) {
        let index = tmpComponents.findIndex(item => item.id === payload.componentId);
        if (index >= 0) {
          tmpComponents.splice(index, 1, payload.component);
        }
      }
      // console.log('UpdateComponent state: ', state.value);
    },
    SetNotifications: (state, action) => {
      const payload = action.payload as PayloadSetNotifications;
      const { notifications } = payload;
      if (state.value != null) {
        state.value.notifications = notifications;
      }
      // console.log('SetComponents state: ', state.value);
    },
    AddNotification: (state, action) => {
      const { notification, index } = action.payload as PayloadAddNotification;
      // console.log('AddComponent payload: ', payload);
      // console.log('AddComponent state: ', state.value);
      const tmpNotifications = state.value?.notifications as NotificationData[];
      // LogService.infoFormat('AddNotification tmpNotifications:{0}', tmpNotifications);

      if (tmpNotifications != null) {
        if (index != null && index >= 0 && index < tmpNotifications.length) {
          tmpNotifications.splice(index, 0, notification);
        } else {
          tmpNotifications.push(notification);
        }
      }
      // console.log('AddNotification state: ', state.value);
    },
    UpdateNotification: (state, action) => {
      const payload = action.payload as PayloadUpdateNotification;
      const { notification } = payload;
      // console.log('AddComponent payload: ', payload);
      // console.log('AddComponent state: ', state.value);
      const tmpNotifications = state.value?.notifications as NotificationData[];
      if (tmpNotifications != null) {
        let index = tmpNotifications.findIndex(item => item.id === notification.id);
        if (index >= 0) {
          tmpNotifications.splice(index, 1, notification);
        }
      }
      // console.log('UpdateNotification state: ', state.value);
    },
    RemoveNotification: (state, action) => {
      const payload = action.payload as PayloadRemoveNotification;
      const { notificationId } = payload;
      // console.log('AddComponent payload: ', payload);
      // console.log('AddComponent state: ', state.value);
      const tmpNotifications = state.value?.notifications as NotificationData[];
      if (tmpNotifications != null) {
        let index = tmpNotifications.findIndex(item => item.id === notificationId);
        if (index >= 0) {
          tmpNotifications.splice(index, 1);
        }
      }
      // console.log('RemoveNotification state: ', state.value);
    },
  },
});

export const { SetSingleWorkout, SetComponents, AddComponent, RemoveComponent, UpdateComponent, SetNotifications, AddNotification, UpdateNotification, RemoveNotification } = workoutSingleSlice.actions;
export const selectSingleWorkout = (state: any): WorkoutData | null => {
  // LogService.debug(String.format('selectSingleWorkout called {0}', state[StateSingleWorkoutKey].value != null ? 'Not null' : 'null'));
  // console.log("selectSingleWorkout state: ", state.value);
  return state[StateSingleWorkoutKey].value;
}
export const selectComponentByIdLadder = (state: any, idLadder: string[], componentId: string | null): WorkoutComponentData | null => {
  // console.log("selectComponentByIdLadder state: ", state.value);
  let result: WorkoutComponentData | null = null;
  const workout = state[StateSingleWorkoutKey].value as WorkoutData;
  if (componentId != null) {
    result = WorkoutHelper.findComponentWithIdLadderAndId(workout.components, idLadder, componentId);
  }
  return result
}

export const selectNotificationById = (state: any, notificationId: string | null): NotificationData | null => {
  // console.log("selectComponentByIdLadder state: ", state.value);
  let result: NotificationData | null = null;
  const workout = state[StateSingleWorkoutKey].value as WorkoutData;
  if (notificationId != null) {
    result = WorkoutHelper.findNotificationById(workout.notifications, notificationId);
  }
  return result
}

export default workoutSingleSlice.reducer;
