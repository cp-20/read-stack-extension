import type { PlasmoCSConfig } from 'plasmo';

import { main } from '@/lib/core/readArticle/main';

export const config: PlasmoCSConfig = {
  matches: ['https://qiita.com/*', 'https://zenn.dev/*', 'https://note.com/*'],
  run_at: 'document_start',
};

main();

console.log('contents_script');

const pushState = window.history.pushState;
window.history.pushState = (state, unused, url) => {
  window.console.log('pushState', state, unused, url);

  pushState(state, unused, url);
  window.cleanupScrollHandler?.();
};

declare global {
  interface Window {
    mainMessage?: string;
  }
}

window.mainMessage = 'hello from contents_script';

fetch('https://qiita.com/api/v2/items/1e8e8d9e484b7f2a3b5e');
