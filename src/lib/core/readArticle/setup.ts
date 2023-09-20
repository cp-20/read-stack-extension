import type { AuthUser } from '@supabase/supabase-js';

import { sendToBackground } from '@plasmohq/messaging';

import { progress2scroll } from '@/lib/core/progressScrollConverter';
import type { Clip } from '@/lib/repository/postClipWithArticle';

export type SetupResult = { user: AuthUser; clip: Clip };

export const setup = async (selector: string): Promise<SetupResult> => {
  const { user } = await sendToBackground({
    name: 'get-user',
  });
  const { clip } = await sendToBackground({
    name: 'setup-clip',
    body: { url: location.href },
  });
  // 読み途中だった場合
  if (clip.status === 1) {
    window.scrollTo(0, progress2scroll(selector)(clip.progress));
  }
  return { user, clip };
};
