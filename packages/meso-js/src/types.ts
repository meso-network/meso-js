export enum Environment {
  /** For office use only. */
  LOCAL = "LOCAL",
  /** For office use only. */
  LOCAL_PROXY = "LOCAL_PROXY",
  /** For office use only. */
  DEV = "DEV",
  /** For office use only. */
  PREVIEW = "PREVIEW",
  /** In this environment, no crypto assets are transferred and no fiat assets are moved. */
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
export type UnsupportedNetworkErrorPayload = { error: MesoError };
export type UnsupportedAssetErrorPayload = { error: MesoError };

export enum EventKind {
  /** An error has occurred while the Meso experience was active.  */
  ERROR = "ERROR",
  /** An error has occurred while initializing the Meso experience. */
  CONFIGURATION_ERROR = "CONFIGURATION_ERROR",
  /** The `network` provided in the configuration is not supported. */
  UNSUPPORTED_NETWORK_ERROR = "UNSUPPORTED_NETWORK_ERROR",
  /** The `destinationAsset` provided in the configuration is not supported. */
  UNSUPPORTED_ASSET_ERROR = "UNSUPPORTED_ASSET_ERROR",
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
  | {
      kind: EventKind.UNSUPPORTED_NETWORK_ERROR;
      payload: UnsupportedNetworkErrorPayload;
    }
  | {
      kind: EventKind.UNSUPPORTED_ASSET_ERROR;
      payload: UnsupportedAssetErrorPayload;
    }
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
  SOLANA_MAINNET = "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
  POLYGON_MAINNET = "eip155:137",
  OP_MAINNET = "eip155:10",
}

export enum Asset {
  // CryptoAsset
  ETH = "ETH",
  SOL = "SOL",
  USDC = "USDC",
  MATIC = "MATIC",

  // FiatAsset
  USD = "USD",
}

export const CryptoAsset = {
  [Asset.ETH]: Asset.ETH,
  [Asset.SOL]: Asset.SOL,
  [Asset.USDC]: Asset.USDC,
  [Asset.MATIC]: Asset.MATIC,
} as const;

export const FiatAsset = {
  [Asset.USD]: Asset.USD,
} as const;

/**
 * A stringified number representing an amount of USD.
 *
 * This value can optionally contain decimals and minor units if needed.
 *
 * Examples: `"10",`"0.01"`, `"1.2"`, `"100.23"`, `"1250"`, `"1250.40"`
 */
export type AssetAmount = `${number}${"." | ""}${number | ""}`;

/**
 * @deprecated Legacy type for amount when only cash-in was supported
 */
export type USDAmount = AssetAmount;

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
 * A stringified positive integer (excluding units) representing a number of pixels.
 */
export type PixelValue = `${number}`;

/**
 * Configuration to customize how the Meso experience is launched and presented.
 */
export type Layout = {
  /**
   * The position to launch the Meso experience. Defaults to `Position.TOP_RIGHT`.
   */
  position?: Position;
  /**
   * The number of pixels from the edges of the viewport to position the Meso experience.
   *
   * Offset values are additive. By default, Meso adds it's own `16px` offset.
   *
   * Providing a single value (e.g. `"10"`) will apply the offset to both the `x` and `y` axes.
   *
   * If an object specifying the `horizontal` or `vertical` values is provided, the offset will be applied to each axis respectively.
   * Omitting a value in this object will default to `"0"`.
   *
   * **Examples:**
   *
   * - `"10"` – Will apply a 10px offset to the Meso experience.
   * - `{ horizontal: "10" }` – Will apply a 10px offset horizontally (relative to the assigned `Position`) and 0 to the vertical offset.
   * - `{ vertical: "10" }` – Will apply a 10px offset vertically (relative to the assigned `Position`) and 0 to the horizontal offset.
   * - `{ horizontal: "10", vertical: "25" }` – Will apply a 10px offset 25px offset to the horizontal and vertical axes respectively (relative to the assigned `Position`).
   *
   * If no offset is provided, this value defaults to `"0"`.
   */
  offset?:
    | PixelValue
    | {
        /**
         * A value representing the horizontal (x-axis) offset relative to the assigned `Position`.
         */
        horizontal?: PixelValue;
        /**
         * A value representing the vertical (y-axis) offset relative to the assigned `Position`.
         */
        vertical: PixelValue;
      }
    | {
        /**
         * A value representing the horizontal (x-axis) offset relative to the assigned `Position`.
         */
        horizontal: PixelValue;
        /**
         * A value representing the vertical (y-axis) offset relative to the assigned `Position`.
         */
        vertical?: PixelValue;
      };
};

/**
 * Shared parameters to initialize the Meso experience.
 */
export type BaseConfiguration = Readonly<{
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
   * A stringified number including decimals (if needed) representing the amount to be used for the transfer.
   *
   * Examples: `"10",`"0.01"`, `"1.2"`, `"100.23"`, `"1250", `"1250.40"`.
   */
  sourceAmount: AssetAmount;
  /**
   * Configuration to customize how the Meso experience is launched and presented.
   */
  layout?: Layout;
  /**
   * Determines the authentication mechanism for users to perform a transfer.
   *
   * In all scenarios, the user will still be required to perform two-factor authentication (2FA) and, in some cases provide email/password.
   *
   * If omitted, this will default to {@link AuthenticationStrategy.WALLET_VERIFICATION|WALLET_VERIFICATION}.
   */
  authenticationStrategy?: AuthenticationStrategy;
  /**
   * A handler to notify you when a message needs to be signed.
   */
  onSignMessageRequest: (message: string) => Promise<SignedMessageResult>;
  /**
   * A handler to notify you when an event has occurred.
   */
  onEvent: (event: MesoEvent) => void;
}>;

export type CashInConfiguration = BaseConfiguration & {
  /**
   * The fiat asset to be used. Defaults to `Asset.USD`.
   */
  sourceAsset?: keyof typeof FiatAsset;
  /**
   * The crypto asset to be transferred.
   */
  destinationAsset: keyof typeof CryptoAsset;
};

export type CashOutConfiguration = BaseConfiguration & {
  /**
   * The crypto asset to be transferred.
   */
  sourceAsset: keyof typeof CryptoAsset;
  /**
   * The fiat asset to be cashed out.
   */
  destinationAsset: keyof typeof FiatAsset;
  /**
   * A handler to notify you when a transaction needs to be sent.
   *
   * @param amount - quantity of the cryptocurrency to send.
   * @param recipientAddress - wallet address of the transaction recipient.
   * @param tokenAddress - contract address of the token being send.
   * @param decimals - number of decimal places used for the token.
   */
  onSendTransactionRequest: (
    amount: string,
    recipientAddress: string,
    tokenAddress: string,
    decimals: number,
  ) => Promise<void>;
};

export type TransferConfiguration = CashInConfiguration | CashOutConfiguration;

/**
 * Used to determine the type of authentication the user will need to perform for a transfer.
 */
export enum AuthenticationStrategy {
  /** Verify wallet by signing a message.
   *
   * New users and returning users with new wallets will still need to perform 2FA and login with email/password.
   **/
  WALLET_VERIFICATION = "wallet_verification",
  /** Verify a wallet by signing a message in the background _without_ prompting the user. This is useful for scenarios such as embedded wallets.
   *
   * New users and returning users with new wallets will still need to perform login and 2FA.
   */
  HEADLESS_WALLET_VERIFICATION = "headless_wallet_verification",
  /** Bypass wallet signing altogether and rely only on email/password and 2FA.
   *
   * This is useful for cases where pre-deployment smart contract wallets are being used and wallet verification cannot be performed.
   */
  BYPASS_WALLET_VERIFICATION = "bypass_wallet_verification",
}

/**
 * Configuration that will be serialized to query params for the Transfer App.
 */
export type TransferIframeParams = Pick<
  TransferConfiguration,
  | "partnerId"
  | "network"
  | "walletAddress"
  | "sourceAmount"
  | "sourceAsset"
  | "destinationAsset"
  | "authenticationStrategy"
> & {
  layoutPosition: NonNullable<Layout["position"]>;
  layoutOffset: NonNullable<Layout["offset"]>;
  /** The version of meso-js. */
  version: string;
  /** The mode for the rendering context of the Meso experience. */
  mode: TransferExperienceMode;
};

/**
 * The serialized configuration sent to the Transfer App as a query string.
 */
export type SerializedTransferIframeParams = Record<
  keyof TransferIframeParams,
  string
>;

/**
 * The mode for the rendering context of the Meso experience.
 */
export enum TransferExperienceMode {
  /**
   * Intended to run inside an iframe in a web browser.
   */
  EMBEDDED = "embedded",
  /**
   * Intended to run inside a webview in a native mobile app.
   */
  WEBVIEW = "webview",
}

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

/**
 * Kind of messages sent between the Meso experience and parent window.
 */
export enum MessageKind {
  /**
   * Request from Meso experience to parent window to initiate signing.
   */
  REQUEST_SIGNED_MESSAGE = "REQUEST_SIGNED_MESSAGE",
  /**
   * Dispatch the result of a signature request from the parent window to the Meso experience.
   */
  RETURN_SIGNED_MESSAGE_RESULT = "RETURN_SIGNED_MESSAGE_RESULT",
  /**
   * Request from Meso experience to parent window to initiate sending of transaction.
   */
  REQUEST_SEND_TRANSACTION = "REQUEST_SEND_TRANSACTION",
  /**
   * Dispatch a message from the Meso experience to the parent window to close the experience.
   */
  CLOSE = "CLOSE",
  /**
   * Dispatch a message from the Meso experience to the parent window when the transfer has been updated.
   */
  TRANSFER_UPDATE = "TRANSFER_UPDATE",
  /**
   * Dispatch an error message from the Meso experience to the parent window.
   */
  ERROR = "ERROR",
  /**
   * Dispatch a configuration error when the Meso experience cannot be initialized.
   */
  CONFIGURATION_ERROR = "CONFIGURATION_ERROR",
  /**
   * Dispatch an unsupported network error when the `network` passed to initialize the Meso experience is not supported.
   */
  UNSUPPORTED_NETWORK_ERROR = "UNSUPPORTED_NETWORK_ERROR",
  /**
   * Dispatch an unsupported asset error when the `destinationAsset` passed to initialize the Meso experience is not supported.
   */
  UNSUPPORTED_ASSET_ERROR = "UNSUPPORTED_ASSET_ERROR",
}

export type RequestSignedMessagePayload = {
  /**
   * An opaque message to be signed via an action in the parent window.
   */
  messageToSign: string;
};

export type ReturnSignedMessagePayload = {
  /**
   * Signed message from parent window to Meso experience for blockchain address verification.
   *
   * This value will be omitted if the user cancels or rejects the wallet signature request.
   */
  signedMessage?: string;
};

export type RequestSendTransactionPayload = {
  /*
   * A stringified number including decimal (if needed) representing the
   * quantity to send for the transaction (e.g. `"10",`"0.01"`, `"1.2"`,
   * `"100.23"`, `"1250", `"1250.40"`).
   */
  amount: AssetAmount;
  /*
   * Wallet address of the transaction recipient (i.e. the Meso Deposit Address for Cash-Ins).
   */
  recipientAddress: string;
  /*
   * Contract address of the token being send (e.g.
   * "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" for USDC on Ethereum).
   */
  tokenAddress: string;
  /*
   * Number of decimal places used for the token (e.g. 6 for USDC on Ethereum).
   */
  decimals: number;
};

/**
 * Structured `window.postMessage` messages between the Meso experience to parent window
 */
export type Message =
  | {
      kind: MessageKind.REQUEST_SIGNED_MESSAGE;
      payload: RequestSignedMessagePayload;
    }
  | {
      kind: MessageKind.RETURN_SIGNED_MESSAGE_RESULT;
      payload: ReturnSignedMessagePayload;
    }
  | {
      kind: MessageKind.REQUEST_SEND_TRANSACTION;
      payload: RequestSendTransactionPayload;
    }
  | { kind: MessageKind.CLOSE }
  | {
      kind: MessageKind.TRANSFER_UPDATE;
      payload: Pick<Transfer, "id" | "status" | "updatedAt"> &
        Partial<Pick<Transfer, "networkTransactionId">>;
    }
  | { kind: MessageKind.ERROR; payload: MesoError }
  | { kind: MessageKind.CONFIGURATION_ERROR; payload: MesoError }
  | { kind: MessageKind.UNSUPPORTED_NETWORK_ERROR; payload: MesoError }
  | { kind: MessageKind.UNSUPPORTED_ASSET_ERROR; payload: MesoError };

export type PostMessageHandlerFn = (
  message: Message,
  /**
   * The `reply` callback can be used to emit a message back to the origin that sent the original message.
   */
  reply: (message: Message) => void,
) => void;

/**
 * The return type from creating a "bus". This can be used to attach/detach from events and send messages.
 */
export type PostMessageBus = {
  /**
   * Subscribe to an event using the message kind (name).
   *
   * The attached handler will be invoked each time this event is seen until the event handler is detached.
   */
  on: (eventKind: MessageKind, handler: PostMessageHandlerFn) => PostMessageBus;

  /**
   * Send a message to a specific [origin](https://developer.mozilla.org/en-US/docs/Web/API/Location/origin). If the `targetOrigin` is omitted, the message will be broadcast to all origins (`*`).
   */
  emit: (message: Message, targetOrigin?: string) => PostMessageBus;

  /**
   * Detach event handlers and end post message communications.
   */
  destroy: () => void;
};

/**
 * A handler function for a message event.
 */
export type HandlerFn = Parameters<PostMessageBus["on"]>[1];

/**
 * A structured error returned when the post message bus cannot be initialized.
 */
export type PostMessageBusInitializationError = {
  /**
   * A _developer_ friendly message containing details of the error.
   */
  message: string;
};
