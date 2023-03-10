import axios, { AxiosInstance } from 'axios';
import { BybitKline } from '../models/bybit.model';
import { KlineInterval } from '../models/exchange.model';
import { getUTCDayStart } from '../utils/kline';

export class BybitApi {
  private axios: AxiosInstance;

  constructor() {
    const host = process.env.NODE_ENV === 'development'
      ? `http://${ window.location.hostname }:8000`
      : process.env.REACT_APP_API_URL;

    this.axios = axios.create({
      baseURL: host + '/bybit'
    })
  }

  getKline(symbol: string, interval: KlineInterval, limit?: number) {
    return this.axios.get<BybitKline>('kline', {
      params: {
        symbol,
        interval,
        limit,
        startTime: getUTCDayStart()
      }
    });
  }
}
