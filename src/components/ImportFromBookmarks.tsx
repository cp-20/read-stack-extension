import { css } from '@emotion/react';
import { ActionIcon, Button, Checkbox, Flex, Modal, Text } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { useCallback, useEffect, useState, type FC } from 'react';

import { sendToBackground } from '@plasmohq/messaging';

import {
  useCheckedBookmarks,
  useCheckedBookmarksAtom,
} from '@/components/useCheckedBookmarks';

export const ImportFromBookmarks: FC = () => {
  const [open, setOpen] = useState(true);
  const { checkedBookmarks } = useCheckedBookmarksAtom();
  const [bookmarks, setBookmarks] = useState<
    chrome.bookmarks.BookmarkTreeNode[]
  >([]);

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleImport = () => {
    sendToBackground({
      name: 'import-bookmarks',
      bookmarks: bookmarks
        .filter((node) => checkedBookmarks.includes(node.id))
        .map((node) => node.url),
    }).then(() => {
      setOpen(false);
    });
  };

  useEffect(() => {
    sendToBackground({
      name: 'get-bookmarks',
    }).then((bookmarks: chrome.bookmarks.BookmarkTreeNode[]) => {
      setBookmarks(bookmarks);
    });
  }, []);

  return (
    <>
      <Button variant="subtle" onClick={handleOpenModal}>
        ブックマークからインポートする
      </Button>
      <Modal
        opened={open}
        onClose={handleCloseModal}
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

          <Flex justify="end" gap={8}>
            <Button variant="outline" onClick={handleCloseModal}>
              キャンセル
            </Button>
            <Button>インポート</Button>
          </Flex>
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
            onClick={toggle}
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
