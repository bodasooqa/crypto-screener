import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../../index';
import { ThunkExtra } from '../../../models/app.model';
import { Exchange } from '../../../models/exchange.model';

export const getBinanceSpotSymbols = createAsyncThunk<
  string[],
  void,
  {
    dispatch: AppDispatch,
    state: RootState,
    extra: ThunkExtra,
  }
  >('symbols/getSymbols', async (_, thunkAPI) => {
    try {
      const { data } = await thunkAPI.extra.network[Exchange.BINANCE_SPOT].getSymbols();

      if (!!data.symbols.length) {
        return thunkAPI.fulfillWithValue(data.symbols);
      }

      return thunkAPI.rejectWithValue(`Documents not found`);
    } catch (err) {
      return thunkAPI.rejectWithValue(`Error getting symbols: ${ err }`);
    }
});
