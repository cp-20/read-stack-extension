import { css } from '@emotion/react';
import { Button, Flex, Loader, Text } from '@mantine/core';
import { IconCheck, IconExternalLink, IconX } from '@tabler/icons-react';
import type { FC } from 'react';

import { Banner } from '@/components/Banner';
import { useAuth } from '@/lib/core/useAuth';
import { useUserInfo } from '@/lib/core/useUserInfo';

export const Popup: FC = () => {
  const { user } = useAuth();
  const { userInfo, isLoading } = useUserInfo();

  return (
    <>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          gap: 32px;
          width: 480px;
          min-height: 100vh;
          padding: 32px;
        `}
      >
        <div
          css={css`
            flex: 1;
          `}
        >
          <Banner />
        </div>
        <div>
          <Flex gap="0.25rem" align="center">
            <Text fw="bold">拡張機能のログイン状態</Text>
            {user ? <IconCheck color="green" /> : <IconX color="red" />}
            {!user && (
              <Button
                ml="lg"
                variant="light"
                size="xs"
                leftIcon={<IconExternalLink size="0.9rem" />}
                onClick={() => {
                  window.open(
                    `chrome-extension://${process.env.PLASMO_PUBLIC_CRX_ID}/options.html`,
                  );
                }}
              >
                認証する
              </Button>
            )}
          </Flex>
          {user && (
            <Text color="dimmed" size="sm">
              <Text component="span" fw="bold">
                {user.email}
              </Text>
              としてログインしています
            </Text>
          )}
        </div>

        <div>
          <Flex gap="0.25rem" align="center">
            <Text fw="bold">アプリのログイン状態</Text>
            {!isLoading ? (
              userInfo ? (
                <IconCheck color="green" />
              ) : (
                <IconX color="red" />
              )
            ) : (
              <Loader size="xs" />
            )}
            {!isLoading && !userInfo && (
              <Button
                ml="lg"
                variant="light"
                size="xs"
                leftIcon={<IconExternalLink size="0.9rem" />}
                onClick={() =>
                  window.open(`${process.env.PLASMO_PUBLIC_APP_URL}/login`)
                }
              >
                認証する
              </Button>
            )}
          </Flex>

          {!isLoading && userInfo && (
            <Text color="dimmed" size="sm">
              <Text component="span" fw="bold">
                {userInfo.displayName}
              </Text>
              としてログインしています
            </Text>
          )}
        </div>
      </div>
    </>
  );
};
