import { css } from '@emotion/react';
import confetti from 'canvas-confetti';
import { isMatch } from 'picomatch';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { sendToBackground } from '@plasmohq/messaging';
import { useMessage } from '@plasmohq/messaging/hook';

import { CheckIcon } from '@/components/CheckIcon';
import { ProgressCircle } from '@/components/ProgressCircle';
import { useConfettiEnabled } from '@/components/Settings/SettingsConfettiEnabled';
import { useOverlayEnabled } from '@/components/Settings/SettingsOverlayEnabled';
import { useArticleUrlGlobs } from '@/components/Settings/SettingsUrlGlobs';
import type {
  Clip,
  ClipWithArticle,
  InboxItemWithArticle,
} from '@/lib/api/client';
import { useCurrentClip } from '@/lib/hooks/useCurrentClip';
import { useCurrentInboxItem } from '@/lib/hooks/useCurrentInboxItem';
import { useCurrentUrl } from '@/lib/hooks/useCurrentUrl';
import { getSelector } from '@/lib/trackProgress/getSelector';
import { scroll2progress } from '@/lib/trackProgress/progressScrollConverter';

const showConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    startVelocity: 70,
    angle: 120,
    origin: {
      x: 0.9,
      y: 0.9,
    },
  });
};

export const ArticleOverlayTip = () => {
  const [articleUrlGlobs] = useArticleUrlGlobs();
  const [isOverlayEnabled] = useOverlayEnabled();
  const [isConfettiEnabled] = useConfettiEnabled();

  const { currentClip, setCurrentClip } = useCurrentClip();
  const { currentItem, setCurrentItem } = useCurrentInboxItem();
  const { currentUrl } = useCurrentUrl();

  const [progress, setProgress] = useState(0);

  const match = isMatch(currentUrl, articleUrlGlobs);
  const isClip = !!currentClip;
  const isItem = !!currentItem;
  const isOverlayShown = isOverlayEnabled && (match || isClip || isItem);

  // globにマッチしているが受信箱にもクリップにも保存されていないなら受信箱に保存する
  if (match && currentClip === null && currentItem == null) {
    sendToBackground({
      name: 'post-inbox-item',
      body: { url: currentUrl },
    }).then((result: InboxItemWithArticle | null) => {
      if (result === null) return;

      setCurrentItem(result);
    });
  }

  useEffect(() => {
    if (!currentClip) return;
    const selector = getSelector(currentClip.article.url);

    let timeout: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const progress = Math.round(scroll2progress(selector)(window.scrollY));

        setProgress(progress);
        sendToBackground({
          name: 'update-clip',
          body: {
            clipId: currentClip.id,
            patch: { progress },
          },
        });
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [currentClip, setProgress]);

  useMessage<{ url: string }, void>(async (req) => {
    if (req.name === 'save-to-clip') {
      const url = req.body?.url;
      if (!url) return;
      if (url !== currentUrl) return;

      if (isClip) {
        toast.info('記事は既にスタックに積まれています', {
          position: 'top-right',
        });
        return;
      }

      if (isItem) {
        const clip: Clip | null = await sendToBackground({
          name: 'move-inbox-item-to-clip',
          body: { url },
        });
        if (clip === null) {
          toast.error('記事をスタックに積めませんでした', {
            position: 'top-right',
          });
          return;
        }

        setCurrentClip({ ...clip, article: currentItem.article });
        toast.success('記事をスタックに保存しました', {
          position: 'top-right',
        });
        return;
      }

      const clip: ClipWithArticle | null = await sendToBackground({
        name: 'post-clip',
        body: { url },
      });
      if (clip === null) {
        toast.error('記事をスタックに積めませんでした', {
          position: 'top-right',
        });
        return;
      }

      setCurrentClip(clip);
      toast.success('記事をスタックに保存しました', {
        position: 'top-right',
      });
    } else if (req.name === 'save-to-inbox-item') {
      const url = req.body?.url;
      if (!url) return;
      if (url !== currentUrl) return;

      if (isClip) {
        toast.info('記事は既にスタックに積まれています', {
          position: 'top-right',
        });
        return;
      }

      if (isItem) {
        toast.info('記事は既に受信箱に入っています', {
          position: 'top-right',
        });
        return;
      }

      const item: InboxItemWithArticle | null = await sendToBackground({
        name: 'post-inbox-item',
        body: { url },
      });
      if (item === null) {
        toast.error('記事を受信箱に入れられませんでした', {
          position: 'top-right',
        });
        return;
      }

      setCurrentItem(item);
      toast.success('記事を受信箱に入れました', {
        position: 'top-right',
      });
    }
  });

  const toggleReadStatus = async () => {
    if (!currentClip) {
      if (!currentItem) return;

      const clip = await sendToBackground({
        name: 'move-inbox-item-to-clip',
        body: { itemId: currentItem.id },
      });
      if (!clip) return;

      setCurrentClip({ ...clip, article: currentItem.article });
      setCurrentItem(null);

      const updatedClip = await sendToBackground({
        name: 'update-clip',
        body: {
          clipId: clip.id,
          patch: { status: 2 },
        },
      });

      if (!updatedClip) return;

      setCurrentClip({ ...clip, article: currentItem.article, ...updatedClip });
      if (isConfettiEnabled) showConfetti();

      return;
    }

    const updatedClip = await sendToBackground({
      name: 'update-clip',
      body: {
        clipId: currentClip.id,
        patch: { status: currentClip.status === 2 ? 0 : 2 },
      },
    });
    if (!updatedClip) return;

    setCurrentClip({ ...currentClip, ...updatedClip });
    if (isConfettiEnabled && updatedClip.status === 2) showConfetti();
  };

  if (!isOverlayShown) return null;

  return (
    <div
      css={css`
        position: fixed;
        right: 32px;
        bottom: 32px;
        width: 48px;
        height: 48px;
      `}
    >
      <button
        onClick={toggleReadStatus}
        css={css`
          position: relative;
          display: grid;
          place-items: center;
          width: 100%;
          height: 100%;
          padding: 0;
          font-size: 14px;
          font-weight: bold;
          cursor: pointer;
          background-color: #fff;
          border: none;
          border-radius: 8px;
          box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
          transition:
            box-shadow 0.2s,
            background-color 0.2s;

          &:hover {
            box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
          }
        `}
      >
        {isClip ? (
          <ProgressCircle progress={currentClip.status == 2 ? 100 : progress}>
            <CheckIcon active={currentClip.status == 2} />
          </ProgressCircle>
        ) : (
          <CheckIcon active={false} />
        )}
      </button>
    </div>
  );
};
