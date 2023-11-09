import { Transfer, MesoError } from "@meso-network/types";

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

export enum TransferStatus {
  /** The transfer has been approved and is pending completion. */
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
  | { kind: MessageKind.CLOSE }
  | {
      kind: MessageKind.TRANSFER_UPDATE;
      payload: Pick<Transfer, "id" | "status" | "updatedAt"> &
        Partial<Pick<Transfer, "networkTransactionId">>;
    }
  | { kind: MessageKind.ERROR; payload: MesoError }
  | { kind: MessageKind.CONFIGURATION_ERROR; payload: MesoError };

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
 * A structured error returned when the post message bus cannot be initialized.
 */
export type PostMessageBusInitializationError = {
  /**
   * A _developer_ friendly message containing details of the error.
   */
  message: string;
};
