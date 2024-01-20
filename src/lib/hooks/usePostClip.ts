import { useCallback } from 'react';

import { postClip } from '@/lib/messenger';

export const usePostClip = () => {
  const postClipHandler = useCallback(async () => {
    try {
      const activeTabs = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      const url = activeTabs[0].url;
      if (url === undefined) return null;

      const clip = await postClip(url);

      return clip;
    } catch (error) {
      return null;
    }
  }, []);

  return { postClip: postClipHandler };
};
