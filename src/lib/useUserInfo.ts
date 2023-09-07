import useSWR from 'swr';

import { apiBaseUrl } from '@/lib/const';
import { fetcher } from '@/lib/fetcher';

type UserInfo = {
  id: string;
  email: string;
  name: string;
  displayName: string | null;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export const useUserInfo = () => {
  const { data, error } = useSWR<UserInfo>(apiBaseUrl + '/users/me', fetcher);

  return {
    userInfo: data,
    isLoading: !error && !data,
    isError: error,
  };
};
