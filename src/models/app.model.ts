import { NetworkService } from '../services/network.service';
import { StorageService } from '../services/storage.service';

export interface GlobalContext {
  network: NetworkService;
  storage: StorageService;
}

export type ThunkExtra = Omit<GlobalContext, 'storage'>;
