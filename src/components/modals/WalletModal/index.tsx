'use client';

import { useState } from 'react';

import ENSName from '~/components/ENSName';

import { sequence } from '0xsequence';
import {
  Button,
  Dialog,
  Flex,
  Text,
  WalletIcon,
  CopyIcon,
  DisconnectIcon,
  CheckmarkIcon,
} from '$ui';
import { useAccount, useDisconnect } from 'wagmi';

export const WalletModalContent = () => {
  const { address, connector } = useAccount();
  const { disconnect } = useDisconnect();

  const [copied, setCopied] = useState(false);

  const onDisconnectClick = () => {
    disconnect();
  };

  const openWalletSequence = async () => {
    let wallet: sequence.provider.SequenceProvider | undefined;
    try {
      wallet = sequence.getWallet();
      if (wallet) {
        void wallet.openWallet();
      }
    } catch (e) { }
  };

  return (
    <>
      <Flex className="mb-5 flex-col items-start justify-between">
        <Flex className="items-center gap-3 font-medium text-foreground/80">
          <WalletIcon />
          <Text>{connector?.id}</Text>
        </Flex>
        <Flex className="w-full text-foreground/80">
          <Text className="ml-1 mt-2 text-sm text-foreground/50 md:block">
            <ENSName address={address} />
          </Text>

          <Button
            className="ml-1 pt-1"
            size="xs"
            variant="ghost"
            onClick={() => {
              if (!address) return;

              void navigator.clipboard.writeText(address);
              setCopied(true);

              setTimeout(() => {
                setCopied(false);
              }, 3000);
            }}
          >
            {copied ? (
              <CheckmarkIcon className="h-4 w-4" />
            ) : (
              <CopyIcon className="h-4 w-4" />
            )}
          </Button>
        </Flex>
      </Flex>

      <Flex className="mb-2 w-full flex-col gap-3">
        {connector?.id === 'sequence' && (
          <Button
            className="w-full justify-start"
            variant="secondary"
            onClick={openWalletSequence}
          >
            <WalletIcon />
            Open Wallet
          </Button>
        )}
        <Dialog.Close asChild>
          <Button
            className="w-full justify-start"
            variant="secondary"
            onClick={onDisconnectClick}
          >
            <DisconnectIcon />
            Disconnect
          </Button>
        </Dialog.Close>
      </Flex>
    </>
  );
};
