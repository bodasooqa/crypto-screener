import React, { FC } from 'react';
import './Loader.scss';

interface LoaderProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: 'main' | 'white' | 'black';
}

const Loader: FC<LoaderProps> = ({ size = 'md', color = 'main' }) => {
  return (
    <>
      <div className={ ['loader', `loader--${ size }`, `loader--${ color }`].join(' ') }>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </>
  );
};

export default Loader;
