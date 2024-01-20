import { atom, useAtom } from 'jotai';

const checkedBookmarksAtom = atom<string[]>([]);

export const useCheckedBookmarksAtom = () => {
  const [checkedBookmarks, setCheckedBookmarks] = useAtom(checkedBookmarksAtom);

  return {
    checkedBookmarks,
    setCheckedBookmarks,
  };
};

export const useCheckedBookmarks = (
  node: chrome.bookmarks.BookmarkTreeNode,
) => {
  const [checkedBookmarks, setCheckedBookmarks] = useAtom(checkedBookmarksAtom);

  if (node.children === undefined) {
    return {
      checked: checkedBookmarks.includes(node.id),
      indeterminate: false,
      toggle: () => {
        setCheckedBookmarks((prev) => {
          if (prev.includes(node.id)) {
            return prev.filter((id) => id !== node.id);
          }
          return [...prev, node.id];
        });
      },
    };
  }

  const checked = checkIfSomeChildrenAreChecked(checkedBookmarks, node);
  const indeterminate =
    !checkIfAllChildrenAreChecked(checkedBookmarks, node) && checked;

  return {
    checked,
    indeterminate,
    toggle: () =>
      setCheckedBookmarks((prev) => {
        const checked = checkIfSomeChildrenAreChecked(prev, node);
        return checked
          ? uncheckAllChildren(prev, node)
          : checkAllChildren(prev, node);
      }),
  };
};

const checkIfAllChildrenAreChecked = (
  checkedBookmarks: string[],
  node: chrome.bookmarks.BookmarkTreeNode,
): boolean => {
  if (node.children === undefined) {
    return checkedBookmarks.includes(node.id);
  }

  return node.children.every((child) =>
    checkIfAllChildrenAreChecked(checkedBookmarks, child),
  );
};

const checkIfSomeChildrenAreChecked = (
  checkedBookmarks: string[],
  node: chrome.bookmarks.BookmarkTreeNode,
): boolean => {
  if (node.children === undefined) {
    return checkedBookmarks.includes(node.id);
  }

  return node.children.some((child) =>
    checkIfSomeChildrenAreChecked(checkedBookmarks, child),
  );
};

const checkAllChildren = (
  checkedBookmarks: string[],
  node: chrome.bookmarks.BookmarkTreeNode,
): string[] => {
  if (node.children === undefined) {
    if (checkedBookmarks.includes(node.id)) {
      return checkedBookmarks;
    }
    return [...checkedBookmarks, node.id];
  }

  return node.children.reduce(
    (acc, child) => checkAllChildren(acc, child),
    checkedBookmarks,
  );
};

const uncheckAllChildren = (
  checkedBookmarks: string[],
  node: chrome.bookmarks.BookmarkTreeNode,
): string[] => {
  if (node.children === undefined) {
    return checkedBookmarks.filter((id) => id !== node.id);
  }

  return node.children.reduce(
    (acc, child) => uncheckAllChildren(acc, child),
    checkedBookmarks,
  );
};
