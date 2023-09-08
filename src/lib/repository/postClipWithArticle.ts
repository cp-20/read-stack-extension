import { apiBaseUrl } from '@/lib/util/const';

export type Clip = {
  id: number;
  status: number;
  progress: number;
  comment: string | null;
  articleId: number;
  authorId: string;
  createdAt: string;
  updatedAt: string;
};

export type Article = {
  id: number;
  url: string;
  title: string;
  body: string;
  ogImageUrl: string | null;
  summary: string | null;
  createdAt: string;
};

export const postClip = async (userId: string, articleUrl: string) => {
  const res = await fetch(`${apiBaseUrl}/users/${userId}/clips`, {
    method: 'POST',
    body: JSON.stringify({
      type: 'url',
      articleUrl,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error('Failed to post clip');
  }
  const data = (await res.json()) as { article: Article; clip: Clip };

  return data;
};
