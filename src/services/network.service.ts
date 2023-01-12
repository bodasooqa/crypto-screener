import { BybitApi } from '../api/bybit.api';
import { BinanceApi } from '../api/binance.api';
import { Exchange } from '../models/exchange.model';

export class NetworkService {
  [Exchange.BYBIT_SPOT]: BybitApi = new BybitApi();
  [Exchange.BINANCE_SPOT]: BinanceApi = new BinanceApi();

  public static shared = new NetworkService();

  private constructor() {}
}
