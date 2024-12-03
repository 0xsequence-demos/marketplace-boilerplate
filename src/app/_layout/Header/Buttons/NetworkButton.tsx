'use client';

import { NetworkSelectModalContent } from '~/components/modals/NetworkSelectModal';
import { useIsClient } from '~/hooks/ui/useIsClient';
import { getThemeManagerElement } from '~/lib/utils/theme';

import { Button, Dialog } from '$ui';
import { NetworkImage } from '@0xsequence/design-system';
import { type ChainId, networks } from '@0xsequence/network';
import { useAccount } from 'wagmi';

export const NetworkButton = () => {
  const { chain } = useAccount();
  const isClient = useIsClient();
  if (!isClient)
    return (
      <Button variant="muted">
        <div className="h-6 w-6"></div>
      </Button>
    );

  if (chain?.id) {
    const getNetworkButton = () => {
      if (networks[chain.id as ChainId] === undefined) {
        return <Button variant="destructive" label="Unsupported Network" />;
      }
      return (
        <Button
          variant="muted"
          className="backdrop-blur"
          aria-label="Select network"
        >
          <NetworkImage chainId={chain?.id} />
        </Button>
      );
    };

    return (
      <Dialog.Root>
        <Dialog.Trigger asChild>{getNetworkButton()}</Dialog.Trigger>

        <Dialog.BaseContent
          className="sm:max-w-[450px]"
          container={getThemeManagerElement()}
          title="Switch Network"
        >
          <NetworkSelectModalContent />
        </Dialog.BaseContent>
      </Dialog.Root>
    );
  }
  return <></>;
};
