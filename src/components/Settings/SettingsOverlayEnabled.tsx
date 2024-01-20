import { Checkbox } from '@mantine/core';

import { useStorage } from '@plasmohq/storage/hook';

import { def } from './common';

export const useOverlayEnabled = () => {
  const [isOverlayEnabled, setIsOverlayEnabled] = useStorage<boolean>(
    'is-overlay-enabled',
    def(true),
  );

  return [isOverlayEnabled, setIsOverlayEnabled] as const;
};

export const SettingsOverlayEnabled = () => {
  const [isOverlayEnabled, setIsOverlayEnabled] = useOverlayEnabled();

  return (
    <div>
      <Checkbox
        label="記事を読んでいるときに進捗バーを表示する"
        checked={isOverlayEnabled}
        onChange={(e) => {
          setIsOverlayEnabled(e.target.checked);
        }}
      />
    </div>
  );
};
