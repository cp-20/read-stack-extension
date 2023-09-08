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

export const postClip = async (userId: string, articleId: number) => {
  const res = await fetch(`${apiBaseUrl}/users/${userId}/clips`, {
    method: 'POST',
    body: JSON.stringify({ articleId }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error('Failed to post clip');
  }
  const data = (await res.json()) as Clip;

  return data;
};
