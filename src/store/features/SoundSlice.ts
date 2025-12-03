import { createSlice } from '@reduxjs/toolkit';
import Sound from 'react-native-sound';

type SoundState = {
  value: Sound | null;
  status: string;
};

const initialState: SoundState = {
  value: null,
  status: 'empty',
};

export const soundSlice = createSlice({
  name: 'sound',
  initialState,
  reducers: {
    loadSound: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { loadSound } = soundSlice.actions;
export const selectSound = (state: any) => state.sound.value;
export default soundSlice.reducer;
