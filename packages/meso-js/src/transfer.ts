import { setupBus } from "./bus";
import { setupFrame } from "./frame";
import { version } from "../package.json";
import {
  Asset,
  AuthenticationStrategy,
  CashOutConfiguration,
  Layout,
  Position,
  TransferConfiguration,
  TransferExperienceMode,
  TransferInstance,
} from "./types";
import { validateTransferConfiguration } from "./validateConfiguration";
import { apiHosts, NOOP_TRANSFER_INSTANCE } from "./utils";

export const DEFAULT_LAYOUT: Required<Layout> = {
  position: Position.TOP_RIGHT,
  offset: "0",
};

export const transfer = (
  transferConfiguration: TransferConfiguration,
): TransferInstance => {
  transferConfiguration = {
    // BaseConfiguration defaults
    layout: { ...DEFAULT_LAYOUT, ...transferConfiguration.layout },
    authenticationStrategy: AuthenticationStrategy.WALLET_VERIFICATION,

    // CashInConfiguration defaults
    // sourceAsset is only optional in Cash-in case (for backwards compatibility
    // with previous versions), remove when adding support for other FiatAssets
    // and we make sourceAsset required
    sourceAsset: Asset.USD,

    ...transferConfiguration,
  };
  if (!validateTransferConfiguration(transferConfiguration)) {
    return NOOP_TRANSFER_INSTANCE;
  }

  const {
    sourceAmount,
    destinationAmount,
    network,
    walletAddress,
    environment,
    partnerId,
    layout,
    authenticationStrategy,
    sourceAsset,
    destinationAsset,
    onSignMessageRequest,
    onEvent,
  } = transferConfiguration;
  const apiHost = apiHosts[environment];

  const frame = setupFrame(apiHost, {
    sourceAmount,
    destinationAmount,
    partnerId,
    network,
    walletAddress,
    destinationAsset,
    sourceAsset: sourceAsset!,
    layoutPosition: layout!.position!,
    layoutOffset:
      typeof layout!.offset === "string"
        ? layout!.offset
        : JSON.stringify(layout!.offset),
    version,
    authenticationStrategy: authenticationStrategy!,
    mode: TransferExperienceMode.EMBEDDED,
  });

  const bus = setupBus({
    apiHost,
    frame,
    onEvent,
    onSignMessageRequest,
    onSendTransactionRequest: (transferConfiguration as CashOutConfiguration)
      .onSendTransactionRequest,
  });

  return {
    destroy: () => {
      frame.remove();
      bus.destroy();
    },
  };
};
