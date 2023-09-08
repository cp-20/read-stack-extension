import type { PlasmoMessaging } from '@plasmohq/messaging';

import { getUser } from '@/background/messages/get-user';
import type { Article, Clip } from '@/lib/repository/postClipWithArticle';
import { postClip } from '@/lib/repository/postClipWithArticle';

const handler: PlasmoMessaging.MessageHandler<
  { url: string },
  { article: Article; clip: Clip }
> = async (req, res) => {
  const { url } = req.body;

  try {
    const user = await getUser();
    const { article, clip } = await postClip(user.id, url);

    res.send({ article, clip });
  } catch (err) {
    console.error(err);
  }
};

export default handler;
