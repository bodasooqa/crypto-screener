import { BybitApi } from '../api/bybit.api';

export class NetworkService {
  bybit: BybitApi;

  constructor() {
    this.bybit = new BybitApi();
  }
}
