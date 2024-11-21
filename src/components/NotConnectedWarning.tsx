import { Flex, Image, Text } from '$ui';
import { ConnectButton } from './buttons/ConnectButton';

interface Props {
  isConnected: boolean;
}

export const NotConnectedWarning = ({ isConnected }: Props) => {
  if (isConnected) return null;

  return (
    <Flex className="my-auto flex-col items-center justify-center gap-4">
      <Image
        alt="Cube"
        src="/images/cubes.svg"
        className="h-[80px] w-[80px]"
      />

      <Text className="text-xl font-extrabold" as="h4">
        Not Connected
      </Text>
      <Text className="font-medium text-foreground/50">
        Please connect your wallet to continue
      </Text>

      <ConnectButton />
    </Flex>
  );
};
