import type { PlasmoMessaging } from '@plasmohq/messaging';

import { postMyInboxItem, type InboxItemWithArticle } from '@/lib/api/client';

const handler: PlasmoMessaging.MessageHandler<
  { url: string },
  InboxItemWithArticle | null
> = async (req, res) => {
  if (req.body === undefined) {
    res.send(null);
    return;
  }

  const { url } = req.body;

  const result = await postMyInboxItem({
    type: 'url',
    articleUrl: url,
  });
  if (!result.ok) {
    res.send(null);
    return;
  }

  res.send(result.data.item);
};

export default handler;
