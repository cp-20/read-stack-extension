import { css } from '@emotion/react';
import { Button, Flex, Modal, Select, Stack, Textarea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconFileImport } from '@tabler/icons-react';
import { useCallback, useState, type FC } from 'react';

import { useImporter } from '@/components/Importer/useImporter';

import { ProcessingImportModal } from './ProcessingImportModal';

export const ImportFromText: FC = () => {
  const [open, handlers] = useDisclosure(false);
  const [urlText, setUrlText] = useState('');
  const [target, setTarget] = useState<'clip' | 'inbox'>('clip');
  const [loading, setLoading] = useState(false);
  const [processingOpen, processingHandlers] = useDisclosure(false);
  const { importer, result: processingResult } = useImporter();

  const handleImport = useCallback(async () => {
    setLoading(true);
    const urls = urlText.split('\n').filter(Boolean);

    processingHandlers.open();

    await importer(target, urls);

    setLoading(false);
  }, [importer, processingHandlers, target, urlText]);

  const closeProcessingModal = useCallback(() => {
    processingHandlers.close();
    handlers.close();
  }, [processingHandlers, handlers]);

  return (
    <>
      <Button
        variant="light"
        onClick={handlers.open}
        rightIcon={<IconFileImport />}
      >
        テキストからインポート
      </Button>
      <Modal
        opened={open}
        centered
        onClose={handlers.close}
        title="テキストからインポート"
        size="xl"
      >
        <Stack spacing="md">
          <Textarea
            value={urlText}
            onChange={(e) => setUrlText(e.target.value)}
            minRows={10}
            autosize
            maxRows={20}
            placeholder="URLを改行区切りで入力してください"
          />

          <Flex align="end" gap={8}>
            <Select
              css={css`
                flex: 1;
              `}
              label="インポート先"
              data={[
                { value: 'inbox', label: '受信箱' },
                { value: 'clip', label: 'スタック' },
              ]}
              value={target}
              onChange={(value) =>
                setTarget(value !== 'clip' ? 'inbox' : 'clip')
              }
            />
            <Button variant="outline" onClick={handlers.close}>
              キャンセル
            </Button>
            <Button
              onClick={handleImport}
              loading={loading}
              rightIcon={<IconFileImport />}
            >
              インポート
            </Button>
          </Flex>
        </Stack>
      </Modal>
      <ProcessingImportModal
        result={processingResult}
        opened={processingOpen}
        onClose={closeProcessingModal}
      />
    </>
  );
};
