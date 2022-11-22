import axios, { AxiosInstance } from 'axios';

export class BybitApi {
  private axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({
      baseURL: process.env.REACT_APP_API_URL + '/bybit'
    })
  }

  getKline(symbol: string, interval: string, limit: number = 20) {
    return this.axios.get('kline', {
      params: { symbol, interval, limit }
    });
  }
}
