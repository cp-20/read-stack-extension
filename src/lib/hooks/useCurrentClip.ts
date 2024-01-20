import { useEffect, useState } from 'react';

import type { ClipWithArticle } from '@/lib/api/client';
import { useCurrentUrl } from '@/lib/hooks/useCurrentUrl';
import { getClipByUrl } from '@/lib/messenger';
import { getSelector } from '@/lib/trackProgress/getSelector';
import { progress2scroll } from '@/lib/trackProgress/progressScrollConverter';

export const useCurrentClip = () => {
  const { currentUrl } = useCurrentUrl();
  const [currentClip, setCurrentClip] = useState<
    ClipWithArticle | null | undefined
  >(undefined);

  useEffect(() => {
    if (currentClip?.article.url === currentUrl) return;

    getClipByUrl(currentUrl).then((clip) => {
      setCurrentClip(clip);

      // 読み途中だった場合
      if (clip !== null && clip.status !== 2) {
        window.scrollTo(
          0,
          progress2scroll(getSelector(clip.article.url))(clip.progress),
        );
      }
    });
  }, [currentUrl, currentClip, setCurrentClip]);

  return { currentClip, setCurrentClip };
};
