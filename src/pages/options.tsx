import { css } from '@emotion/react';
import { Stack } from '@mantine/core';
import type { FC } from 'react';

import { Banner } from '@/components/Banner';
import { ImportFromBookmarks } from '@/components/Importer/ImportFromBookmarks';
import { ImportFromText } from '@/components/Importer/ImportFromText';
import { Settings } from '@/components/Settings';
import { Layout } from '@/layout';

export const Options: FC = () => {
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
        <Stack spacing="xl">
          <Banner />
          <Settings />
          <Stack spacing="md">
            <ImportFromBookmarks />
            <ImportFromText />
          </Stack>
        </Stack>
      </div>
    </Layout>
  );
};
