export const def =
  <T>(defaultValue: T) =>
  (v: T | undefined) =>
    v === undefined ? defaultValue : v;
