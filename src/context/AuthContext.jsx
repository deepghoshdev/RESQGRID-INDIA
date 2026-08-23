import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { pathForRole, roles } from '../app/routes.jsx';
import { supabase } from '../lib/supabase.js';

const Ctx = createContext(null);

function roleFromUser(user) {
  return user?.user_metadata?.role || roles.citizen;
}

function profileFromUser(user) {
  if (!user) return null;
  const role = roleFromUser(user);
  return {
    id: user.id,
    name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'RESQGRID User',
    role,
    verified: Boolean(user.email_confirmed_at),
    identifier: user.email || '',
    label: role === roles.agency
      ? 'Agency Battalion Command Portal'
      : role === roles.admin
        ? 'National Command Console'
        : 'Citizen Emergency & Relief Portal',
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!active) return;
      setUser(profileFromUser(session?.user));
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(profileFromUser(session?.user));
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async ({ role, identifier, password }) => {
    if (!identifier?.trim()) throw new Error('Enter your email address.');
    if (!password?.trim()) throw new Error('Enter your password.');
    if (!identifier.includes('@')) throw new Error('For this prototype, sign in with an email address.');

    const { data, error } = await supabase.auth.signInWithPassword({
      email: identifier.trim(),
      password,
    });
    if (error) throw error;

    // The selected portal is stored as non-sensitive user metadata for routing.
    // Database authorization must still be enforced with RLS in production.
    if (data.user?.user_metadata?.role !== role) {
      const { data: updated, error: updateError } = await supabase.auth.updateUser({
        data: { role },
      });
      if (updateError) throw updateError;
      data.user = updated.user;
    }

    const nextUser = profileFromUser(data.user);
    setUser(nextUser);
    window.history.pushState({}, '', pathForRole(role));
    window.dispatchEvent(new PopStateEvent('popstate'));
    return nextUser;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.history.pushState({}, '', '/login');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAuth = () => {
  const context = useContext(Ctx);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};
