import { useCallback, useState } from 'react';

import type { ProcessingResult } from '@/components/Importer/ProcessingImportModal';
import {
  saveToClip,
  saveToInboxItem,
  type SaveToClipResult,
  type SaveToInboxItemResult,
} from '@/lib/importer/saveTo';
import { processConcurrently } from '@/lib/utils/processConcurrently';

export type ImportTarget = 'clip' | 'inbox';

type Importer = (
  target: ImportTarget,
  urls: string[],
) => Promise<SaveToClipResult[] | SaveToInboxItemResult[]>;

export const useImporter = () => {
  const [result, setResult] = useState<ProcessingResult>({
    lastResult: null,
    totalCount: 0,
    resultCount: 0,
    successCount: 0,
    failureCount: 0,
    canceledCount: 0,
  });

  const importer: Importer = useCallback(async (target, urls) => {
    setResult({
      lastResult: null,
      totalCount: urls.length,
      resultCount: 0,
      successCount: 0,
      failureCount: 0,
      canceledCount: 0,
    });

    const doneCallback = (result: SaveToClipResult | SaveToInboxItemResult) => {
      setResult((prev) => ({
        ...prev,
        lastResult: result,
        resultCount: prev.resultCount + 1,
        successCount:
          result.status === 'success'
            ? prev.successCount + 1
            : prev.successCount,
        failureCount:
          result.status === 'failure'
            ? prev.failureCount + 1
            : prev.failureCount,
        canceledCount:
          result.status === 'canceled'
            ? prev.canceledCount + 1
            : prev.canceledCount,
      }));
    };
    if (target === 'clip') {
      const promises = urls.map((url) => () => saveToClip(url));
      const result = await processConcurrently(promises, 10, doneCallback);
      return result;
    } else {
      const promises = urls.map((url) => () => saveToInboxItem(url));
      const result = await processConcurrently(promises, 10, doneCallback);
      return result;
    }
  }, []);

  return { importer, result };
};
