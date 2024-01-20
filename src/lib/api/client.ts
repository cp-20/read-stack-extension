import { Fetcher } from 'openapi-typescript-fetch';

import type { components, paths } from './schema';

const fetcher = Fetcher.for<paths>();

const baseUrl =
  process.env.PLASMO_PUBLIC_API_BASE_URL ?? 'http://localhost:3000/api/v1';

fetcher.configure({
  baseUrl,
  init: {},
  use: [],
});

export const getMe = fetcher.path('/users/me').method('get').create();
export const getMyClips = fetcher
  .path('/users/me/clips')
  .method('get')
  .create();
export const postMyClip = fetcher
  .path('/users/me/clips')
  .method('post')
  .create();
export const patchMyClip = fetcher
  .path('/users/me/clips/{clipId}')
  .method('patch')
  .create();
export const deleteMyClip = fetcher
  .path('/users/me/clips/{clipId}')
  .method('delete')
  .create();
export const getMyInboxItems = fetcher
  .path('/users/me/inboxes')
  .method('get')
  .create();
export const postMyInboxItem = fetcher
  .path('/users/me/inboxes')
  .method('post')
  .create();
export const moveMyInboxItemToClip = fetcher
  .path('/users/me/inboxes/{itemId}/move-to-clip')
  .method('post')
  .create();

export type User = components['schemas']['User'];
export type Clip = components['schemas']['Clip'];
export type ClipWithArticle = components['schemas']['ClipWithArticle'];
export type Article = components['schemas']['Article'];
export type InboxItem = components['schemas']['InboxItem'];
export type InboxItemWithArticle =
  components['schemas']['InboxItemWithArticle'];
