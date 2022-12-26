import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebase';

export const useAuth = () => {
  const [globalUser] = useAuthState(auth);

  return [globalUser];
};
