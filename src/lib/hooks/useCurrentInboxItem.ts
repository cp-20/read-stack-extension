import { useEffect, useState } from 'react';

import { sendToBackground } from '@plasmohq/messaging';

import { type InboxItemWithArticle } from '@/lib/api/client';
import { useCurrentUrl } from '@/lib/hooks/useCurrentUrl';

export const useCurrentInboxItem = () => {
  const { currentUrl } = useCurrentUrl();
  const [currentItem, setCurrentItem] = useState<
    InboxItemWithArticle | null | undefined
  >(undefined);

  useEffect(() => {
    if (currentItem?.article.url === currentUrl) return;

    sendToBackground({
      name: 'get-inbox-item-by-url',
      body: { url: currentUrl },
    }).then((clip: InboxItemWithArticle | null) => {
      setCurrentItem(clip);
    });
  }, [currentUrl, currentItem, setCurrentItem]);

  return { currentItem, setCurrentItem };
};
