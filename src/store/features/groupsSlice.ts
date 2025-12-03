import { createSlice } from '@reduxjs/toolkit';
import { WorkoutData } from '../../@types/Data/WorkoutData';
import { WorkoutComponentData } from '../../@types/Data/WorkoutComponentData';
import { WorkoutHelper } from '../../@types/Data/WorkoutHelper';
import { LogService } from '../../services/Log/LogService';
import { String } from "typescript-string-operations";

const StateGroupsKey: string = 'groups';

type GroupsState = {
  value: WorkoutComponentData[];
};

const initialState: GroupsState = {
  value: [],
};

export type PayloadAddGroup = {
  parentId: string | null,
  group: WorkoutComponentData,
  index?: number,
}

export type PayloadRemoveGroup = {
  groupId: string,
}

export type PayloadUpdateGroup = {
  parentId: string | null,
  groupId: string,
  group: WorkoutComponentData,
}

export type PayloadAddExerciseToGroup = {
  parentId: string,
  exercise: WorkoutComponentData,
}

export type PayloadUpdateExerciseInGroup = {
  parentId: string,
  exercise: WorkoutComponentData,
}

export type PayloadRemoveComponentFromGroup = {
  parentId: string,
  componentId: string,
}

export type PayloadSetChilderenInGroup = {
  groupId: string
  components: WorkoutComponentData[],
}

export const groupsSlice = createSlice({
  name: StateGroupsKey,
  initialState,
  reducers: {
    AddGroup: (state, action) => {
      const { parentId, group, index } = action.payload as PayloadAddGroup;
      LogService.debug(String.format('AddGroup payload: {0}', action.payload));
      // console.log('AddComponent state: ', state.value);
      let parentGroup: WorkoutComponentData | null = null;
      if (parentId != null) {
        const tmpParent = state.value.find(item => item.id === parentId);
        if (tmpParent) {
          parentGroup = tmpParent;
        }
      }

      if (parentGroup != null) {
        if (parentGroup.childeren && index != null && index >= 0 && index < parentGroup.childeren.length) {
          parentGroup.childeren.splice(index, 0, group);
        } else {
          parentGroup.childeren?.push(group);
        }
      }
      else {
        if (index != null && index >= 0 && index < state.value.length) {
          state.value.splice(index, 0, group);
        } else {
          state.value.push(group);
        }
      }
      // console.log('AddGroup state: ', state.value);
    },
    RemoveGroup: (state, action) => {
      const payload = action.payload as PayloadRemoveGroup;
      let groups = state.value;
      let index = groups.findIndex(item => item.id === payload.groupId);
      if (index >= 0) {
        groups.splice(index, 1);
      }
      // console.log('RemoveGroup groupId, state: ', payload.groupId, state.value);
    },
    UpdateGroup: (state, action) => {
      const payload = action.payload as PayloadUpdateGroup;

      let tmpGroups: WorkoutComponentData[] | null = null;
      if (payload.parentId != null) {
        const tmpParent = state.value.find(item => item.id === payload.parentId);
        if (tmpParent) {
          tmpGroups = tmpParent.childeren!;
        }
      }

      if (tmpGroups == null) {
        tmpGroups = state.value;
      }


      if (tmpGroups != null) {
        const index = tmpGroups.findIndex(item => item.id === payload.groupId);
        if (index >= 0) {
          tmpGroups.splice(index, 1, payload.group);
        }
      }
      // console.log('UpdateGroup state: ', state.value);
    },
    AddExerciseToGroup: (state, action) => {
      const payload = action.payload as PayloadAddExerciseToGroup;
      // console.log('AddComponent payload: ', payload);
      // console.log('AddComponent state: ', state.value);
      if (payload.parentId != null) {
        const parentGroup = state.value.find(item => item.id === payload.parentId);
        if (parentGroup) {
          parentGroup.childeren?.push(payload.exercise)
        }
      }
      // console.log('AddGroup state: ', state.value);
    },
    UpdateExerciseInGroup: (state, action) => {
      const payload = action.payload as PayloadUpdateExerciseInGroup;
      // console.log('AddComponent payload: ', payload);
      // console.log('AddComponent state: ', state.value);
      if (payload.parentId != null) {
        const parentGroup = state.value.find(item => item.id === payload.parentId);
        if (parentGroup != null) {
          const index = parentGroup.childeren!.findIndex(item => item.id === payload.exercise.id);
          if (index >= 0) {
            parentGroup.childeren?.splice(index, 1, payload.exercise);
          }
        }
      }
      // console.log('AddGroup state: ', state.value);
    },
    RemoveComponentFromGroup: (state, action) => {
      const payload = action.payload as PayloadRemoveComponentFromGroup;
      // console.log('AddComponent payload: ', payload);
      // console.log('AddComponent state: ', state.value);
      if (payload.parentId != null) {
        const parentGroup = state.value.find(item => item.id === payload.parentId);
        if (parentGroup != null) {
          const index = parentGroup.childeren?.findIndex(item => item.id === payload.componentId);
          if (index! >= 0) {
            parentGroup.childeren?.splice(index!, 1);
          }
        }
      }
      // console.log('RemoveComponentFromGroup state: ', state.value);
    },
    SetChilderenInGroup: (state, action) => {
      const payload = action.payload as PayloadSetChilderenInGroup;
      // todo:  asagidaki mantik yanlis bunun yerine selectGrouptaki buldugu gibi ilgili groubu bulmak lazim onun cocuklarini set etmek gerek.
      // console.log('AddComponent payload: ', payload);
      // console.log('AddComponent state: ', state.value);
      const groupId = payload.groupId;
      if (groupId != null) {
        let groups = state.value;
        const tmpGroup = groups.find(item => item.id === groupId);
        if (tmpGroup != null) {
          // console.log('SetChilderenInGroup groupName: ', tmpGroup.name);
          tmpGroup.childeren = payload.components;
        }
      }
      // console.log('SetChilderenInGroup state: ', state.value);
    },
  },
});

export const { AddGroup, RemoveGroup, UpdateGroup, AddExerciseToGroup, UpdateExerciseInGroup, RemoveComponentFromGroup, SetChilderenInGroup } = groupsSlice.actions;
export const selectGroupById = (state: any, groupId: string | null): WorkoutComponentData | null => {
  let groups = state[StateGroupsKey].value as WorkoutComponentData[];
  console.log("selectGroupById state: ", state.value);
  let result: WorkoutComponentData | null = null;
  if (groupId != null) {
    const tmpGroup = groups.find(item => item.id === groupId);
    if (tmpGroup != null) {
      result = tmpGroup;
    }
  }
  return result;
}

export const selectGroupByIdAndParentId = (state: any, groupId: string | null, parentId: string | null): WorkoutComponentData | null => {
  let groups = state[StateGroupsKey].value as WorkoutComponentData[];
  console.log("selectGroupByIdAndParentId state: ", state.value);
  let result: WorkoutComponentData | null = null;
  if (groupId != null && parentId != null) {
    const tmpParentGroup = groups.find(item => item.id === parentId);
    if (tmpParentGroup != null) {
      const tmpGroup = tmpParentGroup.childeren?.find(item => item.id === groupId);
      if (tmpGroup) {
        result = tmpGroup;
      }
    }
  }
  return result;
}

export const selectExerciseById = (state: any, groupId: string | null, exerciseId: string | null): WorkoutComponentData | null => {
  let groups = state[StateGroupsKey].value as WorkoutComponentData[];
  console.log("selectExerciseById state: ", state.value);
  let result: WorkoutComponentData | null = null;
  if (groupId != null && exerciseId != null) {
    const tmpGroup = groups.find(item => item.id === groupId);
    if (tmpGroup != null) {
      const tmpExercise = tmpGroup.childeren?.find(item => item.id === exerciseId);
      if (tmpExercise != null) {
        result = tmpExercise;
      }
    }
  }
  return result;
}

export default groupsSlice.reducer;
