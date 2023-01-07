import React, { ChangeEvent, FC, HTMLInputTypeAttribute, useEffect, useRef, useState } from 'react';
import './AppInput.scss';
import Inputmask from 'inputmask';

interface AppInputProps {
  label?: string;
  mask?: string | Inputmask.Options;
  max?: number;
  name?: string;
  placeholder?: string;
  preText?: string;
  type: HTMLInputTypeAttribute;
  value: string;
  onInput?: (event: ChangeEvent<HTMLInputElement>) => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

const AppInput: FC<AppInputProps> = (props) => {
  const [inputmask, setInputmask] = useState<Inputmask.Instance | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const onInput = (event: ChangeEvent<HTMLInputElement>) => {
    if (!!props.max) {
      if (parseFloat(event.target.value) > props.max) {
        event.target.value = String(props.max);
      }
    }

    if (!!props.onInput) {
      props.onInput(event);
    }

    if (!!props.onChange) {
      props.onChange(event);
    }
  }

  useEffect(() => {
    if (!!inputmask && !!inputRef.current) {
      inputmask.mask(inputRef.current);
    }
  }, [inputmask, inputRef]);

  useEffect(() => {
    if (!!props.mask) {
      setInputmask(new Inputmask(props.mask as Inputmask.Options));
    }
  }, []);

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
        ref={ inputRef }
        id={ props.name }
        name={ props.name }
        type={ props.type }
        placeholder={ props.placeholder }
        value={ props.value }
        onInput={ onInput }
        onChange={ props.onChange }
        max={ props.max }
      />
    </div>
  );
};

export default AppInput;
