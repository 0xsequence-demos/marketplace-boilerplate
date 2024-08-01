'use client';

import React from 'react';

import { ConnectButton } from '~/components/buttons/ConnectButton';
import { NetworkSwitchButton } from '~/components/buttons/NetworkSwitchButton';
import { SEQUENCE_MARKET_V1_ADDRESS } from '~/config/consts';
import { getChain } from '~/config/networks';
import { env } from '~/env';
import type { OrderWithID } from '~/hooks/orderbook/useOrderbookOrders';
import { useERC20Approval } from '~/hooks/transactions/useERC20Approval';
import { useERC721Approval } from '~/hooks/transactions/useERC721Approval';
import { useERC1155Approval } from '~/hooks/transactions/useERC1155Approval';
import { useIsMinWidth } from '~/hooks/ui/useIsMinWidth';
import { useCountryCode } from '~/hooks/useCountryCode';
import { useNetworkSwitch } from '~/hooks/utils/useNetworkSwitch';
import {
  balanceQueries,
  collectableQueries,
  collectionQueries,
} from '~/lib/queries';
import { Orderbook } from '~/lib/sdk/orderbook/clients/Orderbook';
import {
  onTransactionFinish,
  setTransactionPendingState,
} from '~/lib/stores/Transaction';
import { cartState, toggleCart, resetCart } from '~/lib/stores/cart/Cart';
import { OrderItemType } from '~/lib/stores/cart/types';
import {
  checkCountryCodeValidity,
  checkCurrencyValidity,
} from '~/lib/utils/sardine';
import {
  type GenericStep,
  generateStepsOrderbookAcceptRequest,
  type AcceptRequest,
} from '~/lib/utils/txBundler';

import { Button, Text, Box, toast } from '$ui';
import { transactionNotification } from '../../../Notifications/transactionNotification';
import type { CheckoutSettings } from '@0xsequence/kit-checkout';
import {
  useCheckoutModal,
  useCheckoutWhitelistStatus,
} from '@0xsequence/kit-checkout';
import { useQueryClient } from '@tanstack/react-query';
import { snapshot, useSnapshot } from 'valtio';
import type { Hex } from 'viem';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import type { GetWalletClientData } from 'wagmi/query';

/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

interface OrderbookOrderButtonsProps {
  orders: OrderWithID[];
  erc20Address: string;
  erc20Amount: bigint;
  erc20Symbol: string;
  erc20Decimals: number;
  platformFee: bigint;
  frontEndFeeRecipient?: string;
  isLoading: boolean;
  hasMultipleCurrencies: boolean;
  containsInvalidOrder: boolean;
  frontendFeePercentage: number;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

export const OrderbookOrderButtons = ({
  orders,
  erc20Amount,
  erc20Symbol,
  erc20Decimals,
  erc20Address,
  platformFee,
  frontEndFeeRecipient,
  isLoading,
  hasMultipleCurrencies,
  containsInvalidOrder,
}: OrderbookOrderButtonsProps) => {
  const queryClient = useQueryClient();
  const {
    baseOrderInfo: { chainId, orderType: cartType },
    orderData,
    cartItems,
  } = useSnapshot(cartState);
  const isDesktop = useIsMinWidth('@xl');

  const { address: userAddress, isConnected, connector } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { triggerCheckout } = useCheckoutModal();

  const { networkMismatch, targetChainId } = useNetworkSwitch({
    targetChainId: chainId,
  });

  const defaultOrder = orders[0]!;
  const collectionAddress = defaultOrder?.tokenContract;

  const erc20ApprovalEnabled = !!erc20Amount && cartType === OrderItemType.BUY;

  const {
    data: erc20Approval,
    isLoading: isErc20ApprovalLoading,
    refetch: refetchErc20Approval,
  } = useERC20Approval({
    spenderAddress: SEQUENCE_MARKET_V1_ADDRESS,
    erc20Address: erc20Address,
    userAddress: userAddress,
    targetAmount: erc20Amount,
    chainId: chainId,
    disabled: !erc20ApprovalEnabled,
  });

  const erc721ApprovalEnabled =
    cartType === OrderItemType.SELL && defaultOrder?.isERC1155 === false;

  const {
    data: erc721Approval,
    isLoading: isErc721ApprovalLoading,
    refetch: refetchERC721Approval,
  } = useERC721Approval({
    operatorAddress: SEQUENCE_MARKET_V1_ADDRESS,
    erc721Address: collectionAddress,
    ownerAddress: userAddress,
    chainId: chainId,
    disabled: !erc721ApprovalEnabled,
  });

  const erc1155ApprovalEnabled =
    cartType === OrderItemType.SELL && defaultOrder?.isERC1155 === true;

  const {
    data: erc1155Approval,
    isLoading: isErc1155ApprovalLoading,
    refetch: refetchERC1155Approval,
  } = useERC1155Approval({
    operatorAddress: SEQUENCE_MARKET_V1_ADDRESS,
    erc1155Address: collectionAddress,
    ownerAddress: userAddress,
    chainId: chainId,
    disabled: !erc1155ApprovalEnabled,
  });

  const { data: countryCodeData } = useCountryCode();

  // To test sardine integration on localhost, set isDev to true
  const isDev = false;

  const { data: isCheckoutWhitelisted = false } = useCheckoutWhitelistStatus({
    chainId: chainId || 137,
    marketplaceAddress: SEQUENCE_MARKET_V1_ADDRESS,
    isDev,
  });

  if (!cartItems.length || !chainId || orders.length === 0) {
    return null;
  }

  if (hasMultipleCurrencies) {
    return <Button className="w-full" label="Disabled" disabled />;
  }

  const postTransactionCacheClear = () => {
    void queryClient.invalidateQueries({ queryKey: collectableQueries.all() });
    void queryClient.invalidateQueries({ queryKey: collectionQueries.all() });
    void queryClient.invalidateQueries({ queryKey: balanceQueries.all() });
  };

  const countryCode = isDev ? 'US' : countryCodeData;

  const isNFTCheckoutValidCountry = checkCountryCodeValidity(countryCode || '');
  const isNFTCheckoutValidCurrency = checkCurrencyValidity(
    erc20Address,
    chainId,
  );

  const showCreditCardButton =
    cartType === OrderItemType.BUY &&
    isNFTCheckoutValidCountry &&
    isNFTCheckoutValidCurrency &&
    isCheckoutWhitelisted;

  const renderBuyWithCreditCard = () => {
    if (!showCreditCardButton) {
      return null;
    }

    const isTooManyItems = cartItems.length > 1;
    const tooManyItemsMessage =
      'Only 1 item can be purchased at a time with a credit card';

    const cartItem = cartItems[0];

    const orderbook = new Orderbook({
      chainId,
      contractAddress: SEQUENCE_MARKET_V1_ADDRESS as Hex,
    });

    const onCreditCardSuccesss = async (txnHash: string) => {
      resetCart();

      await publicClient?.waitForTransactionReceipt({
        hash: txnHash as Hex,
        confirmations: 5,
      });

      postTransactionCacheClear();
    };

    const checkoutSettings: CheckoutSettings = {
      creditCardCheckout: {
        chainId: cartItem?.chainId || 137,
        contractAddress: SEQUENCE_MARKET_V1_ADDRESS,
        recipientAddress: userAddress!,
        currencyQuantity: String(cartItem?.subtotal || 0n),
        currencySymbol: erc20Symbol.toUpperCase(),
        currencyAddress: erc20Address.toLowerCase(),
        currencyDecimals: String(erc20Decimals),
        nftId: cartItem?.collectibleMetadata.tokenId || '',
        nftAddress: cartItem?.collectibleMetadata.collectionAddress || '',
        nftQuantity: String(cartItem?.quantity || 0n),
        nftDecimals: (cartItem?.collectibleMetadata.decimals || 0).toString(),
        calldata: orderbook.acceptRequest_data({
          orderId: BigInt(cartItem?.orderId || ''),
          quantity: cartItem?.quantity || 0n,
          receiver: userAddress!,
          additionalFees: [platformFee],
          additionalFeeReceivers: [frontEndFeeRecipient as Hex],
        }),
        approvedSpenderAddress: SEQUENCE_MARKET_V1_ADDRESS,
        isDev,
        onSuccess: (txnHash) => {
          onCreditCardSuccesss(txnHash).catch((e) => console.error(e));
        },
        onError: (error) => {
          console.error(error);
        },
      },
    };

    const onClickNFTCheckout = () => {
      triggerCheckout(checkoutSettings);
    };

    return (
      <>
        <Box title={isTooManyItems ? tooManyItemsMessage : undefined}>
          <Button
            className="w-full"
            label="BUY WITH CREDIT CARD"
            onClick={onClickNFTCheckout}
          />
        </Box>
        <Text className="text-center">OR</Text>
      </>
    );
  };

  if (!isConnected) {
    return (
      <ConnectButton
        variant="default"
        className="w-full"
        onClick={() => {
          if (!isDesktop) {
            toggleCart();
          }
        }}
      />
    );
  }

  if (containsInvalidOrder) {
    return <Button className="w-full" label="Invalid Order" disabled />;
  }

  if (
    (erc20ApprovalEnabled && isErc20ApprovalLoading) ||
    (erc721ApprovalEnabled && isErc721ApprovalLoading) ||
    (erc1155ApprovalEnabled && isErc1155ApprovalLoading) ||
    isLoading ||
    !orderData
  ) {
    return <Button className="w-full" label="estimating" disabled />;
  }

  if (erc20Approval?.isUserInsufficientBalance) {
    return (
      <>
        {renderBuyWithCreditCard()}
        <Button className="w-full" label="Insufficient Balance" disabled />
      </>
    );
  }

  const requiresErc20Approval =
    erc20ApprovalEnabled && erc20Approval?.isRequiresAllowanceApproval;

  const requiresErc721Approval =
    erc721ApprovalEnabled && erc721Approval?.isApprovedForAll === false;

  const requiresErc1155Approval =
    erc1155ApprovalEnabled && erc1155Approval?.isApprovedForAll === false;

  const requiresApproval =
    requiresErc20Approval || requiresErc721Approval || requiresErc1155Approval;

  const { steps, isBundled } = generateStepsOrderbookAcceptRequest({
    connectorId: connector?.id,
    tokenContract: collectionAddress,
    currency: erc20Address as Hex,
    chainId,
    isERC1155: defaultOrder?.isERC1155 === true,
    isListing: cartType === OrderItemType.BUY,
    isApproved: !requiresApproval,
    walletClient: walletClient as GetWalletClientData<any, any> | undefined,
  });

  const renderCurrencyApprovalButton = () => {
    const onApprove = async () => {
      if (!walletClient || !erc20Address) return;

      const approveStep = steps.find((s) => s.id === 'approveERC20') as
        | GenericStep
        | undefined;
      if (!approveStep) return;

      setTransactionPendingState(true);
      try {
        const txnHash = await approveStep.action();

        await transactionNotification({
          network: getChain(chainId)!,
          txHash: txnHash,
        });

        await refetchErc20Approval();
      } catch (error) {
        console.error(error);
        toast.error('Error approving token');
      } finally {
        setTransactionPendingState(false);
      }
    };

    if (erc20Approval?.isRequiresAllowanceApproval) {
      return (
        <Button
          className="w-full"
          label={`Approve`}
          variant="secondary"
          onClick={onApprove}
        />
      );
    }
  };

  const renderERC1155ApprovalButton = () => {
    const onApprove = async () => {
      if (!walletClient || !collectionAddress) return;

      const approveStep = steps.find((s) => s.id === 'approveERC1155') as
        | GenericStep
        | undefined;
      if (!approveStep) return;

      setTransactionPendingState(true);
      try {
        const txnHash = await approveStep.action();

        await transactionNotification({
          network: getChain(chainId)!,
          txHash: txnHash,
        });

        await refetchERC1155Approval();
      } catch (error) {
        console.error(error);
        toast.error('Error approving token');
      } finally {
        setTransactionPendingState(false);
      }
    };

    if (erc1155ApprovalEnabled && erc1155Approval?.isApprovedForAll === false) {
      return (
        <Button
          className="w-full"
          label={`Approve Collection`}
          variant="secondary"
          onClick={onApprove}
        />
      );
    }
  };

  const renderERC721ApprovalButton = () => {
    const onApprove = async () => {
      if (!walletClient || !collectionAddress) return;

      const approveStep = steps.find((s) => s.id === 'approveERC721') as
        | GenericStep
        | undefined;
      if (!approveStep) return;

      setTransactionPendingState(true);
      try {
        const txnHash = await approveStep.action();

        await transactionNotification({
          network: getChain(chainId)!,
          txHash: txnHash,
        });

        await refetchERC721Approval();
      } catch (error) {
        console.error(error);
        toast.error('Error approving token');
      } finally {
        setTransactionPendingState(false);
      }
    };

    if (erc721ApprovalEnabled && erc721Approval?.isApprovedForAll === false) {
      return (
        <Button
          className="w-full"
          label={`Approve Collection`}
          variant="secondary"
          onClick={onApprove}
        />
      );
    }
  };

  const buyAction = async () => {
    if (!walletClient || !orderData) return;

    const acceptOrderStep = steps.find((s) => s.id === 'acceptRequestBatch');
    if (!acceptOrderStep) return;

    setTransactionPendingState(true);

    try {
      const txnHash = await acceptOrderStep.action({
        acceptRequests: cartItems.map((item) => ({
          orderId: item.orderId!,
          quantity: item.quantity,
          address: userAddress || '',
          tokenId: item.collectibleMetadata.tokenId,
          additionalFees: [BigInt(platformFee?.toString() || 0n)],
          additionalFeeRecipients: [frontEndFeeRecipient as Hex],
        })) as [AcceptRequest, ...AcceptRequest[]],
      });

      await transactionNotification({
        network: getChain(chainId)!,
        txHash: txnHash,
      });

      postTransactionCacheClear();

      onTransactionFinish({
        transactionId: txnHash,
        cartItems: snapshot(cartState.cartItems),
        cartType: cartType,
      });

      resetCart();
    } catch (error: unknown) {
      showErrorToast(error);
    }

    setTransactionPendingState(false);
  };

  const sellAction = async () => {
    if (!walletClient || !orderData) return;

    const acceptOrderStep = steps.find((s) => s.id === 'acceptRequestBatch');
    if (!acceptOrderStep) return;

    setTransactionPendingState(true);

    try {
      const txnHash = await acceptOrderStep.action({
        acceptRequests: cartItems.map((item) => ({
          orderId: item.orderId!,
          quantity: item.quantity,
          address: userAddress || '',
          tokenId: item.collectibleMetadata.tokenId,
          additionalFees: [BigInt(platformFee?.toString() || 0n)],
          additionalFeeRecipients: [frontEndFeeRecipient as Hex],
        })) as [AcceptRequest, ...AcceptRequest[]],
      });

      await transactionNotification({
        network: getChain(chainId)!,
        txHash: txnHash,
      });

      postTransactionCacheClear();

      onTransactionFinish({
        transactionId: txnHash,
        cartItems: snapshot(cartState.cartItems),
        cartType: cartType,
      });

      resetCart();
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : 'unknown error';
      showErrorToast(error);
    }

    setTransactionPendingState(false);
  };

  const renderOrderButton = () => {
    const onBuyClick = () => {
      void buyAction();
    };

    const onSellClick = () => {
      void sellAction();
    };

    switch (cartType) {
      case OrderItemType.BUY:
        return (
          <Button
            className="w-full"
            label={`BUY`}
            onClick={onBuyClick}
            disabled={!isBundled && requiresApproval}
          />
        );
      case OrderItemType.SELL:
        return (
          <Button
            className="w-full"
            label={`SELL`}
            onClick={onSellClick}
            disabled={!isBundled && requiresApproval}
          />
        );
      default:
        break;
    }
  };

  if (networkMismatch) {
    return <NetworkSwitchButton targetChainId={targetChainId} />;
  }

  return (
    <>
      {cartType === OrderItemType.BUY && renderBuyWithCreditCard()}
      {!isBundled && renderCurrencyApprovalButton()}
      {!isBundled && renderERC1155ApprovalButton()}
      {!isBundled && renderERC721ApprovalButton()}
      {renderOrderButton()}
    </>
  );
};

const showErrorToast = (error: any) => {
  // https://github.com/MetaMask/rpc-errors/blob/main/src/error-constants.ts
  console.log('TRANSACTION ERROR CODE:', error?.code, error);

  switch (error?.code) {
    case 'ACTION_REJECTED':
    case 4001: {
      toast.error('User has rejected the Transaction!');
      break;
    }
    case -32003: {
      toast.error('User has rejected the transaction!');
      break;
    }
    default: {
      toast.error(error?.message?.substring(0, 100));
    }
  }
};
