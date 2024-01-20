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

    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        primaryColor: 'cyan',
        fontFamily: `Noto Sans JP, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji`,
      }}
    >
      <div>{children}</div>
    </MantineProvider>
  </>
);
