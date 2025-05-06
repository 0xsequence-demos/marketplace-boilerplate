import { Table } from '~/components/ui';

import { Text } from '@0xsequence/design-system';
import { useAccount } from 'wagmi';

const OrdersTableHeader = ({
  items,
  isLoading,
}: {
  items: string[];
  isLoading: boolean;
}) => {
  const { address } = useAccount();

  return (
    <Table.Header className="bg-foreground/10 hidden md:table-header-group">
      <Table.Row>
        {items.map((item) => (
          <Table.Head key={item}>
            <Text color="text80">
              {item}
            </Text>
          </Table.Head>
        ))}
        {
          // empty cell for actions
          address && !isLoading && <Table.Head />
        }
      </Table.Row>
    </Table.Header>
  );
};

export default OrdersTableHeader;
