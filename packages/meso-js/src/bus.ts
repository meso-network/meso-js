import { setupFrame } from "./frame";
import {
  MessageKind,
  EventKind,
  Transfer,
  TransferStatus,
  TransferApprovedPayload,
  TransferCompletePayload,
  TransferConfiguration,
} from "./types";
import { createPostMessageBus } from "./createPostMessageBus";

export const setupBus = (
  apiHost: string,
  frame: ReturnType<typeof setupFrame>,
  onSignMessageRequest: TransferConfiguration["onSignMessageRequest"],
  onEvent: TransferConfiguration["onEvent"],
) => {
  const bus = createPostMessageBus(apiHost);
  if ("message" in bus) {
    throw new Error(
      "Unable to initialize @meso-network/meso-js. Invalid iframe configuration.",
    );
  }

  bus.on(MessageKind.REQUEST_SIGNED_MESSAGE, async (message, reply) => {
    if (message.kind === MessageKind.REQUEST_SIGNED_MESSAGE) {
      const signedMessage = await onSignMessageRequest(
        message.payload.messageToSign,
      );

      reply({
        kind: MessageKind.RETURN_SIGNED_MESSAGE_RESULT,
        payload: { signedMessage },
      });
    }
  });

  bus.on(MessageKind.CLOSE, () => {
    frame.remove();
    onEvent({ kind: EventKind.CLOSE, payload: null });
    bus.destroy();
  });

  bus.on(MessageKind.TRANSFER_UPDATE, (message) => {
    if (message.kind !== MessageKind.TRANSFER_UPDATE) return;

    const transfer = message.payload as Transfer;
    if (transfer.status == TransferStatus.APPROVED) {
      frame.hide();
      onEvent({
        kind: EventKind.TRANSFER_APPROVED,
        payload: { transfer: transfer as TransferApprovedPayload["transfer"] },
      });
    } else if (transfer.status === TransferStatus.COMPLETE) {
      frame.remove();
      onEvent({
        kind: EventKind.TRANSFER_COMPLETE,
        payload: { transfer: transfer as TransferCompletePayload["transfer"] },
      });
      bus.destroy();
    }
  });

  bus.on(MessageKind.ERROR, (message) => {
    if (message.kind !== MessageKind.ERROR) return;
    onEvent({ kind: EventKind.ERROR, payload: { error: message.payload } });
  });

  bus.on(MessageKind.CONFIGURATION_ERROR, (message) => {
    if (message.kind !== MessageKind.CONFIGURATION_ERROR) return;
    onEvent({
      kind: EventKind.CONFIGURATION_ERROR,
      payload: { error: message.payload },
    });
  });

  bus.on(MessageKind.UNSUPPORTED_NETWORK_ERROR, (message) => {
    if (message.kind !== MessageKind.UNSUPPORTED_NETWORK_ERROR) return;
    onEvent({
      kind: EventKind.UNSUPPORTED_NETWORK_ERROR,
      payload: { error: message.payload },
    });
  });

  bus.on(MessageKind.UNSUPPORTED_ASSET_ERROR, (message) => {
    if (message.kind !== MessageKind.UNSUPPORTED_ASSET_ERROR) return;
    onEvent({
      kind: EventKind.UNSUPPORTED_ASSET_ERROR,
      payload: { error: message.payload },
    });
  });

  return bus;
};
