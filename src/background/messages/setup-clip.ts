import type { PlasmoMessaging } from '@plasmohq/messaging';

import { postArticle, type Article } from '@/lib/repository/postArticle';
import { postClip, type Clip } from '@/lib/repository/postClip';

const handler: PlasmoMessaging.MessageHandler<
  { userId: string; url: string },
  { article: Article; clip: Clip }
> = async (req, res) => {
  const { userId, url } = req.body;

  try {
    const article = await postArticle(url);
    const clip = await postClip(userId, article.id);

    res.send({ article, clip });
  } catch (err) {
    console.error(err);
  }
};

export default handler;
