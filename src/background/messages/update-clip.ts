import type { PlasmoMessaging } from '@plasmohq/messaging';

import type { Clip } from '@/lib/repository/postClipWithArticle';
import { updateClip, type PatchClipData } from '@/lib/repository/updateClip';

const handler: PlasmoMessaging.MessageHandler<
  { userId: string; clipId: number; patch: Partial<PatchClipData> },
  Clip
> = async (req, res) => {
  const { userId, clipId, patch } = req.body;

  res.send(await updateClip(userId, clipId, patch));
};

export default handler;
