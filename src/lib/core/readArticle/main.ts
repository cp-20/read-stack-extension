import { getSelector } from '@/lib/core/getSelector';
import { setup, type SetupResult } from '@/lib/core/readArticle/setup';
import { setupScrollHandler } from '@/lib/core/readArticle/setupScrollHandler';

declare global {
  interface Window {
    cleanupScrollHandler?: () => void;
  }
}

const targetArticleUrlRegex = new RegExp(
  '^https://qiita.com/.+/items/.+$|^https://zenn.dev/.+/articles/.+$|^https://note.com/.+/n/.+$',
);

export const main = () => {
  const onload = (setupPromise: Promise<SetupResult>) => async () => {
    window.cleanupScrollHandler = await setupScrollHandler(setupPromise);
  };

  const mainSetup = async () => {
    if (!targetArticleUrlRegex.test(location.href)) return;

    const setupPromise = setup(getSelector(location.href));
    window.addEventListener('load', onload(setupPromise));
  };

  if (targetArticleUrlRegex.test(location.href)) {
    mainSetup();
  }

  console.log('main');

  const pushState = window.history.pushState;
  window.history.pushState = (state, unused, url) => {
    window.console.log('pushState', state, unused, url);

    pushState(state, unused, url);
    window.cleanupScrollHandler?.();
    mainSetup();
  };
};
