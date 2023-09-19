import { Button } from '@mantine/core';
import type { FC } from 'react';

import { useAuth } from '@/lib/core/useAuth';
import { useUserInfo } from '@/lib/core/useUserInfo';

export const Options: FC = () => {
  const { user, handleOAuthLogin, handleLogout } = useAuth();
  const { userInfo } = useUserInfo();
  return (
    <div>
      {userInfo && userInfo.name}
      {user ? (
        <Button onClick={handleLogout}>ログアウト</Button>
      ) : (
        <Button onClick={() => handleOAuthLogin('github')}>ログイン</Button>
      )}
    </div>
  );
};
