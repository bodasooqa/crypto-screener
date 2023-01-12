import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getBinanceSpotSymbols } from './actionCreators';
import { Exchange, IExchangesAndSymbols, IExchangeSymbol } from '../../../models/exchange.model';

interface ISymbolsState {
  isLoading: boolean;
  value: IExchangesAndSymbols;
  selectedSymbols: IExchangeSymbol[];
  error: string | null;
}

const initialState: ISymbolsState = {
  isLoading: true,
  value: {},
  selectedSymbols: [],
  error: null,
}

export const symbolsSlice = createSlice({
  name: 'symbols',
  initialState,
  reducers: {
    setSelectedSymbols: (state, { payload }: PayloadAction<IExchangeSymbol[]>) => {
      state.selectedSymbols = payload;
    },

    addSelectedSymbol: (state, { payload }: PayloadAction<IExchangeSymbol>) => {
      state.selectedSymbols.push(payload);
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getBinanceSpotSymbols.fulfilled, (state, { payload }) => {
      state.value[Exchange.BINANCE_SPOT] = payload;
      state.isLoading = false;
    });

    builder.addCase(getBinanceSpotSymbols.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });

    builder.addCase(getBinanceSpotSymbols.rejected, (state, { payload }) => {
      console.log(payload);
      state.isLoading = false;
      state.error = payload as string;
    });
  },
});

export const { addSelectedSymbol, setSelectedSymbols } = symbolsSlice.actions;

export default symbolsSlice.reducer;
