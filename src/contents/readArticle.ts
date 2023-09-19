import type { PlasmoCSConfig } from 'plasmo';

import { main } from '@/lib/core/readArticle/main';

export const config: PlasmoCSConfig = {
  matches: ['https://qiita.com/*', 'https://zenn.dev/*', 'https://note.com/*'],
  run_at: 'document_start',
};

main();
