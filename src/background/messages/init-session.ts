import type { AuthChangeEvent } from '@supabase/supabase-js';

import type { PlasmoMessaging } from '@plasmohq/messaging';
import { Storage } from '@plasmohq/storage';

import { supabase } from '@/lib/boundaries/supabase';

export const storage = new Storage({
  area: 'session',
});

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  supabase.auth.onAuthStateChange((event, session) => {
    const action: Record<AuthChangeEvent, () => Promise<unknown>> = {
      SIGNED_IN: () => storage.set('user', session.user),
      SIGNED_OUT: () => storage.remove('user'),
      INITIAL_SESSION: () => storage.set('user', session.user),
      USER_UPDATED: () => storage.set('user', session.user),
      MFA_CHALLENGE_VERIFIED: () => storage.set('user', session.user),
      PASSWORD_RECOVERY: () => storage.set('user', session.user),
      TOKEN_REFRESHED: () => storage.set('user', session.user),
    };

    action[event]();
  });

  await supabase.auth.setSession(req.body);

  const { data, error } = await supabase.auth.getUser();
  if (error !== null) {
    return res.send({ success: false, error });
  }

  await storage.set('user', data.user);

  res.send({ success: true });
};

export default handler;
