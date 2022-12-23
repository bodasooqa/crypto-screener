import React, { FC } from 'react';
import './AppInput.scss';

interface AppInputProps {
  name?: string;
  placeholder: string;
  preText?: string;
  type: string;
  value: string;
  onInput?: () => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const AppInput: FC<AppInputProps> = (props) => {
  return (
    <div className="app-input">
      { props.preText
        && <label htmlFor={ props.name }>
          { props.preText }
        </label> }

      <input
        name={ props.name }
        type={ props.type }
        placeholder={ props.placeholder }
        value={ props.value }
        onInput={ props.onInput }
        onChange={ props.onChange }
      />
    </div>
  );
};

export default AppInput;
