import { useCallback } from 'react';

import { sendToBackground } from '@plasmohq/messaging';

import type { ClipPatch } from '@/background/messages/update-clip';
import type { Clip } from '@/lib/api/client';

export const useUpdateClip = () => {
  const updateClip = useCallback(async (clipId: number, patch: ClipPatch) => {
    try {
      const res: Clip = await sendToBackground({
        name: 'update-clip',
        body: { clipId, patch },
      });

      return res;
    } catch (error) {
      return { success: false } as const;
    }
  }, []);

  return { updateClip };
};
