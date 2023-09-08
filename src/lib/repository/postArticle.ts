import { apiBaseUrl } from '@/lib/util/const';

export type Article = {
  id: number;
  url: string;
  title: string;
  body: string;
  ogImageUrl: string | null;
  summary: string | null;
  createdAt: string;
};

export const postArticle = async (url: string) => {
  const res = await fetch(`${apiBaseUrl}/articles`, {
    method: 'POST',
    body: JSON.stringify({ url }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error('Failed to post article');
  }
  const data = (await res.json()) as Article;

  return data;
};
