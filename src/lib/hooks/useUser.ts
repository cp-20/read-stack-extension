import useSWR from 'swr';

import { sendToBackground } from '@plasmohq/messaging';

import type { User } from '@/lib/api/client';

const fetcher = async () => {
  const result = await sendToBackground({
    name: 'get-user',
  });
  return result as User;
};

export const useUser = () => {
  const { data, isLoading, error } = useSWR('/users/me', fetcher);

  return {
    user: data,
    error,
    isLoading,
  };
};
