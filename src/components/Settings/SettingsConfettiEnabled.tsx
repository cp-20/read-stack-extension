import { Checkbox } from '@mantine/core';

import { useStorage } from '@plasmohq/storage/hook';

import { def } from './common';

export const useConfettiEnabled = () => {
  const [isConfettiEnabled, setIsConfettiEnabled] = useStorage<boolean>(
    'is-confetti-enabled',
    def(true),
  );

  return [isConfettiEnabled, setIsConfettiEnabled] as const;
};

export const SettingsConfettiEnabled = () => {
  const [isConfettiEnabled, setIsConfettiEnabled] = useConfettiEnabled();

  return (
    <div>
      <Checkbox
        label="記事を読み終わったときにエフェクトを表示する"
        checked={isConfettiEnabled}
        onChange={(e) => {
          setIsConfettiEnabled(e.target.checked);
        }}
      />
    </div>
  );
};
