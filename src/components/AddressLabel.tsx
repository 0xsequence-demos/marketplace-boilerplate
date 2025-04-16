import { getChain } from '~/lib/utils/getChain';

import ENSName from './ENSName';
import { Button, Flex, LinkIcon } from './ui';

type AddressLabelProps = {
  chainId: number;
  address: string;
};

export const AddressLabel = ({ address, chainId }: AddressLabelProps) => {
  const explorerUrl = getChain(chainId)?.blockExplorer?.rootUrl;

  return (
    <Flex className="items-center gap-2">
      <Button asChild variant="link" title={address} className="px-0 uppercase">
        <a
          href={`${explorerUrl}address/${address}`}
          target="_blank"
          rel="noreferrer"
        >
          <LinkIcon />

          {address ? <ENSName address={address} truncateAt={4} /> : 'unknown'}
        </a>
      </Button>
    </Flex>
  );
};
