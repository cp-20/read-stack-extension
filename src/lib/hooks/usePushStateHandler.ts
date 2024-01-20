import { useEffect } from 'react';

export const usePushStateHandler = (
  handlePushState: () => void,
  executeFirst: boolean,
) => {
  useEffect(() => {
    window.addEventListener('pushState', handlePushState);
    window.addEventListener('popstate', handlePushState);
    if (executeFirst) handlePushState();

    return () => {
      window.removeEventListener('pushState', handlePushState);
      window.removeEventListener('popstate', handlePushState);
    };
  }, [executeFirst, handlePushState]);
};
