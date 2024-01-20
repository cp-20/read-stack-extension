import type { PlasmoMessaging } from '@plasmohq/messaging';

import { getMyInboxItems, type InboxItemWithArticle } from '@/lib/api/client';

const handler: PlasmoMessaging.MessageHandler<
  { url: string },
  InboxItemWithArticle | null
> = async (req, res) => {
  if (req.body === undefined) {
    res.send(null);
    return;
  }

  const { url } = req.body;
  const result = await getMyInboxItems({ url });
  if (!result.ok || result.data.items.length === 0) {
    res.send(null);
    return;
  }

  res.send(result.data.items[0]);
};

export default handler;
