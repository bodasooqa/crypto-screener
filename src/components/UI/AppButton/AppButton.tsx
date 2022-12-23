import React, { FC } from 'react';
import './AppButton.scss';

interface AppButtonProps {
  children?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: () => void;
}

const AppButton: FC<AppButtonProps> = ({ children, type = 'button', disabled, onClick }) => {
  return (
    <button
      className='app-button'
      type={ type }
      disabled={ disabled }
      onClick={onClick}
    >
      { children }
    </button>
  );
};

export default AppButton;
