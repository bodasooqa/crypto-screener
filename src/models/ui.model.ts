export interface ISelectOption<T> {
  label?: string;
  value: T;
}

export interface ISelectOptgroup<T> {
  title: string;
  options: ISelectOption<T>[];
}

export type SelectDataItem<T = string> = ISelectOption<T> | ISelectOptgroup<T>;
export type SelectData<T = string> = SelectDataItem<T>[];
