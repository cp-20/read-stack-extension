import { sendToContentScript } from '@plasmohq/messaging';

import { stripUrl } from '@/lib/utils/stripUrl';

export const saveToClip = async (tab: chrome.tabs.Tab) => {
  if (tab.url === undefined) return;

  const url = stripUrl(tab.url);

  sendToContentScript({
    name: 'save-to-clip',
    body: { url },
  });
};
