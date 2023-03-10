export enum Exchange {
  BYBIT_SPOT = 'bybit-spot',
  BINANCE_SPOT = 'binance-spot',
  // BINANCE_FEATURES = 'binance-features',
}

export type KlineInterval =
  | '1m' | '3m' | '5m' | '15m' | '30m'
  | '1h' | '2h' | '4h' | '6h' | '12h'
  | '1d' | '1w' | '1M';

export interface BinanceErrorData {
  msg: string;
}

export interface BybitErrorData {
  retMsg: string;
}

export type ErrorData = BinanceErrorData & BybitErrorData;

export interface IExchangeSymbols {
  symbols: string[];
}

export interface IExchangesAndSymbols {
  [key: string]: string[];
}

export interface IExchangeSymbol {
  exchange: Exchange,
  symbol: string;
}

export interface IExchangeWithSymbols {
  title: Exchange;
  symbols: string[];
}
