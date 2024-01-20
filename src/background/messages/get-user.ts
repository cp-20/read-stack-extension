import type { PlasmoMessaging } from '@plasmohq/messaging';

import { getMe, type User } from '@/lib/api/client';

const handler: PlasmoMessaging.MessageHandler<void, User | null> = async (
  _req,
  res,
) => {
  const result = await getMe({});
  if (result.ok) {
    res.send(result.data);
  } else {
    res.send(null);
  }
};

export default handler;
