import type { PlasmoCSConfig } from 'plasmo';

import { sendToBackground } from '@plasmohq/messaging';

import { getSelector } from '@/lib/core/getSelector';
import { judgeStatus } from '@/lib/core/judgeStatus';
import {
  progress2scroll,
  scroll2progress,
} from '@/lib/core/progressScrollConverter';
import type { UserInfo } from '@/lib/repository/getUserInfo';
import type { Article } from '@/lib/repository/postArticle';
import type { Clip } from '@/lib/repository/postClip';
import type { PatchClipData } from '@/lib/repository/updateClip';

export const config: PlasmoCSConfig = {
  matches: [
    'https://qiita.com/*/items/*',
    'https://zenn.dev/*/articles/*',
    'https://note.com/*/n/*',
  ],
};

window.addEventListener('load', async () => {
  const userInfo = await sendToBackground<void, UserInfo>({
    name: 'get-user-info',
  });

  const { clip } = await sendToBackground<
    { userId: string; url: string },
    { article: Article; clip: Clip }
  >({
    name: 'setup-clip',
    body: { userId: userInfo.id, url: location.href },
  });

  const selector = getSelector(location.href);

  // 読み途中だった場合
  if (clip.status === 1) {
    window.scrollTo(0, progress2scroll(selector)(clip.progress));
  }

  let timeout: NodeJS.Timeout;
  window.addEventListener(
    'scroll',
    () => {
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
            userId: userInfo.id,
            clipId: clip.id,
            patch: { status, progress },
          },
        });
      }, 200);
    },
    { passive: true },
  );
});
