import axios, { AxiosInstance } from 'axios';
import { BybitKline } from '../models/bybit.model';
import { KlineInterval } from '../models/exchange.model';

export class BybitApi {
  private axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({
      baseURL: process.env.REACT_APP_API_URL + '/bybit'
    })
  }

  getKline(symbol: string, interval: KlineInterval, limit: number = 20) {
    return this.axios.get<BybitKline>('kline', {
      params: { symbol, interval, limit }
    });
  }
}
