import { css } from '@emotion/react';
import { Button, Text } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import brandIcon from 'data-base64:assets/icon.svg';
import type { FC } from 'react';

import { useUserInfo } from '@/lib/useUserInfo';

export const Popup: FC = () => {
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
            display: flex;
            flex: 1;
            gap: 32px;
            align-items: center;
            justify-content: center;
          `}
        >
          <div>
            <img src={brandIcon} alt="" width={96} height={96} />
          </div>
          <div>
            <h1
              css={css`
                margin: 0;
                font-family: Raleway, sans-serif;
                font-size: 2rem;
              `}
            >
              ReadStack
            </h1>
            <p
              css={css`
                margin: 0;
                font-size: 1rem;
              `}
            >
              技術記事の未読消化をサポート
            </p>
          </div>
        </div>
        {isLoading && <div>読み込み中...</div>}
        {!isLoading && userInfo && (
          <Text>
            <Text component="span" fw="bold">
              {userInfo.displayName}
            </Text>
            としてログインしています
          </Text>
        )}
        {!isLoading && !userInfo && (
          <>
            <Button
              leftIcon={<IconExternalLink size="0.9rem" />}
              onClick={() =>
                window.open(`${process.env.PLASMO_PUBLIC_APP_URL}/login`)
              }
            >
              認証する
            </Button>
            <Text size="xs">ReadStackのサイトに移動します</Text>
          </>
        )}
      </div>
    </>
  );
};
