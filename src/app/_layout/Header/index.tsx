import { classNames } from '~/config/classNames';

import { Grid, cn } from '$ui';
import { InventoryButton } from './Buttons/InventoryButton';
import { NetworkButton } from './Buttons/NetworkButton';
import { WalletButton } from './Buttons/WalletButton';
import { HeaderLogo } from './HeaderLogo';

export const Header = () => {
  return (
    <Grid.Root
      as="header"
      className={cn(
        classNames.header,
        'h-[--headerHeight] gap-2 bg-background p-2 pt-2',
      )}
      template={`
      [row1-start] "logo search . inventory-button wallet-button order-button network-button" auto [row1-end]
      / auto auto 1fr auto auto auto auto auto auto`}
    >
      <Grid.Child name="logo" className="flex items-center">
        <HeaderLogo />
      </Grid.Child>

      <Grid.Child name="." />

      <Grid.Child name="inventory-button" className="bg-background/30">
        <InventoryButton />
      </Grid.Child>

      <Grid.Child name="wallet-button" className="bg-background/30">
        <WalletButton />
      </Grid.Child>

      <Grid.Child name="network-button" className="mr-2 bg-background/30">
        <NetworkButton />
      </Grid.Child>
    </Grid.Root>
  );
};
