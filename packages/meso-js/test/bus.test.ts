import {
  TransferConfiguration,
  TransferStatus,
  MessageKind,
} from "../src/types";
import { setupBus } from "../src/bus";
import { setupFrame } from "../src/frame";
import { Mock } from "vitest";

var createPostMessageBusMock: Mock;
vi.mock("../src/createPostMessageBus", async () => {
  const actual = await vi.importActual("../src/createPostMessageBus");
  createPostMessageBusMock = vi.fn();
  return {
    ...(actual as object),
    createPostMessageBus: createPostMessageBusMock,
  };
});

describe("setupBus", () => {
  const apiHost = "https://api.sandbox.meso.network";
  var frame: ReturnType<typeof setupFrame>;
  var removeMock: Mock;
  var hideMock: Mock;
  var onSignMessageRequestMock: Mock<
    Parameters<TransferConfiguration["onSignMessageRequest"]>,
    ReturnType<TransferConfiguration["onSignMessageRequest"]>
  >;
  var onEventMock: Mock<
    Parameters<TransferConfiguration["onEvent"]>,
    ReturnType<TransferConfiguration["onEvent"]>
  >;

  beforeEach(() => {
    vi.resetAllMocks();

    removeMock = vi.fn();
    hideMock = vi.fn();
    frame = {
      kind: "embedded",
      element: {} as HTMLIFrameElement,
      remove: removeMock,
      hide: hideMock,
    };

    onSignMessageRequestMock = vi.fn();
    onEventMock = vi.fn();
  });

  test("throws with initialization error", () => {
    createPostMessageBusMock.mockImplementationOnce(() => ({
      message: "initialization error",
    }));

    expect(() =>
      setupBus({
        apiHost,
        frame,
        onEvent: onEventMock,
        onSignMessageRequest: onSignMessageRequestMock,
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      '"Unable to initialize @meso-network/meso-js. Invalid iframe configuration."',
    );
  });

  test("handles REQUEST_SIGNED_MESSAGE message", async () => {
    const onMock = vi.fn();
    createPostMessageBusMock.mockImplementationOnce(() => ({ on: onMock }));

    setupBus({
      apiHost,
      frame,
      onEvent: onEventMock,
      onSignMessageRequest: onSignMessageRequestMock,
    });
    expect(onMock).toBeCalledWith(
      MessageKind.REQUEST_SIGNED_MESSAGE,
      expect.any(Function),
    );
    const onRequestSignedMessageCallback = onMock.mock.calls.find(
      (invocationArgs) =>
        invocationArgs[0] === MessageKind.REQUEST_SIGNED_MESSAGE,
    )[1];

    const replyMock = vi.fn();
    onSignMessageRequestMock.mockImplementationOnce(
      async () => "signedMessage",
    );
    await onRequestSignedMessageCallback(
      {
        kind: MessageKind.REQUEST_SIGNED_MESSAGE,
        payload: { messageToSign: "messageToSign" },
      },
      replyMock,
    );

    expect(replyMock).toHaveBeenCalledOnce();
    expect(replyMock.mock.lastCall).toMatchInlineSnapshot(`
      [
        {
          "kind": "RETURN_SIGNED_MESSAGE_RESULT",
          "payload": {
            "signedMessage": "signedMessage",
          },
        },
      ]
    `);
  });

  test("handles CLOSE message", () => {
    const onMock = vi.fn();
    const destroyMock = vi.fn();
    createPostMessageBusMock.mockImplementationOnce(() => ({
      on: onMock,
      destroy: destroyMock,
    }));

    setupBus({
      apiHost,
      frame,
      onEvent: onEventMock,
      onSignMessageRequest: onSignMessageRequestMock,
    });
    expect(onMock).toBeCalledWith(MessageKind.CLOSE, expect.any(Function));
    const onCloseCallback = onMock.mock.calls.find(
      (invocationArgs) => invocationArgs[0] === MessageKind.CLOSE,
    )[1];
    onCloseCallback();

    expect(frame.remove).toHaveBeenCalledOnce();
    expect(onEventMock).toHaveBeenCalledOnce();
    expect(onEventMock.mock.lastCall).toMatchInlineSnapshot(`
      [
        {
          "kind": "CLOSE",
          "payload": null,
        },
      ]
    `);
    expect(destroyMock).toHaveBeenCalledOnce();
  });

  test("handles TRANSFER_UPDATE message with APPROVED status transfer", async () => {
    const onMock = vi.fn();
    const destroyMock = vi.fn();
    createPostMessageBusMock.mockImplementationOnce(() => ({
      on: onMock,
      destroy: destroyMock,
    }));

    setupBus({
      apiHost,
      frame,
      onEvent: onEventMock,
      onSignMessageRequest: onSignMessageRequestMock,
    });
    expect(onMock).toBeCalledWith(
      MessageKind.TRANSFER_UPDATE,
      expect.any(Function),
    );
    const onTransferUpdateCallback = onMock.mock.calls.find(
      (invocationArgs) => invocationArgs[0] === MessageKind.TRANSFER_UPDATE,
    )[1];
    onTransferUpdateCallback({
      kind: MessageKind.TRANSFER_UPDATE,
      payload: { status: TransferStatus.APPROVED },
    });

    expect(hideMock).toHaveBeenCalledOnce();
    expect(onEventMock).toHaveBeenCalledOnce();
    expect(onEventMock.mock.lastCall).toMatchInlineSnapshot(`
      [
        {
          "kind": "TRANSFER_APPROVED",
          "payload": {
            "transfer": {
              "status": "APPROVED",
            },
          },
        },
      ]
    `);
  });

  test("handles TRANSFER_UPDATE message with COMPLETE status transfer", async () => {
    const onMock = vi.fn();
    const destroyMock = vi.fn();
    createPostMessageBusMock.mockImplementationOnce(() => ({
      on: onMock,
      destroy: destroyMock,
    }));

    setupBus({
      apiHost,
      frame,
      onEvent: onEventMock,
      onSignMessageRequest: onSignMessageRequestMock,
    });
    expect(onMock).toBeCalledWith(
      MessageKind.TRANSFER_UPDATE,
      expect.any(Function),
    );
    const onTransferUpdateCallback = onMock.mock.calls.find(
      (invocationArgs) => invocationArgs[0] === MessageKind.TRANSFER_UPDATE,
    )[1];
    onTransferUpdateCallback({
      kind: MessageKind.TRANSFER_UPDATE,
      payload: { status: TransferStatus.COMPLETE },
    });

    expect(removeMock).toHaveBeenCalledOnce();
    expect(onEventMock).toHaveBeenCalledOnce();
    expect(onEventMock.mock.lastCall).toMatchInlineSnapshot(`
      [
        {
          "kind": "TRANSFER_COMPLETE",
          "payload": {
            "transfer": {
              "status": "COMPLETE",
            },
          },
        },
      ]
    `);
    expect(destroyMock).toHaveBeenCalledOnce();
  });

  test("handles ERROR message", () => {
    const onMock = vi.fn();
    createPostMessageBusMock.mockImplementationOnce(() => ({ on: onMock }));

    setupBus({
      apiHost,
      frame,
      onEvent: onEventMock,
      onSignMessageRequest: onSignMessageRequestMock,
    });
    expect(onMock).toBeCalledWith(MessageKind.ERROR, expect.any(Function));
    const onErrorCallback = onMock.mock.calls.find(
      (invocationArgs) => invocationArgs[0] === MessageKind.ERROR,
    )[1];
    onErrorCallback({ kind: MessageKind.ERROR, payload: "errorPayload" });

    expect(onEventMock).toHaveBeenCalledOnce();
    expect(onEventMock.mock.lastCall).toMatchInlineSnapshot(`
      [
        {
          "kind": "ERROR",
          "payload": {
            "error": "errorPayload",
          },
        },
      ]
    `);
  });

  test("handles CONFIGURATION_ERROR message", () => {
    const onMock = vi.fn();
    createPostMessageBusMock.mockImplementationOnce(() => ({ on: onMock }));

    setupBus({
      apiHost,
      frame,
      onEvent: onEventMock,
      onSignMessageRequest: onSignMessageRequestMock,
    });
    expect(onMock).toBeCalledWith(
      MessageKind.CONFIGURATION_ERROR,
      expect.any(Function),
    );
    const onErrorCallback = onMock.mock.calls.find(
      (invocationArgs) => invocationArgs[0] === MessageKind.CONFIGURATION_ERROR,
    )[1];
    onErrorCallback({
      kind: MessageKind.CONFIGURATION_ERROR,
      payload: "configurationErrorPayload",
    });

    expect(onEventMock).toHaveBeenCalledOnce();
    expect(onEventMock.mock.lastCall).toMatchInlineSnapshot(`
      [
        {
          "kind": "CONFIGURATION_ERROR",
          "payload": {
            "error": "configurationErrorPayload",
          },
        },
      ]
    `);
  });

  test("handles UNSUPPORTED_NETWORK_ERROR message", () => {
    const onMock = vi.fn();
    createPostMessageBusMock.mockImplementationOnce(() => ({ on: onMock }));

    setupBus({
      apiHost,
      frame,
      onEvent: onEventMock,
      onSignMessageRequest: onSignMessageRequestMock,
    });
    expect(onMock).toBeCalledWith(
      MessageKind.UNSUPPORTED_NETWORK_ERROR,
      expect.any(Function),
    );
    const onErrorCallback = onMock.mock.calls.find(
      (invocationArgs) =>
        invocationArgs[0] === MessageKind.UNSUPPORTED_NETWORK_ERROR,
    )[1];
    onErrorCallback({
      kind: MessageKind.UNSUPPORTED_NETWORK_ERROR,
      payload: "unsupportedNetworkErrorPayload",
    });

    expect(onEventMock).toHaveBeenCalledOnce();
    expect(onEventMock.mock.lastCall).toMatchInlineSnapshot(`
      [
        {
          "kind": "UNSUPPORTED_NETWORK_ERROR",
          "payload": {
            "error": "unsupportedNetworkErrorPayload",
          },
        },
      ]
    `);
  });

  test("handles UNSUPPORTED_ASSET_ERROR message", () => {
    const onMock = vi.fn();
    createPostMessageBusMock.mockImplementationOnce(() => ({ on: onMock }));

    setupBus({
      apiHost,
      frame,
      onEvent: onEventMock,
      onSignMessageRequest: onSignMessageRequestMock,
    });
    expect(onMock).toBeCalledWith(
      MessageKind.UNSUPPORTED_ASSET_ERROR,
      expect.any(Function),
    );
    const onErrorCallback = onMock.mock.calls.find(
      (invocationArgs) =>
        invocationArgs[0] === MessageKind.UNSUPPORTED_ASSET_ERROR,
    )[1];
    onErrorCallback({
      kind: MessageKind.UNSUPPORTED_ASSET_ERROR,
      payload: "unsupportedAssetErrorPayload",
    });

    expect(onEventMock).toHaveBeenCalledOnce();
    expect(onEventMock.mock.lastCall).toMatchInlineSnapshot(`
      [
        {
          "kind": "UNSUPPORTED_ASSET_ERROR",
          "payload": {
            "error": "unsupportedAssetErrorPayload",
          },
        },
      ]
    `);
  });
});
