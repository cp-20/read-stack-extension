import { css } from '@emotion/react';
import { MantineProvider } from '@mantine/core';
import type { FC, ReactNode } from 'react';

export const Layout: FC<{ children?: ReactNode }> = ({ children }) => (
  <>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" />
    <link
      href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP&family=Raleway:wght@600&display=swap"
      rel="stylesheet"
    />

    <MantineProvider withGlobalStyles withNormalizeCSS>
      <div
        css={css`
          font-family: 'Noto Sans JP', sans-serif;
        `}
      >
        {children}
      </div>
    </MantineProvider>
  </>
);
