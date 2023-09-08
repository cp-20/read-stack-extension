import useSWR from 'swr';

import type { UserInfo } from '@/lib/repository/getUserInfo';
import { fetcher } from '@/lib/swr/fetcher';
import { apiBaseUrl } from '@/lib/util/const';

export const useUserInfo = () => {
  const { data, error } = useSWR<UserInfo>(`${apiBaseUrl}/users/me`, fetcher);

  return {
    userInfo: data,
    isLoading: !error && !data,
    isError: error,
  };
};
