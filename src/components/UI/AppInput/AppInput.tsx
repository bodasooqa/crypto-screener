import React, { ChangeEvent, FC, HTMLInputTypeAttribute } from 'react';
import './AppInput.scss';

interface AppInputProps {
  label?: string;
  max?: number;
  name?: string;
  placeholder?: string;
  preText?: string;
  type: HTMLInputTypeAttribute;
  value: string;
  onInput?: () => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

const AppInput: FC<AppInputProps> = (props) => {
  return (
    <div className="app-input">
      { props.label
        && <label className='app-input__label' htmlFor={ props.name }>
          { props.label }
        </label> }

      { props.preText
        && <label htmlFor={ props.name }>
          { props.preText }
        </label> }

      <input
        id={ props.name }
        name={ props.name }
        type={ props.type }
        placeholder={ props.placeholder }
        value={ props.value }
        onInput={ props.onInput }
        onChange={ props.onChange }
        max={ props.max }
      />
    </div>
  );
};

export default AppInput;
