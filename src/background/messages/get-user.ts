import type { PlasmoMessaging } from '@plasmohq/messaging';

import { getMe, type User } from '@/lib/api/client';

const handler: PlasmoMessaging.MessageHandler<
  void,
  { user: User | null }
> = async (_req, res) => {
  const result = await getMe({});
  if (result.ok) {
    res.send({ user: result.data });
  } else {
    res.send({ user: null });
  }
};

export default handler;
