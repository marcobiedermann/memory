import { createSlice } from '@reduxjs/toolkit';

export interface SettingsState {
  difficulty: 'easy' | 'medium' | 'hard';
  symbols: 'emojies' | 'numbers';
  showTimer: boolean;
}

const initialState: SettingsState = {
  difficulty: 'easy',
  symbols: 'emojies',
  showTimer: true,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
});

const { reducer } = settingsSlice;

export default reducer;
