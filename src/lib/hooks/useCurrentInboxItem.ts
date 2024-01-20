import { useEffect, useState } from 'react';

import type { InboxItemWithArticle } from '@/lib/api/client';
import { useCurrentUrl } from '@/lib/hooks/useCurrentUrl';
import { getInboxItemByUrl } from '@/lib/messenger';

export const useCurrentInboxItem = () => {
  const { currentUrl } = useCurrentUrl();
  const [currentItem, setCurrentItem] = useState<
    InboxItemWithArticle | null | undefined
  >(undefined);

  useEffect(() => {
    if (currentItem?.article.url === currentUrl) return;

    getInboxItemByUrl(currentUrl).then((clip) => {
      setCurrentItem(clip);
    });
  }, [currentUrl, currentItem, setCurrentItem]);

  return { currentItem, setCurrentItem };
};
