import { sendToBackground } from '@plasmohq/messaging';

import type { ClipPatch } from '@/background/messages/update-clip';
import type {
  Clip,
  ClipWithArticle,
  InboxItemWithArticle,
} from '@/lib/api/client';

export const deleteClip = async (clipId: number) => {
  const clip: Clip | null = await sendToBackground({
    name: 'delete-clip',
    body: { clipId },
  });
  return clip;
};

export const getBookmarks = async () => {
  const bookmarks: chrome.bookmarks.BookmarkTreeNode[] = await sendToBackground(
    {
      name: 'get-bookmarks',
    },
  );

  return bookmarks;
};

export const getClipByUrl = async (url: string) => {
  const clip: ClipWithArticle | null = await sendToBackground({
    name: 'get-clip-by-url',
    body: { url },
  });

  return clip;
};

export const getInboxItemByUrl = async (url: string) => {
  const item: InboxItemWithArticle | null = await sendToBackground({
    name: 'get-inbox-item-by-url',
    body: { url },
  });

  return item;
};

export const getUser = async () => {
  const { user } = await sendToBackground({
    name: 'get-user',
    body: {},
  });

  return user;
};
export const moveInboxItemToClip = async (itemId: number) => {
  const clip: Clip | null = await sendToBackground({
    name: 'move-inbox-item-to-clip',
    body: { itemId },
  });

  return clip;
};

export const postClip = async (url: string) => {
  const clip: ClipWithArticle | null = await sendToBackground({
    name: 'post-clip',
    body: { url },
  });

  return clip;
};

export const postInboxItem = async (url: string) => {
  const item: InboxItemWithArticle | null = await sendToBackground({
    name: 'post-inbox-item',
    body: { url },
  });

  return item;
};

export const updateClip = async (clipId: number, patch: ClipPatch) => {
  const clip: Clip | null = await sendToBackground({
    name: 'update-clip',
    body: { clipId, patch },
  });

  return clip;
};
