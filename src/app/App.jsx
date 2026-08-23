import React, { useEffect, useState } from 'react';
import { Providers } from './providers.jsx';
import { roleForPath } from './routes.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { LoginView } from '../views/Login/LoginView.jsx';
import { CitizenView } from '../views/CitizenPortal/CitizenView.jsx';
import { AgencyDashboard } from '../views/AgencyDashboard/AgencyDashboard.jsx';
import { AdminDashboard } from '../views/SuperAdmin/AdminDashboard.jsx';

function AppRouter() {
  const { user, loading } = useAuth();
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const syncPath = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', syncPath);
    return () => window.removeEventListener('popstate', syncPath);
  }, []);

  const requestedRole = roleForPath(pathname);

  if (loading) return <div style={{minHeight:'100vh',display:'grid',placeItems:'center'}}>Connecting to RESQGRID secure network…</div>;

  if (!user) return <LoginView />;
  if (requestedRole && requestedRole !== user.role) {
    window.history.replaceState({}, '', requestedRole === 'admin' ? '/login' : '/login');
    return <LoginView />;
  }

  if (user.role === 'citizen') return <CitizenView />;
  if (user.role === 'agency') return <AgencyDashboard />;
  if (user.role === 'admin') return <AdminDashboard />;
  return <LoginView />;
}

export function App() {
  return <Providers><AppRouter /></Providers>;
}
