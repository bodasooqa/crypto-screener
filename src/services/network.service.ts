import { BybitApi } from '../api/bybit.api';
import { BinanceApi } from '../api/binance.api';

export class NetworkService {
  bybit: BybitApi;
  binance: BinanceApi;

  constructor() {
    this.bybit = new BybitApi();
    this.binance = new BinanceApi();
  }
}
