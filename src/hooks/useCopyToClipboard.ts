import { useCallback, useState } from 'react';
import { toast } from 'sonner';

type UseCopyToClipboardOptions = {
  duration?: number;
};

type UseCopyToClipboardProps = {
  options: UseCopyToClipboardOptions;
};

export const useCopyToClipboard = ({ options }: UseCopyToClipboardProps) => {
  const { duration = 1250 } = options;
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const copyToClipboard = useCallback(
    async (text: string) => {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);

          setIsCopied(true);

          const timeout = setTimeout(() => {
            setIsCopied(false);
          }, duration);

          return () => clearTimeout(timeout);
        }
      } catch {
        toast.error('Failed to copy to clipboard');
      }
    },
    [duration]
  );

  return { copyToClipboard, isCopied };
};
