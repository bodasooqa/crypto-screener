import React from 'react';
import './Navbar.scss';
import AppButton from '../UI/AppButton/AppButton';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useAuth } from '../../hooks/useAuth';
import NotificationsBar from '../NotificationsBar/NotificationsBar';
import logoSvg from '../../assets/img/logo.svg';

const Navbar = () => {
  const [globalUser] = useAuth();

  const login = async () => {
    const provider = new GoogleAuthProvider();

    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await auth.signOut();
  };

  return (
    <div className='navbar'>
      <div className='container'>
        <div className="navbar__content">
          <div className="navbar__logo">
            <img src={ logoSvg } alt="Logo" />
          </div>

          <div className="navbar__actions">
            {
              !!globalUser
                ? <AppButton onClick={ logout }>
                  Log out
                </AppButton>
                : <AppButton onClick={ login }>
                  Sign in
                </AppButton>
            }
          </div>
        </div>
      </div>

      <NotificationsBar />
    </div>
  );
};

export default Navbar;
