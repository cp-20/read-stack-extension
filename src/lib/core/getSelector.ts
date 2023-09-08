// TODO: 他のサイトも対応する
export const getSelector = (url: string): string => {
  const host = new URL(url).host;

  const selectors = {
    'qiita.com': 'section',
    'zenn.dev': 'section',
    'note.com': '.p-article__content',
  };

  return selectors[host];
};
