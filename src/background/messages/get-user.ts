import type { AuthUser } from '@supabase/supabase-js';

import type { PlasmoMessaging } from '@plasmohq/messaging';

import { storage } from '@/background/messages/init-session';

export const getUser = () => storage.get<AuthUser>('user');

const handler: PlasmoMessaging.MessageHandler<
  void,
  { user: AuthUser }
> = async (_req, res) => {
  res.send({ user: await getUser() });
};

export default handler;
