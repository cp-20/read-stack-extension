import type { PlasmoMessaging } from '@plasmohq/messaging';

import { getUserInfo } from '@/lib/repository/getUserInfo';
import type { UserInfo } from '@/lib/repository/getUserInfo';

const handler: PlasmoMessaging.MessageHandler<void, UserInfo> = async (
  _req,
  res,
) => {
  const userInfo = await getUserInfo();

  res.send(userInfo);
};

export default handler;
