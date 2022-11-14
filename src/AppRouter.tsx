import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { publicRoutes } from './routes';
import NotFound from './pages/NotFound';

const AppRouter = () => {
  const user = true;

  const availableRoutes = user ? publicRoutes : publicRoutes;

  return (
    <Routes>
      {availableRoutes.map(({ path, Component}) =>
        <Route key={path} path={path} element={<Component />} />
      )}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
};

export default AppRouter;
