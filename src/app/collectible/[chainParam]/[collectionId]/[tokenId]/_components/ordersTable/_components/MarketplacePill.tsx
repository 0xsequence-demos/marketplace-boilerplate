import { useState } from 'react';

import Pill from './Pill';
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
  const [isImageError, setIsImageError] = useState(false);
  const marketplaceDetails = getMarketplaceDetails({
    originName: originName,
    kind: marketplaceKind,
  });

  const onImageError = () => {
    setIsImageError(true);
  };

  if (!marketplaceDetails) {
    return (
      <Pill>
        <p className="text-text100 text-xsmall font-bold">Unknown</p>
      </Pill>
    );
  }

  return (
    <Pill>
      {isImageError ? (
        <img src="/images/chess-tile" alt="chess-tile" width={3} height={3} />
      ) : (
        <marketplaceDetails.logo width={3} height={3} onError={onImageError} />
      )}

      <p className="text-text100 text-xsmall font-bold">
        {marketplaceDetails.displayName}
      </p>
    </Pill>
  );
};

export default MarketplacePill;
