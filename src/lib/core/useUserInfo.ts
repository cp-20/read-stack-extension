import useSWR from 'swr';

import type { UserInfo } from '@/lib/repository/getUserInfo';
import { apiBaseUrl } from '@/lib/util/const';

export const useUserInfo = () => {
  const { data, isLoading } = useSWR<UserInfo>(
    `${apiBaseUrl}/users/me`,
    (url: string) => fetch(url).then((r) => (r.ok ? r.json() : null)),
  );

  return {
    userInfo: data,
    isLoading,
  };
};
