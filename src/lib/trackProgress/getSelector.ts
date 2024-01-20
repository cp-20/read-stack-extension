// TODO: 他のサイトも対応する
export const getSelector = (url: string): string => {
  if (/https?:\/\/note.com\/[^/]+\/n\/[^/]+/.exec(url)) {
    return '.p-article__content';
  }

  if (/https?:\/\/qiita.com\/[^/]+\/items\/[^/]+/.exec(url)) {
    return 'section';
  }

  if (/https?:\/\/zenn.dev\/[^/]+\/articles\/[^/]+/.exec(url)) {
    return 'section';
  }

  return 'body';
};
