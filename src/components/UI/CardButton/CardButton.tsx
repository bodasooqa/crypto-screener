import React from 'react';
import './CardButton.scss';

interface CardButtonProps {
  children?: string | JSX.Element;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  isActive?: boolean;
  badge?: string | number;
  onClick?: () => void;
}

const CardButton = React.forwardRef<HTMLButtonElement, CardButtonProps>(
  (
    {
      children,
      type = 'button',
      disabled,
      isActive,
      badge,
      onClick
    },
    ref
  ) => {
    return (
      <button
        className={ `card-button ${ isActive && 'card-button--active' }` }
        type={ type }
        disabled={ disabled }
        onClick={ onClick }
        ref={ ref }
      >
        { children }
        { !!badge && <span className="card-button__badge">{ badge }</span> }
      </button>
    );
  }
);

export default CardButton;
