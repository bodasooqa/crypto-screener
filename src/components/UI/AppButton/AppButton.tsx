import React, { FC, useMemo } from 'react';
import './AppButton.scss';

interface AppButtonProps {
  children?: string | JSX.Element;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string | string[];
  color?: string;
  onClick?: () => void;
}

const AppButton: FC<AppButtonProps> = (
  {
    children,
    type = 'button',
    disabled,
    className = '',
    color,
    onClick
  }
) => {
  const appliedClassName = useMemo(() => {
    return ['app-button', `app-button--color-${ color || 'main' }`].concat(className).join(' ');
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
