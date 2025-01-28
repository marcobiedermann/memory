import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
  reducers: {
    update: (state, action: PayloadAction<SettingsState>) => {
      state.difficulty = action.payload.difficulty;
      state.symbols = action.payload.symbols;
      state.showTimer = action.payload.showTimer;
    },
  },
});

const {
  actions: { update },
  reducer,
} = settingsSlice;

export { update };
export default reducer;
