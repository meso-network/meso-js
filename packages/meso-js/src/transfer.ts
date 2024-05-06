import { setupBus } from "./bus";
import { setupFrame } from "./frame";
import { version } from "../package.json";
import {
  Asset,
  AuthenticationStrategy,
  CashOutConfiguration,
  Environment,
  Layout,
  Position,
  TransferConfiguration,
  TransferExperienceMode,
  TransferInstance,
} from "./types";
import { validateTransferConfiguration } from "./validateTransferConfiguration";
import { store } from "./store";

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
    container,
  } = transferConfiguration;
  // TODO: REVERT THIS!!!!!
  const apiHost = apiHosts[Environment.LOCAL];
  let containerElement: Element | null = null;

  if (container) {
    // Validate container
    containerElement = document.querySelector(container);

    // TODO: Structure this error
    if (!containerElement) {
      throw new Error(`Invalid container: ${container}`);
    }
  }

  const frame = setupFrame(
    apiHost,
    {
      partnerId,
      network,
      walletAddress,
      sourceAmount,
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
    },
    containerElement,
  );

  const bus = setupBus({
    apiHost,
    frame,
    onEvent,
    onSignMessageRequest,
    onSendTransactionRequest: (transferConfiguration as CashOutConfiguration)
      .onSendTransactionRequest,
    store,
  });

  return {
    destroy: () => {
      frame.remove();
      bus.destroy();
    },
  };
};
