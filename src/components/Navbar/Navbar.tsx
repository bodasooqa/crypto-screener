import React from 'react';
import './Navbar.scss';
import AppButton from '../UI/AppButton';

const Navbar = () => {
  return (
    <div className='navbar'>
      <div className='container'>
        <div className="navbar__content">
          <div className="navbar__title">
            <strong>Black</strong>Portfolio
          </div>

          <div className="navbar__actions">
            <AppButton onClick={() => console.log('app ap ap')}>
              Sign in
            </AppButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
