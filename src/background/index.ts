import { saveToClip } from '@/background/commands/saveToClip';
import { saveToInbox } from '@/background/commands/saveToInbox';

export {};

chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});

chrome.commands.onCommand.addListener((command, tab) => {
  if (command === 'save_to_clip') saveToClip(tab);
  if (command === 'save_to_inbox') saveToInbox(tab);
});
