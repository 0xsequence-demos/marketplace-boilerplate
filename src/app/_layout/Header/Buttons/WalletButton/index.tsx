'use client';

import type { ComponentProps } from 'react';

import { ConnectButton } from '~/modules/ConnectButton';

import { AccountButton } from './AccountButton';
import { type Button } from 'system';
import { useAccount } from 'wagmi';

export const WalletButton = ({
  buttonProps,
}: {
  buttonProps?: ComponentProps<typeof Button>;
}) => {
  const { isConnected } = useAccount();

  if (isConnected) {
    return <AccountButton {...buttonProps} />;
  } else {
    return <ConnectButton variant="muted" {...buttonProps} />;
  }
};
