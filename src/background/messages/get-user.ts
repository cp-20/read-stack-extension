import type { AuthUser } from '@supabase/supabase-js';

import type { PlasmoMessaging } from '@plasmohq/messaging';

import { storage } from '@/background/messages/init-session';
import { supabase } from '@/lib/boundaries/supabase';

export const getUser = async () => {
  const user = await storage.get<AuthUser>('user');
  if (user !== undefined) {
    return user;
  }

  const userRes = await supabase.auth.getUser();
  if (userRes.error) {
    throw userRes.error;
  }

  storage.set('user', userRes.data.user);
  return userRes.data.user;
};

const handler: PlasmoMessaging.MessageHandler<
  void,
  { user: AuthUser }
> = async (_req, res) => {
  res.send({ user: await getUser() });
};

export default handler;
