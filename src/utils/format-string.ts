import { KlineInterval } from '../models/exchange.model';
import { hours, minutes } from './constants';

export const toCapitalize = (str: string): string => {
  return `${ str[0].toUpperCase() }${ str.substring(1) }`
};

export const toNumberString = (str: string): string => {
  return str.replace(/\D/g,'');
}

export const klineIntervalToNum = (str: KlineInterval): number => {
  const numStr = toNumberString(str);

  if (minutes.includes(str)) {
    return parseInt(numStr);
  } else if (hours.includes(str)) {
    return parseInt(numStr) * 60;
  } else {
    if (str.includes('d')) {
      return parseInt(numStr) * 60 * 24;
    } else if (str.includes('w')) {
      return parseInt(numStr) * 60 * 24 * 7;
    } else {
      const now = new Date();
      return parseInt(numStr) * 60 * 24 * new Date(now.getUTCFullYear(), now.getUTCMonth(), 0).getDate();
    }
  }
};
