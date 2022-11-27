import axios, { AxiosInstance } from 'axios';
import { BinanceKline } from '../models/binance.model';
import { getUTCDayStart } from '../utils/kline';

export class BinanceApi {
  private axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({
      baseURL: process.env.REACT_APP_API_URL + '/binance'
    })
  }

  getKline(symbol: string, interval: string, limit?: number) {
    return this.axios.get<BinanceKline>('kline', {
      params: {
        symbol,
        interval,
        limit,
        startTime: getUTCDayStart()
      }
    });
  }
}
