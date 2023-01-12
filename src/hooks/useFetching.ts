import { useState } from 'react';
import { AxiosError } from 'axios';
import { ErrorData } from '../models/exchange.model';

export type IUseFetching<E> = [
  () => Promise<void>,
  boolean,
  AxiosError<E> | null
];

export const useFetching = <T = void, E = ErrorData>(callback: () => Promise<T>): IUseFetching<E> => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AxiosError<E> | null>(null);

  const fetching = async (): Promise<void> => {
    try {
      setError(null);
      setIsLoading(true);
      await callback();
    } catch (err) {
      const error: AxiosError<E> = err as AxiosError<E>;
      if (!!error) {
        setError(error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return [fetching, isLoading, error];
}
