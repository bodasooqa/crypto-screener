import { StorageKeys } from '../models/storage.model';

export class StorageService {
  public static shared = new StorageService();

  private getCookies = () => {
    const cookies = document.cookie
      .split(';')
      .map(cookie => cookie.trim().split('='));

    return Object.fromEntries(cookies);
  }

  public getLocal<T = string>(key: StorageKeys, isJSON: boolean = false): T {
    const value = localStorage.getItem(key) as string;

    if (isJSON) {
      return JSON.parse(value);
    }

    return localStorage.getItem(key) as T;
  }

  public setLocal<T = any>(key: StorageKeys, value: T, isJSON: boolean = false): void {
    localStorage.setItem(key, isJSON ? JSON.stringify(value) : value as string);
  }

  public getCookie<T = string>(key: StorageKeys, isJSON: boolean): T {
    const cookie = (this.getCookies()[key] || null) as string;

    if (isJSON) {
      return JSON.parse(cookie);
    }

    return cookie as T;
  }

  public setCookie<T = any>(key: StorageKeys, value: T, isJSON: boolean): void {
    document.cookie = `${ key }=${ isJSON ? JSON.stringify(value) : value }`;
  }
}
