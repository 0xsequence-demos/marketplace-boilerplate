import { Button, Flex, LoadingIcon, Select, Table } from '~/components/ui';
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '~/components/ui/Select/select';

import { PAGE_SIZE_OPTIONS } from '../OrdersTable';
import type { Page } from '@0xsequence/marketplace-sdk';
import type { Observable } from '@legendapp/state';
import { observer } from '@legendapp/state/react';

const OrdersTableFooter = observer(
  ({
    page$,
    ordersCount,
    ordersCountLoading,
  }: {
    page$: Observable<Page>;
    ordersCount: number | undefined;
    ordersCountLoading: boolean;
  }) => {
    const pageSize = page$.pageSize.get();
    const page = page$.page.get();
    const totalItems = Number(ordersCount) || 0;

    // Calculate start and end, ensuring they're valid
    const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, totalItems);
    const displayText =
      totalItems === 0 ? '0 items' : `${start}-${end} of ${totalItems} items`;
    const totalPages = Math.ceil(totalItems / pageSize) || 1;

    // Reset to page 1 if current page is invalid after page size change
    if (page > totalPages) {
      page$.page.set(1);
    }

    return (
      <Table.Footer className="bg-inherit">
        <Table.Row>
          <Table.Cell
            className="p-0 border-t border-foreground/10 pt-2 pb-3 px-3"
            colSpan={10}
          >
            <Flex className="text-xs items-center justify-between">
              <ItemsPerPageSelect page$={page$} />

              {ordersCountLoading ? (
                <LoadingIcon />
              ) : (
                <p className="text-text50 text-small font-medium">
                  {displayText}
                </p>
              )}

              <PageSelect
                page$={page$}
                totalPages={totalPages}
                totalPagesLoading={ordersCountLoading}
              />

              <PreviousNextPageControls
                page$={page$}
                ordersCount={ordersCount}
              />
            </Flex>
          </Table.Cell>
        </Table.Row>
      </Table.Footer>
    );
  },
);

function ItemsPerPageSelect({ page$ }: { page$: Observable<Page> }) {
  return (
    <Flex className="hidden sm:flex items-center gap-2">
      <p className="text-text50">Items per page</p>

      <Select.Root
        onValueChange={(value) => page$.pageSize.set(Number(value))}
        value={page$.pageSize.get().toString()}
      >
        <SelectTrigger className="h-7 w-auto gap-1 bg-foreground/5 border-0">
          <p>{page$.pageSize.get()}</p>
        </SelectTrigger>

        <SelectContent>
          {Object.entries(PAGE_SIZE_OPTIONS).map(([key, value]) => (
            <SelectItem key={key} value={value.value.toString()}>
              {value.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select.Root>
    </Flex>
  );
}

function PageSelect({
  page$,
  totalPages,
  totalPagesLoading,
}: {
  page$: Observable<Page>;
  totalPages: number;
  totalPagesLoading: boolean;
}) {
  const options = totalPagesLoading
    ? []
    : Array.from({ length: totalPages }, (_, i) => ({
        value: i + 1,
        label: (i + 1).toString(),
      }));

  return (
    <Flex className="hidden sm:flex items-center gap-2">
      <Select.Root
        onValueChange={(value) => page$.page.set(Number(value))}
        value={page$.page.get().toString()}
      >
        <SelectTrigger className="h-7 w-auto gap-1 bg-foreground/5 border-0">
          <p>{page$.page.get()}</p>
        </SelectTrigger>

        <SelectContent>
          {options.map((value, key) => (
            <SelectItem key={value.label} value={value.value.toString()}>
              {value.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select.Root>

      {totalPagesLoading ? (
        <LoadingIcon />
      ) : (
        <p className="text-text50">
          of {totalPages}
        </p>
      )}
    </Flex>
  );
}

function PreviousNextPageControls({
  page$,
  ordersCount,
}: {
  page$: Observable<Page>;
  ordersCount: number | undefined;
}) {
  const currentPage = page$.page.get();
  const pageSize = page$.pageSize.get();
  const totalPages = Math.ceil(Number(ordersCount) / pageSize) || 1;

  function handlePrevPage() {
    if (currentPage > 1) {
      page$.page.set(currentPage - 1);
    }
  }

  function handleNextPage() {
    if (currentPage < totalPages) {
      page$.page.set(currentPage + 1);
    }
  }

  return (
    <Flex className="items-center gap-2">
      <Button
        onClick={handlePrevPage}
        variant="ghost"
        disabled={currentPage <= 1}
        size="xs"
      />

      <Button
        onClick={handleNextPage}
        variant="ghost"
        disabled={currentPage >= totalPages}
        size="xs"
      />
    </Flex>
  );
}

export default OrdersTableFooter;
