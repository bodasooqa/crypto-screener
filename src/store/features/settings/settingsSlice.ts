import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getSettings, setSettingsItem } from './actionCreators';
import { ISettingsCollection, ISettingsLoading } from '../../../models/settings.model';

interface ISettingsState {
  value: ISettingsCollection | null;
  isLoading: ISettingsLoading;
}

const initialIsLoading: ISettingsLoading = {
  all: false,
  pairs: []
}

const initialState: ISettingsState = {
  value: null,
  isLoading: { ...initialIsLoading },
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSettings: (state, { payload }: PayloadAction<ISettingsCollection | null>) => {
      state.value = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setSettingsItem.fulfilled, (state, { payload }) => {
      if (!!payload) {
        const key = `${ payload.exchange }-${ payload.symbol }`;

        if (!!state.value) {
          state.value[key] = payload;
        } else {
          state.value = {
            [key]: payload
          };
        }
      }

      state.isLoading = { ...initialIsLoading };
    });

    builder.addCase(setSettingsItem.pending, (state, { meta }) => {
      if (!!meta) {
        state.isLoading = {
          ...initialIsLoading,
          pairs: [
            ...state.isLoading.pairs,
            `${ meta.arg.exchange }-${ meta.arg.symbol }`
          ],
        };
      }
    });

    builder.addCase(setSettingsItem.rejected, (state, { payload }) => {
      console.log(payload);
      state.isLoading = { ...initialIsLoading };
    });

    builder.addCase(getSettings.fulfilled, (state, { payload }) => {
      if (!!payload) {
        state.value = payload;
      }

      state.isLoading = { ...initialIsLoading };
    });

    builder.addCase(getSettings.pending, (state) => {
      state.isLoading = {
        ...initialIsLoading,
        all: true
      };
    });

    builder.addCase(getSettings.rejected, (state, { payload }) => {
      console.log(payload);
      state.isLoading = { ...initialIsLoading, };
    });
  }
});

export const { setSettings } = settingsSlice.actions;

export default settingsSlice.reducer;
