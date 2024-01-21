import type { ClipWithArticle, InboxItemWithArticle } from '@/lib/api/client';
import {
  getClipByUrl,
  getInboxItemByUrl,
  moveInboxItemToClip,
  postClip,
  postInboxItem,
} from '@/lib/messenger';

export type SaveToFailureResult = {
  status: 'failure';
};

export type SaveToCanceledResult = {
  status: 'canceled';
};

export type SaveToClipSuccessResult = {
  status: 'success';
  type: 'clip';
  clip: ClipWithArticle;
};

export type SaveToInboxSuccessResult = {
  status: 'success';
  type: 'inbox-item';
  item: InboxItemWithArticle;
};

export type SaveToClipResult =
  | SaveToClipSuccessResult
  | SaveToFailureResult
  | SaveToCanceledResult;
export type SaveToInboxItemResult =
  | SaveToInboxSuccessResult
  | SaveToFailureResult
  | SaveToCanceledResult;

export const saveToClip = async (url: string): Promise<SaveToClipResult> => {
  const clip = await getClipByUrl(url);
  if (clip !== null) return { status: 'canceled' };

  const item = await getInboxItemByUrl(url);

  if (item !== null) {
    const clip = await moveInboxItemToClip(item.id);
    if (clip === null) return { status: 'failure' };

    const newClip = { ...clip, article: item.article };
    return {
      status: 'success',
      type: 'clip',
      clip: newClip,
    };
  }

  const newClip = await postClip(url);
  if (newClip === null) return { status: 'failure' };

  return {
    status: 'success',
    type: 'clip',
    clip: newClip,
  };
};

export const saveToInboxItem = async (
  url: string,
): Promise<SaveToInboxItemResult> => {
  const item = await getInboxItemByUrl(url);
  if (item !== null) return { status: 'canceled' };

  const clip = await getClipByUrl(url);
  if (clip !== null) return { status: 'canceled' };

  const newItem = await postInboxItem(url);
  if (newItem === null) return { status: 'failure' };

  return {
    status: 'success',
    type: 'inbox-item',
    item: newItem,
  };
};
