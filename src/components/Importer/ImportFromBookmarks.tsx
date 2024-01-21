import { css } from '@emotion/react';
import { Button, Flex, Modal, Select, Space } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconDatabaseImport } from '@tabler/icons-react';
import { useCallback, useEffect, useState, type FC } from 'react';

import { BookMarkTreeNodeList } from '@/components/Importer/BookMarkTreeNodeList';
import {
  saveToClip,
  saveToInboxItem,
  type SaveToClipResult,
  type SaveToInboxItemResult,
} from '@/lib/importer/saveTo';
import { getBookmarks } from '@/lib/messenger';
import { processConcurrently } from '@/lib/utils/processConcurrently';

import {
  ProcessingImportModal,
  type ProcessingResult,
} from './ProcessingImportModal';
import { useCheckedBookmarksAtom } from './useCheckedBookmarks';

const flatBookmarks = (
  bookmarks: chrome.bookmarks.BookmarkTreeNode[],
): chrome.bookmarks.BookmarkTreeNode[] =>
  bookmarks.flatMap((node) =>
    [node].concat(node.children ? flatBookmarks(node.children) : []),
  );

export const ImportFromBookmarks: FC = () => {
  const [open, handlers] = useDisclosure(false);
  const { checkedBookmarks } = useCheckedBookmarksAtom();
  const [bookmarks, setBookmarks] = useState<
    chrome.bookmarks.BookmarkTreeNode[]
  >([]);

  const [target, setTarget] = useState<'clip' | 'inbox'>('clip');
  const [loading, setLoading] = useState(false);
  const [processingOpen, processingHandlers] = useDisclosure(false);
  const [processingResult, setProcessingResult] = useState<ProcessingResult>({
    lastResult: null,
    totalCount: 0,
    resultCount: 0,
    successCount: 0,
    failureCount: 0,
    canceledCount: 0,
  });

  const handleImport = useCallback(async () => {
    setLoading(true);
    const urls = flatBookmarks(bookmarks)
      .filter((node) => checkedBookmarks.includes(node.id))
      .map((node) => node.url)
      .filter(Boolean) as string[];

    processingHandlers.open();
    setProcessingResult({
      lastResult: null,
      totalCount: urls.length,
      resultCount: 0,
      successCount: 0,
      failureCount: 0,
      canceledCount: 0,
    });
    const doneCallback = (result: SaveToClipResult | SaveToInboxItemResult) => {
      setProcessingResult((prev) => ({
        ...prev,
        lastResult: result,
        resultCount: prev.resultCount + 1,
        successCount:
          result.status === 'success'
            ? prev.successCount + 1
            : prev.successCount,
        failureCount:
          result.status === 'failure'
            ? prev.failureCount + 1
            : prev.failureCount,
        canceledCount:
          result.status === 'canceled'
            ? prev.canceledCount + 1
            : prev.canceledCount,
      }));
    };
    if (target === 'clip') {
      const promises = urls.map((url) => () => saveToClip(url));
      await processConcurrently(promises, 10, doneCallback);
    } else {
      const promises = urls.map((url) => () => saveToInboxItem(url));
      await processConcurrently(promises, 10, doneCallback);
    }

    setLoading(false);
  }, [bookmarks, checkedBookmarks, processingHandlers, target]);

  const closeProcessingModal = useCallback(() => {
    processingHandlers.close();
    handlers.close();
  }, [processingHandlers, handlers]);

  useEffect(() => {
    getBookmarks().then((bookmarks) => setBookmarks(bookmarks));
  }, []);

  return (
    <>
      <Button
        variant="light"
        onClick={handlers.open}
        rightIcon={<IconDatabaseImport />}
      >
        ブックマークからインポートする
      </Button>
      <Modal
        opened={open}
        centered
        onClose={handlers.close}
        title="ブックマークからインポート"
        size="xl"
      >
        <div>
          <div
            css={css`
              margin-left: -1.5rem;
            `}
          >
            {bookmarks[0]?.children && (
              <BookMarkTreeNodeList nodes={bookmarks[0].children} />
            )}
          </div>

          <Select
            label="インポート先"
            data={[
              { value: 'inbox', label: '受信箱' },
              { value: 'clip', label: 'スタック' },
            ]}
            value={target}
            onChange={(value) => setTarget(value !== 'clip' ? 'inbox' : 'clip')}
          />

          <Space h="md" />

          <Flex justify="end" gap={8}>
            <Button variant="outline" onClick={handlers.close}>
              キャンセル
            </Button>
            <Button
              onClick={handleImport}
              loading={loading}
              rightIcon={<IconDatabaseImport />}
            >
              インポート
            </Button>
          </Flex>
        </div>
      </Modal>
      <ProcessingImportModal
        result={processingResult}
        opened={processingOpen}
        onClose={closeProcessingModal}
      />
    </>
  );
};
