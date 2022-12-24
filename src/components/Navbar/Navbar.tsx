import React from 'react';
import './Navbar.scss';
import AppButton from '../UI/AppButton/AppButton';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/firebase';

const Navbar = () => {
  const [globalUser] = useAuthState(auth);

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
          <div className="navbar__title">
            <strong>Black</strong>Portfolio
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
    </div>
  );
};

export default Navbar;
