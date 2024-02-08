import { Message, MessageKind, TransferStatus } from "./types";

const isString = (str?: string) => {
  return str && typeof str === "string";
};

const isEmptyString = (str?: string) => str && str.trim().length === 0;

const isEmptyObject = (obj: object) =>
  typeof obj === "object" && Object.keys(obj).length === 0;

const isValidTransferUpdatePayload = (
  payload: Extract<Message, { kind: MessageKind.TRANSFER_UPDATE }>["payload"],
): boolean => {
  if (!isString(payload.id) || isEmptyString(payload.id)) {
    return false;
  }

  if (!(payload.status in TransferStatus)) {
    return false;
  }

  if (!isString(payload.updatedAt) || isEmptyString(payload.updatedAt)) {
    return false;
  }

  if (payload.networkTransactionId && !isString(payload.networkTransactionId)) {
    return false;
  }

  return true;
};

export const validateMessageKind = (messageKind: MessageKind) => {
  return messageKind in MessageKind;
};

export const validateMessage = (message: Message) => {
  switch (message.kind) {
    case MessageKind.REQUEST_SIGNED_MESSAGE:
      if (
        !message.payload ||
        !isString(message.payload.messageToSign) ||
        isEmptyString(message.payload.messageToSign)
      ) {
        return false;
      }

      return true;
    case MessageKind.RETURN_SIGNED_MESSAGE_RESULT:
      if (!message.payload) {
        return false;
      }

      if (message.payload.signedMessage === undefined) {
        return true;
      }

      if (
        !isString(message.payload.signedMessage) ||
        isEmptyString(message.payload.signedMessage)
      ) {
        return false;
      }

      return true;
    case MessageKind.CLOSE:
      if ("payload" in message) {
        return false;
      }
      return true;
    case MessageKind.TRANSFER_UPDATE:
      if (!("payload" in message)) {
        return false;
      }

      if (isEmptyObject(message.payload)) {
        return false;
      }

      if (!isValidTransferUpdatePayload(message.payload)) {
        return false;
      }

      return true;
    case MessageKind.ERROR:
    case MessageKind.CONFIGURATION_ERROR:
    case MessageKind.UNSUPPORTED_NETWORK_ERROR:
    case MessageKind.UNSUPPORTED_ASSET_ERROR:
      if (!("payload" in message)) {
        return false;
      }

      if (isEmptyObject(message.payload)) {
        return false;
      }

      if (
        !isString(message.payload.message) ||
        isEmptyString(message.payload.message)
      ) {
        return false;
      }

      return true;
    case undefined:
      return false;
  }
};

export const validateHandlerFunction = (fn: unknown) =>
  typeof fn === "function";
