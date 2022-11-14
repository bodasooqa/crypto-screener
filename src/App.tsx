import React from 'react';
import './App.scss';
import Navbar from './components/Navbar';
import AppRouter from './AppRouter';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
