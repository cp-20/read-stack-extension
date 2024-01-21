import { css } from '@emotion/react';
import {
  Button,
  Flex,
  Modal,
  Progress,
  Space,
  Text,
  type ModalProps,
} from '@mantine/core';
import type { ComponentPropsWithoutRef, FC } from 'react';

import type {
  SaveToClipResult,
  SaveToInboxItemResult,
} from '@/lib/importer/saveTo';

export type ProcessingResult = {
  lastResult: SaveToClipResult | SaveToInboxItemResult | null;
  resultCount: number;
  successCount: number;
  failureCount: number;
  canceledCount: number;
  totalCount: number;
};

type ProcessingImportModalProps = {
  result: ProcessingResult;
} & ModalProps &
  ComponentPropsWithoutRef<'div'>;

export const ProcessingImportModal: FC<ProcessingImportModalProps> = ({
  result,
  onClose,
  ...props
}) => {
  return (
    <Modal centered withCloseButton={false} onClose={() => void 0} {...props}>
      <div>
        <Text fz="lg">インポート中...</Text>
        <Space h="md" />
        <div>
          <Progress value={(result.resultCount / result.totalCount) * 100} />
          <Text
            fz="sm"
            css={css`
              display: flex;
              justify-content: space-between;
            `}
            mt="xs"
          >
            <span>
              {result.resultCount} / {result.totalCount}
            </span>
            <span>
              成功: {result.successCount} / 失敗: {result.failureCount} /
              キャンセル: {result.canceledCount}
            </span>
          </Text>
          {result.lastResult !== null &&
            result.lastResult.status === 'success' &&
            result.resultCount < result.totalCount && (
              <Text fz="sm" mt="xs" h="3rem" lineClamp={2}>
                「
                {result.lastResult.type === 'clip'
                  ? result.lastResult.clip.article.title
                  : result.lastResult.item.article.title}
                」 を処理しました
              </Text>
            )}
          {result.resultCount === result.totalCount && (
            <Text fz="sm" mt="xs">
              インポートが完了しました
            </Text>
          )}
        </div>
        {result.resultCount === result.totalCount && (
          <Flex justify="end" mt="md">
            <Button onClick={onClose}>閉じる</Button>
          </Flex>
        )}
      </div>
    </Modal>
  );
};
