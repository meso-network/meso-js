import { setupBus } from "./bus";
import { setupFrame } from "./frame";
import { validateTransferConfiguration } from "./validateTransferConfiguration";
import { version } from "../package.json";
import {
  AuthenticationStrategy,
  BaseConfiguration,
  CashInConfiguration,
  CashOutConfiguration,
  CryptoAsset,
  Environment,
  FiatAsset,
  Layout,
  Position,
  TransferConfiguration,
  TransferExperienceMode,
  TransferInstance,
} from "./types";

const apiHosts: { readonly [key in Environment]: string } = {
  [Environment.LOCAL]: "http://localhost:5173",
  [Environment.LOCAL_PROXY]: "http://localhost:4001",
  [Environment.DEV]: "https://api.dev.meso.plumbing",
  [Environment.PREVIEW]: "https://api.preview.meso.plumbing",
  [Environment.SANDBOX]: "https://api.sandbox.meso.network",
  [Environment.PRODUCTION]: "https://api.meso.network",
};

const NOOP_TRANSFER_INSTANCE = { destroy: () => {} };

export const DEFAULT_LAYOUT: Required<Layout> = {
  position: Position.TOP_RIGHT,
  offset: "0",
};

export const transfer = ({
  sourceAmount,
  network,
  walletAddress,
  destinationAsset,
  environment,
  partnerId,
  layout = DEFAULT_LAYOUT,
  authenticationStrategy = AuthenticationStrategy.WALLET_VERIFICATION,
  onSignMessageRequest,
  onEvent,
  ...rest
}: TransferConfiguration): TransferInstance => {
  const mergedLayout = { ...DEFAULT_LAYOUT, ...layout };
  const onSendTransactionRequest =
    "onSendTransactionRequest" in rest
      ? rest.onSendTransactionRequest
      : undefined;

  const baseConfiguration: BaseConfiguration = {
    sourceAmount,
    network,
    walletAddress,
    environment,
    partnerId,
    layout: mergedLayout,
    authenticationStrategy,
    onSignMessageRequest,
    onEvent,
  };

  if (destinationAsset in FiatAsset) {
    const cashOutConfiguration: CashOutConfiguration = {
      ...baseConfiguration,
      destinationAsset: destinationAsset as FiatAsset,
      onSendTransactionRequest: onSendTransactionRequest!,
    };
    if (!validateTransferConfiguration(cashOutConfiguration))
      return NOOP_TRANSFER_INSTANCE;
  } else if (destinationAsset in CryptoAsset) {
    const cashInConfiguration: CashInConfiguration = {
      ...baseConfiguration,
      destinationAsset: destinationAsset as CryptoAsset,
    };
    if (!validateTransferConfiguration(cashInConfiguration))
      return NOOP_TRANSFER_INSTANCE;
  } else {
    return NOOP_TRANSFER_INSTANCE;
  }

  const apiHost = apiHosts[environment];
  const frame = setupFrame(apiHost, {
    partnerId,
    network,
    walletAddress,
    sourceAmount,
    destinationAsset,
    layoutPosition: mergedLayout.position,
    layoutOffset:
      typeof mergedLayout.offset === "string"
        ? mergedLayout.offset
        : JSON.stringify(mergedLayout.offset),
    version,
    authenticationStrategy,
    mode: TransferExperienceMode.EMBEDDED,
  });
  const bus = setupBus(
    apiHost,
    frame,
    onEvent,
    onSignMessageRequest,
    onSendTransactionRequest,
  );

  return {
    destroy: () => {
      frame.remove();
      bus.destroy();
    },
  };
};
