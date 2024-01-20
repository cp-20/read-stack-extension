import type { PlasmoMessaging } from '@plasmohq/messaging';

const handler: PlasmoMessaging.MessageHandler<
  void,
  chrome.bookmarks.BookmarkTreeNode[]
> = async (_req, res) => {
  chrome.bookmarks.getTree((tree) => {
    res.send(tree);
  });
};

export default handler;
