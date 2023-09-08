import type { AuthUser } from '@supabase/supabase-js';
import type { PlasmoCSConfig } from 'plasmo';

import { sendToBackground } from '@plasmohq/messaging';

import { getSelector } from '@/lib/core/getSelector';
import { judgeStatus } from '@/lib/core/judgeStatus';
import {
  progress2scroll,
  scroll2progress,
} from '@/lib/core/progressScrollConverter';
import type { Article, Clip } from '@/lib/repository/postClipWithArticle';
import type { PatchClipData } from '@/lib/repository/updateClip';

export const config: PlasmoCSConfig = {
  matches: [
    'https://qiita.com/*/items/*',
    'https://zenn.dev/*/articles/*',
    'https://note.com/*/n/*',
  ],
};

const selector = getSelector(location.href);

const setup = async () => {
  const { user } = await sendToBackground<void, { user: AuthUser }>({
    name: 'get-user',
  });

  const { clip } = await sendToBackground<
    { url: string },
    { article: Article; clip: Clip }
  >({
    name: 'setup-clip',
    body: { url: location.href },
  });

  // 読み途中だった場合
  if (clip.status === 1) {
    window.scrollTo(0, progress2scroll(selector)(clip.progress));
  }

  return { user, clip };
};

const setupPromise = setup();

window.addEventListener('load', () => {
  setupPromise.then(({ user, clip }) => {
    let timeout: NodeJS.Timeout;
    window.addEventListener(
      'scroll',
      () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          const progress = Math.round(
            scroll2progress(selector)(window.scrollY),
          );
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
      },
      { passive: true },
    );
  });
});
