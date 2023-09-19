import type { Clip } from '@/lib/repository/postClip';
import { apiBaseUrl } from '@/lib/util/const';

export type PatchClipData = {
  status: number;
  progress: number;
  comment: string | null;
};

export const updateClip = async (
  userId: string,
  clipId: number,
  patch: Partial<PatchClipData>,
) => {
  const res = await fetch(`${apiBaseUrl}/users/${userId}/clips/${clipId}`, {
    method: 'PATCH',
    body: JSON.stringify({ clip: patch }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error('Failed to update clip');
  }
  const data = (await res.json()) as Clip;

  return data;
};
