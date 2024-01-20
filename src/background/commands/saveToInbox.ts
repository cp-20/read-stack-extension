import { postMyInboxItem } from '@/lib/api/client';

export const saveToInbox = async (tab: chrome.tabs.Tab) => {
  if (tab.url === undefined) return;
  const result = await postMyInboxItem({ type: 'url', articleUrl: tab.url });

  if (result.ok) {
    const item = result.data.item;
    chrome.notifications.create({
      type: 'basic',
      title: '記事を保存しました',
      iconUrl: './assets/icon.png',
      message: `${item.article.title}は正常に受信箱に保存されました`,
    });
  } else {
    chrome.notifications.create({
      type: 'basic',
      title: '記事の保存に失敗しました',
      iconUrl: './assets/icon.png',
      message: '受信箱への保存に失敗しました',
    });
  }
};
