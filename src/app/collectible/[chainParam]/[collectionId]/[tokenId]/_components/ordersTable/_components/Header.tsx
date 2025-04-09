import { Table } from '~/components/ui';

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
            <p className="text-text80 text-small">{item}</p>
          </Table.Head>
        ))}
        {
          // empty cell for actions
          address && !isLoading && <Table.Head/>
        }
      </Table.Row>
    </Table.Header>
  );
};

export default OrdersTableHeader;
