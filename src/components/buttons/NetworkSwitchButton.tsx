'use client';

import { Button } from '$ui';
import { useSwitchChain } from 'wagmi';

interface Props {
  targetChainId: number | undefined;
}

export const NetworkSwitchButton = ({ targetChainId }: Props) => {
  const { switchChain } = useSwitchChain();

  return (
    <Button
      className="w-full"
      label={'SWITCH NETWORK'}
      onClick={() => switchChain({ chainId: targetChainId ?? 137 })}
    />
  );
};
