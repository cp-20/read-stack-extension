import type { PlasmoMessaging } from '@plasmohq/messaging';

import { getUserId } from '@/background/messages/get-user-id';
import type { Article, Clip } from '@/lib/repository/postClipWithArticle';
import { postClip } from '@/lib/repository/postClipWithArticle';

const handler: PlasmoMessaging.MessageHandler<
  { url: string },
  { article: Article; clip: Clip }
> = async (req, res) => {
  const { url } = req.body;

  try {
    const userId = await getUserId();
    const { article, clip } = await postClip(userId, url);

    res.send({ article, clip });
  } catch (err) {
    console.error(err);
  }
};

export default handler;
