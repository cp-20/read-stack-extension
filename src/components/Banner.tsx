import { css } from '@emotion/react';
import brandIcon from 'data-base64:assets/icon.svg';

export const Banner = () => (
  <div
    css={css`
      display: flex;
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
);
