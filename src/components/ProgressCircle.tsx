import { css } from '@emotion/react';
import type { FC } from 'react';

// TODO: clip-pathとかを使ってなめらかにしたい

const createCircleStyle = (ratio: number) => {
  const overHalf = ratio > 0.5;

  return css`
    position: relative;
    z-index: 1;
    width: 36px;
    height: 36px;
    overflow: hidden;
    text-align: center;
    background-color: #22b8cf;
    border-radius: 50%;

    &::before,
    &::after {
      position: absolute;
      top: 0;
      display: block;
      width: 36px;
      height: 36px;
      content: '';
      transition: transform 0.05s;
    }

    &::before {
      left: -18px;
      z-index: 2;
      background-color: #c5f6fa;
      transform: rotate(${overHalf ? `${ratio * 360 - 180}deg` : '0deg'});
      transform-origin: right 18px;
    }

    &::after {
      left: 18px;
      z-index: 3;
      visibility: ${overHalf ? 'hidden' : 'visible'};
      background-color: ${overHalf ? '#22b8cf' : '#c5f6fa'};
      transition: ${overHalf ? 'none' : 'transform 0.05s'};
      transform: rotate(${overHalf ? '0deg' : `${ratio * 360}deg`});
      transform-origin: left 18px;
    }
  `;
};

const innerCircleStyle = css`
  position: absolute;
  top: 4px;
  left: 4px;
  z-index: 4;
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  background-color: #fff;
  border-radius: 50%;
`;

const rightMaskStyle = css`
  position: absolute;
  top: 0;
  left: 18px;
  z-index: 2;
  width: 18px;
  height: 36px;
  background-color: #22b8cf;
`;

type ProgressCircleProps = {
  children?: React.ReactNode;
  progress: number;
};

export const ProgressCircle: FC<ProgressCircleProps> = ({
  children,
  progress,
}) => (
  <div css={createCircleStyle(progress / 100)}>
    {progress > 50 && <div css={rightMaskStyle} />}
    <div css={innerCircleStyle}>{children}</div>
  </div>
);
