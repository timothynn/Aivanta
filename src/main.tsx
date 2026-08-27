import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';
import './overrides.css';
import './proof.css';
import './assistant.css';

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
