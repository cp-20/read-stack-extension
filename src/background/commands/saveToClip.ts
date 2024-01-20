import { postMyClip } from '@/lib/api/client';

export const saveToClip = async (tab: chrome.tabs.Tab) => {
  if (tab.url === undefined) return;
  const result = await postMyClip({ type: 'url', articleUrl: tab.url });

  if (result.ok) {
    const clip = result.data.clip;

    chrome.notifications.create({
      type: 'basic',
      title: '記事を保存しました',
      iconUrl: './assets/icon.png',
      message: `${clip.article.title}は正常にスタックに保存されました`,
    });
  } else {
    chrome.notifications.create({
      type: 'basic',
      title: '記事の保存に失敗しました',
      iconUrl: './assets/icon.png',
      message: 'スタックへの保存に失敗しました',
    });
  }
};
