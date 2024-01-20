import type { PlasmoMessaging } from '@plasmohq/messaging';

import { deleteMyClip, type Clip } from '@/lib/api/client';

const handler: PlasmoMessaging.MessageHandler<
  { clipId: number },
  Clip | null
> = async (req, res) => {
  if (req.body === undefined) {
    res.send(null);
    return;
  }

  const { clipId } = req.body;

  const result = await deleteMyClip({ clipId: clipId.toString() });

  if (result.ok) {
    res.send(result.data.clip);
  } else {
    res.send(null);
  }
};

export default handler;
