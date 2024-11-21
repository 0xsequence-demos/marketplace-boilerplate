import { useState, useEffect } from 'react';

import { getChain } from '~/lib/utils/getChain';

import ENSName from './ENSName';
import { Button, Flex, LinkIcon } from './ui';

type AddressLabelProps = {
  chainId: number;
  address: string;
};

export const AddressLabel = ({ address, chainId }: AddressLabelProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isCopied, setCopy] = useState(false);
  const iconState = isCopied ? 'checkmark' : 'copy';
  const tooltip = isCopied ? 'Copied!' : 'Copy Address';

  const onCopy = () => {
    setShowTooltip(true);
    setCopy(true);
  };

  const onClear = () => {
    setShowTooltip(false);
    setCopy(false);
  };

  useEffect(() => {
    if (isCopied) setTimeout(onClear, 2000);
  }, [isCopied]);

  const explorerUrl = getChain(chainId)?.blockExplorer?.rootUrl;

  return (
    <Flex className="items-center gap-2">
      {/* <Tooltip.Root
        open={showTooltip}
        onOpenChange={open => setShowTooltip(open)}
      >
        <Tooltip.Trigger asChild>
          <Button
            variant={isCopied ? 'success' : 'muted'}
            onClick={() => {
              navigator?.clipboard?.writeText(address)
              onCopy()
            }}
          >
            <Icon
              type={iconState}
              size={16}
              css={{ color: 'inherit', cursor: 'pointer', minWidth: 16 }}
            />
          </Button>
        </Tooltip.Trigger>

        <Tooltip.Content side="top">{tooltip}</Tooltip.Content>
      </Tooltip.Root> */}

      <Button asChild variant="link" title={address} className="px-0 uppercase">
        <a href={`${explorerUrl}address/${address}`} target="_blank">
          <LinkIcon />

          {address ? <ENSName address={address} truncateAt={4} /> : 'unknown'}
        </a>
      </Button>
    </Flex>
  );
};
