import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import Admin from './Admin';
import './styles.css';
import './overrides.css';
import './proof.css';
import './assistant.css';
import './site-enhancements.css';
import './legal.css';

const isAdmin = window.location.pathname === '/admin' || window.location.pathname === '/admin/';
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>{isAdmin ? <Admin /> : <App />}</React.StrictMode>,
);
