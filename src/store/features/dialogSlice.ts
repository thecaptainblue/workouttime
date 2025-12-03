import { createSlice } from '@reduxjs/toolkit';
import { KeyValuePair } from '../../@types/KeyValuePair';
import { LogService } from '../../services/Log/LogService';
import LogHelper from '../../helper/LogHelper';

const StateDialogKey: string = 'dialog';

export type DialogResult = {
  resultIndex: number,
  timestamp: number,
}

type DialogState = {
  dialogValues: KeyValuePair<string, DialogResult>[];
};

const initialState: DialogState = {
  dialogValues: [],
};

export type PayloadSetDialog = {
  name: string,
  resultIndex: number,
  timestamp: number,
}

export const dialogSlice = createSlice({
  name: StateDialogKey,
  initialState,
  reducers: {
    setDialogResult: (state, action) => {
      // console.log('setTs action.payload ', action.payload);
      const payload = action.payload as PayloadSetDialog;
      LogService.infoFormat('setDialogResult payload: {0}', LogHelper.toString(payload))
      // console.log('setTs ts ', payload.ts);
      const item: KeyValuePair<string, DialogResult> = { key: payload.name, value: { resultIndex: payload.resultIndex, timestamp: payload.timestamp } };
      const itemIndex = state.dialogValues.findIndex(item => item.key == payload.name);
      if (itemIndex >= 0) {
        state.dialogValues.splice(itemIndex, 0, item)
      } else {
        state.dialogValues.push(item);
      }
    },
  },
});

export const { setDialogResult } = dialogSlice.actions;
export const selectDialogResult = (state: any, key: string) => {
  const currentState = state[StateDialogKey] as DialogState;
  const item = currentState.dialogValues.find(item => item.key == key)
  let result: DialogResult | undefined;
  if (item != null) {
    result = item.value;
  }
  return result;
}
export default dialogSlice.reducer;
