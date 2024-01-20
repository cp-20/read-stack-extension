import type { PlasmoMessaging } from '@plasmohq/messaging';

import { moveMyInboxItemToClip, type Clip } from '@/lib/api/client';

const handler: PlasmoMessaging.MessageHandler<
  { itemId: number },
  Clip | null
> = async (req, res) => {
  if (req.body === undefined) {
    res.send(null);
    return;
  }

  const { itemId } = req.body;

  const result = await moveMyInboxItemToClip({ itemId: itemId.toString() });

  if (result.ok) {
    res.send(result.data.clip);
  } else {
    res.send(null);
  }
};

export default handler;
