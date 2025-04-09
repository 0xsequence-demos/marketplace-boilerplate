'use client';

import { NetworkSelectModalContent } from '~/components/modals/NetworkSelectModal';
import { useIsClient } from '~/hooks/ui/useIsClient';
import { getThemeManagerElement } from '~/lib/utils/theme';

import { Button, Dialog } from '$ui';
import { type ChainId, networks } from '@0xsequence/network';
import { useAccount } from 'wagmi';
import { getPresentableChainName } from '~/lib/utils/getChain';
import { getCurrencyIconUrl } from '~/lib/utils/getChain';

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
          <img
            src={getCurrencyIconUrl(chain.id)}
            alt={getPresentableChainName(chain.id)}
            className="h-4 w-4"
          />
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
