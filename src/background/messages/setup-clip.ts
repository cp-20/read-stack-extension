import type { PlasmoMessaging } from '@plasmohq/messaging';

import { postMyClip, type Clip } from '@/lib/api/client';

type SuccessResponse = { success: true; clip: Clip };
type ErrorResponse = { success: false };

type Response = SuccessResponse | ErrorResponse;

const handler: PlasmoMessaging.MessageHandler<
  { url: string },
  Response
> = async (req, res) => {
  if (req.body === undefined) {
    res.send({ success: false });
    return;
  }

  const { url } = req.body;

  const result = await postMyClip({
    type: 'url',
    articleUrl: url,
  });
  if (!result.ok) {
    res.send({ success: false });
    return;
  }

  res.send({ success: true, clip: result.data.clip });
};

export default handler;
