import { css } from '@emotion/react';
import type { FC } from 'react';

type CheckIconProps = {
  active: boolean;
};

export const CheckIcon: FC<CheckIconProps> = ({ active }) => (
  <span
    css={css`
      position: relative;
      top: -3px;
      display: block;
      width: 16px;
      height: 8px;
      border-bottom: 2px solid ${active ? '#22b8cf' : 'gray'};
      border-left: 2px solid ${active ? '#22b8cf' : 'gray'};
      transform: rotate(-45deg);
      animation: ${active
        ? '0.2s check forwards cubic-bezier(0, 2, 1, 1)'
        : 'none'};

      @keyframes check {
        0% {
          transform: scale(0) rotate(-45deg);
        }

        100% {
          transform: scale(1) rotate(-45deg);
        }
      }
    `}
  />
);
