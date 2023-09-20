import type { PlasmoCSConfig } from 'plasmo';

import { config as defaultConfig } from './readArticle';

export const config: PlasmoCSConfig = {
  ...defaultConfig,
  world: 'MAIN',
};

const pushState = window.history.pushState.bind(window.history);

window.history.pushState = (state, unused, url) => {
  pushState(state, unused, url);
  window.dispatchEvent(new Event('pushstate'));
};
