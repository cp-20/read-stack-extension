import type { Provider, User } from '@supabase/supabase-js';
import { useEffect } from 'react';

import { sendToBackground } from '@plasmohq/messaging';
import { Storage } from '@plasmohq/storage';
import { useStorage } from '@plasmohq/storage/hook';

import { supabase } from '@/lib/boundaries/supabase';

export const useAuth = () => {
  const [user, setUser] = useStorage<User>({
    key: 'user',
    instance: new Storage({
      area: 'local',
    }),
  });

  useEffect(() => {
    const init = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error(error);
        return;
      }
      if (data.session) {
        setUser(data.session.user);
        sendToBackground({
          name: 'init-session',
          body: {
            refresh_token: data.session.refresh_token,
            access_token: data.session.access_token,
          },
        });
      }
    };

    init();
  }, []);

  const handleOAuthLogin = async (provider: Provider, scopes = 'email') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        scopes,
        redirectTo: location.href,
      },
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return {
    user,
    handleOAuthLogin,
    handleLogout,
  };
};
