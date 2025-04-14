import type { ReactNode } from 'react';

import { Accordion } from '$ui';

type CollectibleAccordionItemProps = {
  id: string;
  label: string;
  children: ReactNode;
};

export const CollectibleAccordionItem = ({
  id,
  label,
  children,
}: CollectibleAccordionItemProps) => {
  return (
    <Accordion.Item
      value={id}
      className="border-b-[1px] border-b-border bg-transparent focus:outline-hidden focus:ring-transparent"
    >
      <Accordion.Trigger>{label}</Accordion.Trigger>
      <Accordion.Content className="overflow-x-auto pb-4">
        {children}
      </Accordion.Content>
    </Accordion.Item>
  );
};
