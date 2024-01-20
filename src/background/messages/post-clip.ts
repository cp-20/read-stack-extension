import type { PlasmoMessaging } from '@plasmohq/messaging';

import { postMyClip, type ClipWithArticle } from '@/lib/api/client';

export type PostClipSuccessResponse = { success: true; clip: ClipWithArticle };
export type PostClipErrorResponse = { success: false };

export type PostClipResponse = PostClipSuccessResponse | PostClipErrorResponse;

const handler: PlasmoMessaging.MessageHandler<
  { url: string },
  PostClipResponse
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
