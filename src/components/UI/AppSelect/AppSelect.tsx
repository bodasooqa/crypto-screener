import React, { ChangeEvent, FC } from 'react';
import './AppSelect.scss';
import { SelectData, SelectDataItem } from '../../../models/ui.model';

interface AppSelectProps {
  label?: string;
  name?: string;
  placeholder?: string;
  preText?: string;
  options: SelectData;
  value: string | undefined;
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
}

const AppSelect: FC<AppSelectProps> = (props) => {
  const mapOptionsData = (dataItem: SelectDataItem) => {
    if ('title' in dataItem) {
      return (
        <optgroup
          key={ `optgroup-${ dataItem.title }` }
          label={ dataItem.title }
        >
          { dataItem.options.map(option =>
            <option
              key={ `sub-option-${ option.value }` }
              value={ option.value }
            >
              { option.label || option.value }
            </option>
          ) }
        </optgroup>
      );
    } else {
      return (
        <option
          key={ `option-${ dataItem.value }` }
          value={ dataItem.value }
        >
          { dataItem.label || dataItem.value }
        </option>
      );
    }
  }

  return (
    <div className="app-select">
      { props.label
        && <label className='app-select__label' htmlFor={ props.name }>
          { props.label }
        </label> }

      { props.preText
        && <label htmlFor={ props.name }>
          { props.preText }
        </label> }

      <select
        id={ props.name }
        name={ props.name }
        value={ props.value }
        onChange={ props.onChange }
      >
        { props.options.map(mapOptionsData) }
      </select>
    </div>
  );
};

export default AppSelect;
