export const isEqual = (a?: any, b?: any): boolean => {
  return typeof a === typeof b
    && JSON.stringify(a) === JSON.stringify(b);
};
