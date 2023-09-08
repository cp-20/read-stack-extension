import { apiBaseUrl } from '@/lib/util/const';

export type UserInfo = {
  id: string;
  email: string;
  name: string;
  displayName: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export const getUserInfo = async () => {
  const res = await fetch(`${apiBaseUrl}/users/me`);
  if (!res.ok) {
    return null;
  }

  const data = (await res.json()) as UserInfo;

  return data;
};
