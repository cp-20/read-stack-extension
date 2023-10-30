import { css } from '@emotion/react';
import { Button, Flex, Space, Text } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import type { FC } from 'react';

import { Banner } from '@/components/Banner';
import { ImportFromBookmarks } from '@/components/ImportFromBookmarks';
import { Layout } from '@/layout';
import { useAuth } from '@/lib/core/useAuth';

export const Options: FC = () => {
  const { user, handleOAuthLogin, handleLogout } = useAuth();
  return (
    <Layout>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        `}
      >
        <Banner />

        <Space h="xl" />

        <Flex gap="0.25rem" align="center">
          <Text fw="bold">拡張機能のログイン状態</Text>
          {user ? <IconCheck color="green" /> : <IconX color="red" />}

          <div
            css={css`
              margin-left: 1rem;
            `}
          >
            {user ? (
              <Button variant="light" size="sm" onClick={handleLogout}>
                ログアウト
              </Button>
            ) : (
              <Button
                variant="light"
                size="sm"
                onClick={() => handleOAuthLogin('github')}
              >
                ログイン
              </Button>
            )}
          </div>
        </Flex>

        <Space h="xl" />

        <ImportFromBookmarks />
      </div>
    </Layout>
  );
};
