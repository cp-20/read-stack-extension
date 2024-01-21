import { css } from '@emotion/react';
import {
  ActionIcon,
  Button,
  Checkbox,
  Flex,
  Modal,
  Progress,
  Select,
  Space,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronRight, IconDatabaseImport } from '@tabler/icons-react';
import { useCallback, useEffect, useState, type FC } from 'react';

import {
  useCheckedBookmarks,
  useCheckedBookmarksAtom,
} from '@/components/useCheckedBookmarks';
import type { ClipWithArticle, InboxItemWithArticle } from '@/lib/api/client';
import {
  getBookmarks,
  getClipByUrl,
  getInboxItemByUrl,
  moveInboxItemToClip,
  postClip,
  postInboxItem,
} from '@/lib/messenger';
import { processConcurrently } from '@/lib/utils/processConcurrently';

type SaveToClipResult =
  | {
      status: 'success';
      type: 'clip';
      clip: ClipWithArticle;
    }
  | {
      status: 'failure';
    }
  | {
      status: 'canceled';
    };

const saveToClip = async (url: string): Promise<SaveToClipResult> => {
  const clip = await getClipByUrl(url);
  if (clip !== null) return { status: 'canceled' };

  const item = await getInboxItemByUrl(url);

  if (item !== null) {
    const clip = await moveInboxItemToClip(item.id);
    if (clip === null) return { status: 'failure' };

    const newClip = { ...clip, article: item.article };
    return {
      status: 'success',
      type: 'clip',
      clip: newClip,
    };
  }

  const newClip = await postClip(url);
  if (newClip === null) return { status: 'failure' };

  return {
    status: 'success',
    type: 'clip',
    clip: newClip,
  };
};

type SaveToInboxItemResult =
  | {
      status: 'success';
      type: 'inbox-item';
      item: InboxItemWithArticle;
    }
  | {
      status: 'failure';
    }
  | {
      status: 'canceled';
    };

const saveToInboxItem = async (url: string): Promise<SaveToInboxItemResult> => {
  const item = await getInboxItemByUrl(url);
  if (item !== null) return { status: 'canceled' };

  const clip = await getClipByUrl(url);
  if (clip !== null) return { status: 'canceled' };

  const newItem = await postInboxItem(url);
  if (newItem === null) return { status: 'failure' };

  return {
    status: 'success',
    type: 'inbox-item',
    item: newItem,
  };
};

type ProcessingResult = {
  lastResult: SaveToClipResult | SaveToInboxItemResult | null;
  resultCount: number;
  successCount: number;
  failureCount: number;
  canceledCount: number;
  totalCount: number;
};

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
      <Modal
        centered
        opened={processingOpen}
        onClose={() => void 0}
        withCloseButton={false}
      >
        <div>
          <Text fz="lg">インポート中...</Text>
          <Space h="md" />
          <div>
            <Progress
              value={
                (processingResult.resultCount / processingResult.totalCount) *
                100
              }
            />
            <Text
              fz="sm"
              css={css`
                display: flex;
                justify-content: space-between;
              `}
              mt="xs"
            >
              <span>
                {processingResult.resultCount} / {processingResult.totalCount}
              </span>
              <span>
                成功: {processingResult.successCount} / 失敗:{' '}
                {processingResult.failureCount} / キャンセル:{' '}
                {processingResult.canceledCount}
              </span>
            </Text>
            {processingResult.lastResult !== null &&
              processingResult.lastResult.status === 'success' &&
              processingResult.resultCount < processingResult.totalCount && (
                <Text fz="sm" mt="xs">
                  「
                  {processingResult.lastResult.type === 'clip'
                    ? processingResult.lastResult.clip.article.title
                    : processingResult.lastResult.item.article.title}
                  」 を処理しました
                </Text>
              )}
            {processingResult.resultCount === processingResult.totalCount && (
              <Text fz="sm" mt="xs">
                インポートが完了しました
              </Text>
            )}
          </div>
          {processingResult.resultCount === processingResult.totalCount && (
            <Flex justify="end" mt="md">
              <Button onClick={closeProcessingModal}>閉じる</Button>
            </Flex>
          )}
        </div>
      </Modal>
    </>
  );
};

const BookMarkTreeNodeList: FC<{
  nodes: chrome.bookmarks.BookmarkTreeNode[];
}> = ({ nodes }) => {
  return (
    <ul
      css={css`
        padding-left: 2.25rem;
      `}
    >
      {nodes.map((node) => (
        <BookMarkTreeNode key={node.id} node={node} />
      ))}
    </ul>
  );
};

const BookMarkTreeNode: FC<{
  node: chrome.bookmarks.BookmarkTreeNode;
}> = ({ node }) => {
  const { checked, indeterminate, toggle } = useCheckedBookmarks(node);
  const [isOpen, setIsOpen] = useState(false);

  const handleFolderClick = useCallback(() => {
    setIsOpen((isOpen) => !isOpen);
  }, []);

  const faviconUrl =
    node.url &&
    `http://www.google.com/s2/favicons?domain=${encodeURIComponent(node.url)}`;

  return (
    <li
      css={css`
        list-style: none;
      `}
    >
      <div
        css={css`
          display: flex;
          gap: 0.5rem;
          align-items: center;
        `}
      >
        <label
          css={css`
            display: flex;
            gap: 0.25rem;
            align-items: center;
          `}
        >
          <Checkbox
            checked={checked}
            indeterminate={indeterminate}
            onChange={toggle}
          />
          {node.children !== undefined && (
            <ActionIcon variant="transparent" onClick={handleFolderClick}>
              <IconChevronRight
                css={css`
                  transform: rotate(${isOpen ? '90deg' : '0deg'});
                `}
              />
            </ActionIcon>
          )}
          {faviconUrl && <img src={faviconUrl} alt="" />}
          <Text fz="sm">{node.title}</Text>
        </label>
      </div>
      {node.children !== undefined && isOpen && (
        <BookMarkTreeNodeList nodes={node.children} />
      )}
    </li>
  );
};
