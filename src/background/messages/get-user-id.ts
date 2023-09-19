import type { PlasmoMessaging } from '@plasmohq/messaging';
import { Storage } from '@plasmohq/storage';

import { getUserInfo } from '@/lib/repository/getUserInfo';

export const storage = new Storage({
  area: 'session',
});

export const getUserId = async () => {
  const userId = await storage.get<string | undefined>('userId');
  if (userId !== undefined) {
    return userId;
  }

  const { id: newUserId } = await getUserInfo();
  storage.set('userId', newUserId);
  return newUserId;
};

const handler: PlasmoMessaging.MessageHandler<
  void,
  { userId: string }
> = async (_req, res) => {
  res.send({ userId: await getUserId() });
};

export default handler;
