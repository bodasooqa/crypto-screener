import React, { FC } from 'react';
import './AppButton.scss';

interface AppButtonProps {
  children?: string;
  onClick?: () => void;
}

const AppButton: FC<AppButtonProps> = ({ children, onClick }) => {
  return (
    <button className='app-button' onClick={onClick}>
      {children}
    </button>
  );
};

export default AppButton;
