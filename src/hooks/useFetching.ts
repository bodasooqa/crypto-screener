import { useState } from 'react';

export type IUseFetching = [
  () => Promise<void>,
  boolean,
  string
];

export const useFetching = (callback: () => Promise<void>): IUseFetching => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetching = async () => {
    try {
      setIsLoading(true);
      await callback();
    } catch (err) {
      setError(err as string);
    } finally {
      setIsLoading(false);
    }
  }

  return [fetching, isLoading, error];
}
