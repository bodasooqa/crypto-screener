import axios, { AxiosInstance } from 'axios';
import { BinanceKline } from '../models/binance.model';
import { getUTCDayStart } from '../utils/kline';

export class BinanceApi {
  private axios: AxiosInstance;

  constructor() {
    const host = process.env.NODE_ENV === 'development'
      ? `http://${ window.location.hostname }:8000`
      : process.env.REACT_APP_API_URL;

    this.axios = axios.create({
      baseURL: host + '/binance'
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
