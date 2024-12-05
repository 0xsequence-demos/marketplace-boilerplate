import { AddressLabel } from '~/components/AddressLabel';

import { Text, Flex } from '$ui';

type AddressesLinksProps = {
  addresses: { label: string; address: string; chainId: number }[];
};

export const AddressesLinks = ({ addresses }: AddressesLinksProps) => {
  return (
    <Flex className="flex-col gap-2 p-3 pl-1">
      {addresses.map((a, i) => (
        <AddressBox key={i} {...a} />
      ))}
    </Flex>
  );
};

const AddressBox = ({
  label,
  address,
  chainId,
}: {
  label: string;
  address: string;
  chainId: number;
}) => {
  return (
    <Flex className="items-center justify-between rounded-sm bg-secondary/30 px-3 py-0.5">
      <Text className="text-sm text-foreground/80">{label}</Text>
      <AddressLabel address={address} chainId={chainId} />
    </Flex>
  );
};
