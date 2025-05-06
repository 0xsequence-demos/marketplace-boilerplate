import Pill from './Pill';
import { Text } from '@0xsequence/design-system';
import {
  getMarketplaceDetails,
  type MarketplaceKind,
} from '@0xsequence/marketplace-sdk';

const MarketplacePill = ({
  originName,
  marketplace: marketplaceKind,
}: {
  originName: string;
  marketplace: MarketplaceKind;
}) => {
  const marketplaceDetails = getMarketplaceDetails({
    originName: originName,
    kind: marketplaceKind,
  });

  if (!marketplaceDetails) {
    return (
      <Pill>
        <Text color="text100"  fontWeight="bold">
          Unknown
        </Text>
      </Pill>
    );
  }

  return (
    <Pill>
      <marketplaceDetails.logo className='w-3 h-3'/>

      <Text color="text100"  fontWeight="bold">
        {marketplaceDetails.displayName}
      </Text>
    </Pill>
  );
};

export default MarketplacePill;
