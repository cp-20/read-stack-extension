import { useCallback } from 'react';

import { sendToBackground } from '@plasmohq/messaging';

import type { PostClipResponse } from '@/background/messages/post-clip';

export const usePostClip = () => {
  const postClip = useCallback(async () => {
    try {
      const activeTabs = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      const url = activeTabs[0].url;
      const res = await sendToBackground({
        name: 'post-clip',
        body: { url },
      });

      return res as PostClipResponse;
    } catch (error) {
      return { success: false } as const;
    }
  }, []);

  return { postClip };
};
