import { Stack } from '@mantine/core';

import { SettingsConfettiEnabled } from './SettingsConfettiEnabled';
import { SettingsOverlayEnabled } from './SettingsOverlayEnabled';
import { SettingsUrlGlobs } from './SettingsUrlGlobs';

export const Settings = () => {
  return (
    <Stack>
      <SettingsUrlGlobs />
      <SettingsOverlayEnabled />
      <SettingsConfettiEnabled />
    </Stack>
  );
};
