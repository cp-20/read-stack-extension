import { Anchor, Text, Textarea } from '@mantine/core';

import { useStorage } from '@plasmohq/storage/hook';

import { def } from '@/components/Settings/common';

export const useArticleUrlGlobs = () => {
  const [articleUrlGlobs, setArticleUrlGlobs] = useStorage<string[]>(
    'article-url-globs',
    def([
      'https://zenn.dev/*/articles/*',
      'https://qiita.com/*/items/*',
      'https://note.com/*/n/*',
    ]),
  );

  return [articleUrlGlobs, setArticleUrlGlobs] as const;
};

export const SettingsUrlGlobs = () => {
  const [articleUrlGlobs, setArticleUrlGlobs] = useArticleUrlGlobs();

  return (
    <div>
      <Textarea
        label="自動的に記録する記事のURL (Globパターン)"
        description="このいずれかにマッチするURLのページを自動的に受信箱に保存します。"
        autosize
        minRows={3}
        maxRows={20}
        value={articleUrlGlobs.join('\n')}
        onChange={(e) => {
          setArticleUrlGlobs(e.target.value.split('\n'));
        }}
      />
      <Text size="xs">
        <Anchor
          href="https://github.com/micromatch/picomatch?tab=readme-ov-file#globbing-features"
          target="_blank"
          rel="noopener noreferrer"
        >
          対応しているGlobパターンの詳細
        </Anchor>
      </Text>
    </div>
  );
};
