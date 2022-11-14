import Login from './pages/Login';
import Home from './pages/Home';

export enum RootRoutes {
  HOME = '/',
  LOGIN = '/login'
}

export const publicRoutes = [
  {
    path: RootRoutes.HOME,
    Component: Home
  },
  {
    path: RootRoutes.LOGIN,
    Component: Login
  }
];
