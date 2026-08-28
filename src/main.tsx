import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
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
const page = path === '/status' ? <ServiceStatus /> : path === '/maintenance' ? <Maintenance /> : path === '/404' ? <NotFound /> : isAdmin ? <Admin /> : path === '/' ? <App /> : <NotFound />;

createRoot(document.getElementById('root')!).render(
  <React.StrictMode><RouteErrorBoundary>{page}</RouteErrorBoundary></React.StrictMode>,
);
if (path === '/' && !isAdmin) void trackEvent('page_view');
