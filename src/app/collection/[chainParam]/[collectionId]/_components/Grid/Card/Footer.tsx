import { Avatar, Badge, Flex, Text, cn } from '~/components/ui';

import type { TokenMetadata } from '@0xsequence/indexer';
import {
	type Order as OrderType,
	truncateMiddle,
} from '@0xsequence/marketplace-sdk';
import { useCurrencies } from '@0xsequence/marketplace-sdk/react';

type FooterProps = {
	tokenMetadata: TokenMetadata;
	order?: OrderType;
};

export const Footer = ({ tokenMetadata, order }: FooterProps) => {
	const { tokenId, name } = tokenMetadata;

	const height = 'h-[24px]';
	return (
		<>
			<Text
				className={cn(
					height,
					'md:text-md text-left text-xs font-medium text-foreground/50 max-lines-[1]',
				)}
			>
				#{truncateMiddle(tokenId, 10) || '--'}
			</Text>

			<Text
				className={cn(
					height,
					'md:text-md ellipsis block text-left font-semibold text-foreground',
				)}
				title={name}
			>
				{name || '<unknown>'}
			</Text>

			{order && <Order height={height} order={order} />}
		</>
	);
};

type OrderProps = {
	height: string;
	order: OrderType;
};

const Order = ({ height, order }: OrderProps) => {
	const { data: currencies } = useCurrencies({
		chainId: order.chainId,
	});

	const currency = currencies?.find(
		(c) => c.contractAddress === order.priceCurrencyAddress,
	);

	return (
		<Flex className={cn(height, 'flex-1 items-center justify-between')}>
			<Flex className="items-center gap-2">
				<Avatar.Base size="xs">
					<Avatar.Image src={currency?.imageUrl} />
					<Avatar.Fallback>{currency?.name}</Avatar.Fallback>
				</Avatar.Base>
				<Text
					className="ellipsis text-sm md:text-base"
					title={String(currency?.name)}
				>
					{order.priceAmountFormatted || 'N/A'} {currency?.symbol}
				</Text>
			</Flex>
			<Badge variant="success">
				Stock: <span className="ml-1">{order.quantityRemainingFormatted}</span>
			</Badge>
		</Flex>
	);
};
