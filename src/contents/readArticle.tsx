import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import type { PlasmoCSConfig, PlasmoGetStyle } from 'plasmo';

import { ArticleOverlayTip } from '@/components/ArticleOverlayTip';

export const config: PlasmoCSConfig = {
  matches: ['<all_urls>'],
  run_at: 'document_start',
};

const styleElement = document.createElement('style');

const styleCache = createCache({
  key: 'plasmo-emotion-cache',
  prepend: true,
  container: styleElement,
});

export const getStyle: PlasmoGetStyle = () => styleElement;

const Content = () => {
  return (
    <CacheProvider value={styleCache}>
      <ArticleOverlayTip />
    </CacheProvider>
  );
};

export default Content;
