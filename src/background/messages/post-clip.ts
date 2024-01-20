import type { PlasmoMessaging } from '@plasmohq/messaging';

import { postMyClip, type ClipWithArticle } from '@/lib/api/client';

const handler: PlasmoMessaging.MessageHandler<
  { url: string },
  ClipWithArticle | null
> = async (req, res) => {
  if (req.body === undefined) {
    res.send(null);
    return;
  }

  const { url } = req.body;

  const result = await postMyClip({
    type: 'url',
    articleUrl: url,
  });
  if (!result.ok) {
    res.send(null);
    return;
  }

  res.send(result.data.clip);
};

export default handler;
