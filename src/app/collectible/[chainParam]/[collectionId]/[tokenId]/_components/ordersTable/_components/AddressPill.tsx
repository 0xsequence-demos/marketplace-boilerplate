import { useIsMinWidth } from '~/hooks/ui/useIsMinWidth';

import Pill from './Pill';
import { truncateMiddle } from '@0xsequence/marketplace-sdk';

const AddressPill = ({ address }: { address: string }) => {
  const isMinWidth = useIsMinWidth('@sm');
  return (
    <Pill>
      {address.toLowerCase()}

      <p className="text-text100 text-xsmall font-bold">
        {isMinWidth
          ? truncateMiddle(address, 1, 3)
          : truncateMiddle(address, 15, 3)}
      </p>
    </Pill>
  );
};

export default AddressPill;
