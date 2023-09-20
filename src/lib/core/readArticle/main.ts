import { getSelector } from '@/lib/core/getSelector';
import { setup, type SetupResult } from '@/lib/core/readArticle/setup';
import { setupScrollHandler } from '@/lib/core/readArticle/setupScrollHandler';

const targetArticleUrlRegex = new RegExp(
  '^https://qiita.com/.+/items/.+$|^https://zenn.dev/.+/articles/.+$|^https://note.com/.+/n/.+$',
);

export const main = () => {
  let cleanupScrollHandler: () => void;
  const onload = (setupPromise: Promise<SetupResult>) => async () => {
    cleanupScrollHandler = await setupScrollHandler(setupPromise);
  };

  const mainSetup = async () => {
    if (!targetArticleUrlRegex.test(location.href)) return;

    const setupPromise = setup(getSelector(location.href));
    return setupPromise;
  };

  if (targetArticleUrlRegex.test(location.href)) {
    const setupPromise = mainSetup();
    window.addEventListener('load', onload(setupPromise));
  }

  window.addEventListener('pushstate', () => {
    cleanupScrollHandler?.();
    const setupPromise = mainSetup();
    onload(setupPromise)();
  });
};
