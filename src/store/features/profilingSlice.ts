import { createSlice } from '@reduxjs/toolkit';
import { KeyValuePair } from '../../@types/KeyValuePair';

export const StateProfilingKey: string = 'profiling';

type ProfilingState = {
  ts: number;
  tsValues: KeyValuePair<string, number>[];
};

const initialState: ProfilingState = {
  ts: 0,
  tsValues: [],
};

export type PayloadSetTS = {
  key: string,
  ts: number
}

export const profilingSlice = createSlice({
  name: StateProfilingKey,
  initialState,
  reducers: {
    setTS: (state, action) => {
      // console.log('setTs action.payload ', action.payload);
      const payload = action.payload as PayloadSetTS;
      // console.log('setTs ts ', payload.ts);
      const item: KeyValuePair<string, number> = { key: payload.key, value: payload.ts };
      const itemIndex = state.tsValues.findIndex(item => item.key == payload.key);
      if (itemIndex >= 0) {
        state.tsValues.splice(itemIndex, 0, item)
      } else {
        state.tsValues.push(item);
      }
    },
  },
});

export const { setTS } = profilingSlice.actions;
export const selectTS = (state: any, key: string) => {
  const currentState = state[StateProfilingKey] as ProfilingState;
  const item = currentState.tsValues.find(item => item.key == key)
  let result: number | undefined;
  if (item != null) {
    result = item.value;
  }
  return result;
}
export default profilingSlice.reducer;
