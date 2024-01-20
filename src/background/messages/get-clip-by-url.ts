import type { PlasmoMessaging } from '@plasmohq/messaging';

import { getMyClips, type ClipWithArticle } from '@/lib/api/client';

const handler: PlasmoMessaging.MessageHandler<
  { url: string },
  ClipWithArticle | null
> = async (req, res) => {
  if (req.body === undefined) {
    res.send(null);
    return;
  }

  const { url } = req.body;
  const result = await getMyClips({ url });
  if (!result.ok || result.data.clips.length === 0) {
    res.send(null);
    return;
  }

  res.send(result.data.clips[0]);
};

export default handler;
