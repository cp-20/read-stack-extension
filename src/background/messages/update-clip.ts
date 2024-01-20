import type { PlasmoMessaging } from '@plasmohq/messaging';

import { patchMyClip, type Clip } from '@/lib/api/client';

type PatchClip = Partial<{
  comment: string;
  status: 0 | 1 | 2;
  progress: number;
}>;

const handler: PlasmoMessaging.MessageHandler<
  { clipId: number; patch: PatchClip },
  Clip | null
> = async (req, res) => {
  if (req.body === undefined) {
    res.send(null);
    return;
  }

  const { clipId, patch } = req.body;

  const result = await patchMyClip({ clip: patch, clipId: clipId.toString() });

  if (result.ok) {
    res.send(result.data.clip);
  } else {
    res.send(null);
  }
};

export default handler;
