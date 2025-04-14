
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
        <Text color="text100" fontSize="xsmall" fontWeight="bold">
          Unknown
        </Text>
      </Pill>
    );
  }

  return (
    <Pill>
      <marketplaceDetails.logo width="3" height="3" />

      <Text color="text100" fontSize="xsmall" fontWeight="bold">
        {marketplaceDetails.displayName}
      </Text>
    </Pill>
  );
};

export default MarketplacePill;
