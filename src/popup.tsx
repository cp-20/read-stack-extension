import type { FC } from 'react';

import { Layout } from '@/layout';
import { Popup } from '@/pages/popup';

const IndexPopup: FC = () => {
  return (
    <>
      <Layout>
        <Popup />
      </Layout>
    </>
  );
};

export default IndexPopup;
