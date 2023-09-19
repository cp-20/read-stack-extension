import { sendToBackground } from '@plasmohq/messaging';

import { getSelector } from '@/lib/core/getSelector';
import { judgeStatus } from '@/lib/core/judgeStatus';
import { scroll2progress } from '@/lib/core/progressScrollConverter';
import type { SetupResult } from '@/lib/core/readArticle/setup';
import type { Clip } from '@/lib/repository/postClipWithArticle';
import type { PatchClipData } from '@/lib/repository/updateClip';

export const setupScrollHandler = async (
  setupPromise: Promise<SetupResult>,
) => {
  const selector = getSelector(location.href);
  const { user, clip } = await setupPromise;

  let timeout: NodeJS.Timeout;

  const handleScroll = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      const progress = Math.round(scroll2progress(selector)(window.scrollY));
      const status = judgeStatus(progress);
      sendToBackground<
        { userId: string; clipId: number; patch: Partial<PatchClipData> },
        Clip
      >({
        name: 'update-clip',
        body: {
          userId: user.id,
          clipId: clip.id,
          patch: { status, progress },
        },
      });
    }, 100);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
};
