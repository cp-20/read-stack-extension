import { css } from '@emotion/react';
import { Button, Flex, Loader, Text, useMantineTheme } from '@mantine/core';
import {
  IconArchive,
  IconCheck,
  IconFileArrowLeft,
  IconTrash,
} from '@tabler/icons-react';
import { useCallback, useEffect, useState, type FC } from 'react';

import { sendToBackground } from '@plasmohq/messaging';

import type { Clip, ClipWithArticle } from '@/lib/api/client';
import { usePostClip } from '@/lib/hooks/usePostClip';
import { useUpdateClip } from '@/lib/hooks/useUpdateClip';

export const Popup: FC = () => {
  const theme = useMantineTheme();
  const { postClip } = usePostClip();
  const { updateClip } = useUpdateClip();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [clip, setClip] = useState<ClipWithArticle | null>(null);
  const [actionLoading, setActionLoading] = useState<
    'status' | 'delete' | 'none'
  >('none');

  useEffect(() => {
    setError(false);
    setLoading(true);
    postClip().then((clip) => {
      setLoading(false);

      if (clip === null) {
        setError(true);
        return;
      }

      setClip(clip);
    });
  }, [setError, setLoading, setClip, postClip]);

  const updateReadStatus = useCallback(
    async (status: 'read' | 'unread') => {
      if (clip === null) return;
      if (actionLoading !== 'none') return;

      const newStatus = status === 'read' ? 2 : 0;
      setActionLoading('status');
      await updateClip(clip.id, { status: newStatus });
      setClip((prev) => {
        if (prev === null) return null;
        return { ...prev, status: newStatus };
      });
      setActionLoading('none');
    },
    [actionLoading, clip, updateClip],
  );

  const deleteClip = useCallback(async () => {
    if (clip === null) return;
    if (actionLoading !== 'none') return;

    setActionLoading('delete');
    const deletedClip: Clip | null = await sendToBackground({
      name: 'delete-clip',
      body: { clipId: clip.id },
    });
    if (deletedClip === null) return;

    setClip(null);
    setActionLoading('none');

    window.close();
  }, [actionLoading, clip]);

  return (
    <>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
          justify-content: center;
          width: 400px;
          height: 300px;
          padding: 1rem;
        `}
      >
        {loading && (
          <Flex gap="md" align="center">
            <Loader variant="dots" />
            <div>記事を追加中</div>
          </Flex>
        )}
        {error && <Text color="red">記事の追加に失敗しました</Text>}
        {clip && (
          <>
            <Flex align="center" gap="xs" justify="center">
              <IconCheck
                color={theme.colors[theme.primaryColor][5]}
                size="24px"
              />
              <Text>記事を追加しました</Text>
            </Flex>
            <Flex
              gap="sm"
              css={css`
                padding: 0.5rem 1rem;
                border: 1px solid ${theme.colors.gray[2]};
                border-radius: ${theme.radius.md};
              `}
              direction="column"
            >
              <Flex gap="sm" align="center">
                <Flex direction="column" gap="xs">
                  <Text size="sm" fw="bold" lineClamp={2}>
                    {clip.article.title}
                  </Text>
                  <Text color="dimmed" size="xs" lineClamp={3}>
                    {clip.article.body}
                  </Text>
                </Flex>
                <div>
                  {clip.article.ogImageUrl && (
                    <img
                      src={clip.article.ogImageUrl}
                      alt=""
                      css={css`
                        width: 120px;
                        max-height: 120px;
                        object-fit: contain;
                      `}
                    />
                  )}
                </div>
              </Flex>
              <Flex gap="md">
                {clip.status === 2 ? (
                  <Button
                    variant="light"
                    rightIcon={<IconFileArrowLeft />}
                    onClick={updateReadStatus.bind(null, 'unread')}
                    fullWidth
                    loading={actionLoading === 'status'}
                  >
                    未読にする
                  </Button>
                ) : (
                  <Button
                    variant="light"
                    rightIcon={<IconArchive />}
                    onClick={updateReadStatus.bind(null, 'read')}
                    fullWidth
                    loading={actionLoading === 'status'}
                  >
                    既読にする
                  </Button>
                )}
                <Button
                  variant="light"
                  color="red"
                  rightIcon={<IconTrash />}
                  fullWidth
                  onClick={deleteClip}
                  loading={actionLoading === 'delete'}
                >
                  削除する
                </Button>
              </Flex>
            </Flex>
          </>
        )}
      </div>
    </>
  );
};
