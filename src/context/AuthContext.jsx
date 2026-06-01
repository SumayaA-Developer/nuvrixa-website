import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  async function loadProfile(userId) {
    if (!userId) {
      setProfile(null);
      return null;
    }

    setProfileLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, email, role, company_name, phone, status')
      .eq('id', userId)
      .maybeSingle();

    setProfileLoading(false);

    if (error) {
      setProfile(null);
      return null;
    }

    setProfile(data || null);
    return data || null;
  }

  useEffect(() => {
    let isMounted = true;

    async function initialiseAuth() {
      const { data } = await supabase.auth.getSession();
      if (!isMounted) return;

      const currentSession = data.session || null;
      setSession(currentSession);
      setUser(currentSession?.user || null);

      if (currentSession?.user?.id) {
        await loadProfile(currentSession.user.id);
      }

      if (isMounted) setLoading(false);
    }

    initialiseAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user || null);

      if (nextSession?.user?.id) {
        await loadProfile(nextSession.user.id);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function signIn(email, password) {
    return supabase.auth.signInWithPassword({ email, password });
  }

  async function signOut() {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setProfile(null);
  }

  const isAdmin = profile?.role === 'admin';
  const isClient = profile?.role === 'client' || Boolean(user);

  const value = useMemo(() => ({
    session,
    user,
    profile,
    loading,
    profileLoading,
    isAdmin,
    isClient,
    signIn,
    signOut,
    reloadProfile: () => loadProfile(user?.id)
  }), [session, user, profile, loading, profileLoading, isAdmin, isClient]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider.');
  }
  return context;
}
