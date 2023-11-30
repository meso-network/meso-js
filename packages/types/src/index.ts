export enum Environment {
  /** For office use only. */
  LOCAL = "LOCAL",
  /** For office use only. */
  LOCAL_PROXY = "LOCAL_PROXY",
  /** For office use only. */
  DEV = "DEV",
  /** For office use only. */
  PREVIEW = "PREVIEW",
  /** In this environment, testnets will be used to transfer crypto assets. No fiat assets are moved. */
  SANDBOX = "SANDBOX",
  /** In this environment, production networks will be used to transfer real crypto assets. Fiat assets are moved. */
  PRODUCTION = "PRODUCTION",
}

export enum TransferStatus {
  /** The transfer has been approved and is pending completion.
   *
   * At this point, funds have _not_ yet been moved.
   */
  APPROVED = "APPROVED",
  /** The transfer is complete and the user's funds are available. */
  COMPLETE = "COMPLETE",
  /** The transfer has failed. */
  DECLINED = "DECLINED",
  /** The transfer is in flight. */
  EXECUTING = "EXECUTING",
  UNKNOWN = "UNKNOWN",
}

/**
 * A fiat-to-crypto transfer.
 */
export type Transfer = {
  /**
   * The unique identifier for the Meso transfer. This can be used to look-up the status of the transfer or present UI to a user upon completion.
   */
  id: string;
  status: TransferStatus;
  updatedAt: string;
  /**
   * The on-chain identifier for the transfer.
   *
   * **Note:** This will only be available for transfers that are `COMPLETE`.
   */
  networkTransactionId?: string;
};

/**
 * An error surfaced from the `meso-js` integration.
 */
export type MesoError = {
  /** A client-friendly error message. */
  message: string;
};

export type TransferApprovedPayload = {
  transfer: Transfer & { status: TransferStatus.APPROVED };
};
export type TransferCompletePayload = {
  transfer: Transfer & { status: TransferStatus.COMPLETE };
};
export type ErrorPayload = { error: MesoError };
export type ConfigurationErrorPayload = { error: MesoError };

export enum EventKind {
  /** An error has occurred while the Meso experience was active.  */
  ERROR = "ERROR",
  /** An error has occurred while initializing the Meso experience. */
  CONFIGURATION_ERROR = "CONFIGURATION_ERROR",
  /** The user manually exited the Meso experience. */
  CLOSE = "CLOSE",
  /** A Meso transfer has been approved */
  TRANSFER_APPROVED = "TRANSFER_APPROVED",
  /** A Meso transfer has completed */
  TRANSFER_COMPLETE = "TRANSFER_COMPLETE",
}

/**
 * All available events that will be surfaced via the `onEvent` callback.
 */
export type MesoEvent =
  | { kind: EventKind.TRANSFER_APPROVED; payload: TransferApprovedPayload }
  | { kind: EventKind.TRANSFER_COMPLETE; payload: TransferCompletePayload }
  | { kind: EventKind.ERROR; payload: ErrorPayload }
  | { kind: EventKind.CONFIGURATION_ERROR; payload: ConfigurationErrorPayload }
  | { kind: EventKind.CLOSE; payload: null };

/**
 * The expected result from requesting the user to sign a message with their wallet.
 *
 * Returning `undefined` will indicate the user rejected or canceled the signature request and the Meso flow will be updated to re-prompt for another signature.
 */
export type SignedMessageResult = Readonly<string> | undefined;

/**
 * A [CAIP-2](https://chainagnostic.org/CAIPs/caip-2) network identifier.
 */
export enum Network {
  ETHEREUM_MAINNET = "eip155:1",
  ETHEREUM_GOERLI = "eip155:5",
  SOLANA_MAINNET = "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
  SOLANA_DEVNET = "solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1",
  SOLANA_TESTNET = "solana:4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z",
}

/**
 * Symbol representing a crypto/fiat currency.
 */
export enum Asset {
  ETH = "ETH",
  SOL = "SOL",
  USDC = "USDC",
}

/**
 * A stringified number representing an amount of USD.
 *
 * This value can optionally contain decimals and minor units if needed.
 *
 * Examples: `"10",`"0.01"`, `"1.2"`, `"100.23"`, `"1250"`, `"1250.40"`
 */
export type USDAmount = `${number}${"." | ""}${number | ""}`;

/**
 * Screen position to launch the Meso experience.
 */
export enum Position {
  TOP_RIGHT = "top-right",
  BOTTOM_RIGHT = "bottom-right",
  BOTTOM_LEFT = "bottom-left",
  TOP_LEFT = "top-left",
  CENTER = "center",
}

/**
 * Parameters to initialize the Meso experience.
 */
export type TransferConfiguration = Readonly<{
  /**
   * The Meso environment to use. (`Environment.SANDBOX` | `Environment.PRODUCTION`).
   */
  environment: Environment;
  /**
   * Unique ID for your partner account.
   */
  partnerId: string;
  /**
   * The network to be used for the transfer.
   */
  network: Network;
  /** The wallet address for the user. This address must be compatible with the selected `network` and `destinationAsset`. */
  walletAddress: string;
  /**
   * A stringified number including decimals (if needed) representing the fiat amount to be used for the transfer.
   *
   * Examples: `"10",`"0.01"`, `"1.2"`, `"100.23"`, `"1250", `"1250.40"`.
   */
  sourceAmount: USDAmount;
  /**
   * The asset to be transferred.
   */
  destinationAsset: Asset;
  /**
   * The position to launch the Meso experience.
   */
  position: Position;
  /**
   * A handler to notify you when a message needs to be signed.
   */
  onSignMessageRequest: (message: string) => Promise<SignedMessageResult>;
  /**
   * A handler to notify you when an event has occurred.
   */
  onEvent: (event: MesoEvent) => void;
}>;

/**
 * Subset of TransferConfiguration keys passed to Meso experience iframe
 */
export type TransferIframeParams = Pick<
  TransferConfiguration,
  | "partnerId"
  | "network"
  | "walletAddress"
  | "sourceAmount"
  | "destinationAsset"
  | "position"
> & {
  /** The version of meso-js. */
  version: string;
};

/**
 * The handler to the instance returned when calling `transfer()`.
 */
export type TransferInstance = {
  /**
   * Tears down the Meso experience and removes the injected iframe from the DOM. No further events will be dispatched once called.
   *
   * Calling this method may interrupt any in flight requests or transfers so it is recommended to use it
   * only in the case of errors.
   *
   * If the transfer flow completes (regardless of transfer status), the integration will automatically be cleaned up
   * and you do not need to call this method.
   */
  destroy: () => void;
};
