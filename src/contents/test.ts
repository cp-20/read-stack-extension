import type { PlasmoCSConfig } from 'plasmo';

export const config: PlasmoCSConfig = {
  matches: ['https://qiita.com/*', 'https://zenn.dev/*', 'https://note.com/*'],
  run_at: 'document_start',
  world: 'MAIN',
  all_frames: true,
};

console.log('contents_script test');

window.mainMessage = 'hello from contents_script test';
