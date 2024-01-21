import { css } from '@emotion/react';
import { ActionIcon, Checkbox, Text } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { useCallback, useState, type FC } from 'react';

import { useCheckedBookmarks } from '@/components/Importer/useCheckedBookmarks';

type BookMarkTreeNodeListProps = {
  nodes: chrome.bookmarks.BookmarkTreeNode[];
};

export const BookMarkTreeNodeList: FC<BookMarkTreeNodeListProps> = ({
  nodes,
}) => {
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
