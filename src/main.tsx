import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import Logistics from './logistics/Logistics';
import Admin from './Admin';
import { RouteErrorBoundary } from './components/RouteErrorBoundary';
import { Maintenance, NotFound, ServiceStatus } from './handling';
import { trackEvent } from './api/client';
import './styles.css';
import './overrides.css';
import './proof.css';
import './assistant.css';
import './site-enhancements.css';
import './legal.css';
import './handling.css';

const path = window.location.pathname.replace(/\/$/, '') || '/';
const isAdmin = path === '/admin';
if (path === '/logistics') document.title = 'Aivanta | AI integration for logistics';
const page = path === '/status' ? <ServiceStatus /> : path === '/maintenance' ? <Maintenance /> : path === '/404' ? <NotFound /> : isAdmin ? <Admin /> : path === '/logistics' ? <Logistics /> : path === '/' ? <App /> : <NotFound />;

createRoot(document.getElementById('root')!).render(
  <React.StrictMode><RouteErrorBoundary>{page}</RouteErrorBoundary></React.StrictMode>,
);
if (path === '/' || path === '/logistics') void trackEvent('page_view');
