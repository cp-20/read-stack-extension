import { useCallback } from 'react';

import { sendToBackground } from '@plasmohq/messaging';

import type { ClipWithArticle } from '@/lib/api/client';

export const usePostClip = () => {
  const postClip = useCallback(async () => {
    try {
      const activeTabs = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      const url = activeTabs[0].url;
      const clip: ClipWithArticle | null = await sendToBackground({
        name: 'post-clip',
        body: { url },
      });

      return clip;
    } catch (error) {
      return null;
    }
  }, []);

  return { postClip };
};
