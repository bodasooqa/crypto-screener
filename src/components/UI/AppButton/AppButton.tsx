import React, { FC, useMemo } from 'react';
import './AppButton.scss';

interface AppButtonProps {
  children?: string | JSX.Element;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string | string[];
  onClick?: () => void;
}

const AppButton: FC<AppButtonProps> = (
  {
    children,
    type = 'button',
    disabled,
    className = '',
    onClick
  }
) => {
  const appliedClassName = useMemo(() => {
    return ['app-button'].concat(className).join(' ');
  }, [className]);

  return (
    <button
      className={ appliedClassName }
      type={ type }
      disabled={ disabled }
      onClick={ onClick }
    >
      { children }
    </button>
  );
};

export default AppButton;
