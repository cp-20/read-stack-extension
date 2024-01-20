import { useState } from 'react';

import { usePushStateHandler } from '@/lib/hooks/usePushStateHandler';
import { stripUrl } from '@/lib/utils/stripUrl';

export const useCurrentUrl = () => {
  const [currentUrl, setCurrentUrl] = useState(stripUrl(location.href));
  usePushStateHandler(() => {
    setCurrentUrl(stripUrl(location.href));
  }, true);
  return { currentUrl };
};
