'use client';

import { Box, Button, Flex, Text } from '$ui';
import { NetworkImage } from '@0xsequence/design-system';
import { useAccount, useSwitchChain } from 'wagmi';

export const NetworkSelectModalContent = () => {
  const { chains, switchChainAsync } = useSwitchChain();
  const { chain: connectedChain } = useAccount();

  const onClickNetwork = async (chainId: number) => {
    try {
      await switchChainAsync({ chainId });
    } catch (err) {
      console.error('failed to switch network', err);
    }
  };

  return (
    <Flex className="flex-col gap-4">
      <Flex>
        <Text as="h2" className="text-2xl font-bold">
          Switch Network
        </Text>
      </Flex>
      <Flex className="g-1 max-h-52 flex-col overflow-y-auto p-1">
        {chains.map((chain) => {
          return (
            <Button
              className="w-full !rounded-sm p-1"
              variant="ghost"
              onClick={() => onClickNetwork(chain.id)}
              key={chain.id}
            >
              <Flex className="flex-start w-full flex-row items-center justify-start gap-1">
                <NetworkImage chainId={chain.id} />
                <Text className="pl-1 text-lg">{chain.name}</Text>
                <Flex className="ml-2 items-center justify-center gap-1">
                  {connectedChain?.id === chain.id && (
                    <Box className="h-[6px] w-[6px] rounded-full bg-success" />
                  )}
                </Flex>
              </Flex>
            </Button>
          );
        })}
      </Flex>
    </Flex>
  );
};
