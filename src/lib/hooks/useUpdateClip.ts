import { useCallback } from 'react';

import { sendToBackground } from '@plasmohq/messaging';

import type { PostClipResponse } from '@/background/messages/post-clip';
import type { ClipPatch } from '@/background/messages/update-clip';

export const useUpdateClip = () => {
  const updateClip = useCallback(async (clipId: number, patch: ClipPatch) => {
    try {
      const res = await sendToBackground({
        name: 'update-clip',
        body: { clipId, patch },
      });

      return res as PostClipResponse;
    } catch (error) {
      return { success: false } as const;
    }
  }, []);

  return { updateClip };
};
