import {
  TransferStatus,
  MessageKind,
  PostMessageHandlerFn,
} from "../src/types";
import {
  validateHandlerFunction,
  validateMessage,
  validateMessageKind,
} from "../src/validators";
import { vi } from "vitest";

describe("validators", () => {
  describe("validateMessageKind()", () => {
    describe("success", () => {
      test("request signed message", () => {
        expect(validateMessageKind(MessageKind.REQUEST_SIGNED_MESSAGE)).toBe(
          true,
        );
      });
    });

    describe("failure", () => {
      test("missing value", () => {
        // @ts-expect-error: Bypass type system to simulate runtime behavior
        expect(validateMessageKind()).toBe(false);
      });

      test("invalid value", () => {
        // @ts-expect-error: Bypass type system to simulate runtime behavior
        expect(validateMessageKind("foo")).toBe(false);
      });
    });
  });

  describe("validateMessage()", () => {
    describe("REQUEST_SIGNED_MESSAGE", () => {
      describe("success", () => {
        test("request signed message", () => {
          expect(
            validateMessage({
              kind: MessageKind.REQUEST_SIGNED_MESSAGE,
              payload: { messageToSign: "some_message" },
            }),
          ).toBe(true);
        });
      });

      describe("failure", () => {
        test.each([
          ["missing payload", { kind: MessageKind.REQUEST_SIGNED_MESSAGE }],
          [
            "bad payload",
            {
              kind: MessageKind.REQUEST_SIGNED_MESSAGE,
              payload: { messageToSign: false },
            },
          ],
          [
            "missing kind",
            {
              payload: { messageToSign: "something" },
            },
          ],
        ])("%s", (_, message) => {
          // @ts-expect-error: Bypass type system to simulate runtime behavior
          expect(validateMessage(message)).toBe(false);
        });
      });
    });

    describe("RETURN_SIGNED_MESSAGE_RESULT", () => {
      describe("success", () => {
        test("returns a message", () => {
          expect(
            validateMessage({
              kind: MessageKind.RETURN_SIGNED_MESSAGE_RESULT,
              payload: { signedMessage: "some_message" },
            }),
          ).toBe(true);
        });

        test("allows undefined", () => {
          expect(
            validateMessage({
              kind: MessageKind.RETURN_SIGNED_MESSAGE_RESULT,
              payload: { signedMessage: undefined },
            }),
          ).toBe(true);
        });
      });

      describe("failure", () => {
        test.each([
          [
            "missing payload",
            { kind: MessageKind.RETURN_SIGNED_MESSAGE_RESULT },
          ],
          [
            "bad payload",
            {
              kind: MessageKind.RETURN_SIGNED_MESSAGE_RESULT,
              payload: { signedMessage: false },
            },
          ],
          ["missing kind", { payload: { signedMessage: "something" } }],
        ])("%s", (_, message) => {
          // @ts-expect-error: Bypass type system to simulate runtime behavior
          expect(validateMessage(message)).toBe(false);
        });
      });
    });

    describe("CLOSE", () => {
      describe("success", () => {
        test("is valid", () => {
          expect(validateMessage({ kind: MessageKind.CLOSE })).toBe(true);
        });
      });

      describe("failure", () => {
        test.each([
          ["contains payload", { kind: MessageKind.CLOSE, payload: {} }],
          ["missing kind", {}],
        ])("%s", (_, message) => {
          // @ts-expect-error: Bypass type system to simulate runtime behavior
          expect(validateMessage(message)).toBe(false);
        });
      });
    });

    describe("READY", () => {
      describe("success", () => {
        test("is valid", () => {
          expect(validateMessage({ kind: MessageKind.READY })).toBe(true);
        });
      });

      describe("failure", () => {
        test.each([
          ["contains payload", { kind: MessageKind.READY, payload: {} }],
          ["missing kind", {}],
        ])("%s", (_, message) => {
          // @ts-expect-error: Bypass type system to simulate runtime behavior
          expect(validateMessage(message)).toBe(false);
        });
      });
    });

    describe("TRANSFER_UPDATE", () => {
      describe("success", () => {
        test("is valid w/o networkTransactionId", () => {
          expect(
            validateMessage({
              kind: MessageKind.TRANSFER_UPDATE,
              payload: {
                id: "some id",
                status: TransferStatus.APPROVED,
                updatedAt: new Date().toISOString(),
              },
            }),
          ).toBe(true);
        });

        test("is valid w networkTransactionId", () => {
          expect(
            validateMessage({
              kind: MessageKind.TRANSFER_UPDATE,
              payload: {
                id: "some id",
                status: TransferStatus.APPROVED,
                updatedAt: new Date().toISOString(),
                networkTransactionId: "id",
              },
            }),
          ).toBe(true);
        });
      });

      describe("failure", () => {
        test.each([
          ["missing payload", { kind: MessageKind.TRANSFER_UPDATE }],
          ["empty payload", { kind: MessageKind.TRANSFER_UPDATE, payload: {} }],
          [
            "bad payload (invalid id)",
            {
              kind: MessageKind.TRANSFER_UPDATE,
              payload: {
                id: 2,
                status: TransferStatus.APPROVED,
                updatedAt: new Date().toISOString(),
              },
            },
          ],
          [
            "bad payload (invalid status)",
            {
              kind: MessageKind.TRANSFER_UPDATE,
              payload: {
                id: "some id",
                status: null,
                updatedAt: new Date().toISOString(),
              },
            },
          ],
          [
            "bad payload (invalid updatedAt type)",
            {
              kind: MessageKind.TRANSFER_UPDATE,
              payload: {
                id: "some id",
                status: TransferStatus.APPROVED,
                updatedAt: 100,
              },
            },
          ],
          [
            "bad payload (empty updatedAt)",
            {
              kind: MessageKind.TRANSFER_UPDATE,
              payload: {
                id: "some id",
                status: TransferStatus.APPROVED,
                updatedAt: "",
              },
            },
          ],
          [
            "bad payload (missing updatedAt)",
            {
              kind: MessageKind.TRANSFER_UPDATE,
              payload: {
                id: "some id",
                status: TransferStatus.APPROVED,
              },
            },
          ],
          [
            "bad payload (invalid networkTransactionId type)",
            {
              kind: MessageKind.TRANSFER_UPDATE,
              payload: {
                id: "some id",
                status: TransferStatus.APPROVED,
                updatedAt: new Date().toISOString(),
                networkTransactionId: 100,
              },
            },
          ],
          [
            "missing kind",
            {
              payload: {
                id: "some id",
                status: TransferStatus.APPROVED,
                updatedAt: new Date().toISOString(),
                networkTransactionId: "id",
              },
            },
          ],
        ])("%s", (_, message) => {
          // @ts-expect-error: Bypass type system to simulate runtime behavior
          expect(validateMessage(message)).toBe(false);
        });
      });
    });

    describe("ERROR", () => {
      describe("success", () => {
        test("is valid", () => {
          expect(
            validateMessage({
              kind: MessageKind.ERROR,
              payload: { message: "an error" },
            }),
          ).toBe(true);
        });
      });

      describe("failure", () => {
        test.each([
          [
            "bad payload (invalid message type)",
            { kind: MessageKind.ERROR, payload: { message: false } },
          ],
          [
            "bad payload (empty message)",
            { kind: MessageKind.ERROR, payload: { message: "" } },
          ],
          [
            "bad payload (missing message)",
            { kind: MessageKind.ERROR, payload: {} },
          ],
          ["missing kind", { payload: { message: "an error" } }],
        ])("%s", (_, message) => {
          // @ts-expect-error: Bypass type system to simulate runtime behavior
          expect(validateMessage(message)).toBe(false);
        });
      });
    });

    describe("CONFIGURATION_ERROR", () => {
      describe("success", () => {
        test("is valid", () => {
          expect(
            validateMessage({
              kind: MessageKind.CONFIGURATION_ERROR,
              payload: { message: "an CONFIGURATION_ERROR" },
            }),
          ).toBe(true);
        });
      });

      describe("failure", () => {
        test.each([
          [
            "bad payload (invalid message type)",
            {
              kind: MessageKind.CONFIGURATION_ERROR,
              payload: { message: false },
            },
          ],
          [
            "bad payload (empty message)",
            { kind: MessageKind.CONFIGURATION_ERROR, payload: { message: "" } },
          ],
          [
            "bad payload (missing message)",
            { kind: MessageKind.CONFIGURATION_ERROR, payload: {} },
          ],
          ["missing kind", { payload: { message: "an error" } }],
        ])("%s", (_, message) => {
          // @ts-expect-error: Bypass type system to simulate runtime behavior
          expect(validateMessage(message)).toBe(false);
        });
      });
    });
  });

  describe("UNSUPPORTED_NETWORK_ERROR", () => {
    describe("success", () => {
      test("is valid", () => {
        expect(
          validateMessage({
            kind: MessageKind.UNSUPPORTED_NETWORK_ERROR,
            payload: { message: "an UNSUPPORTED_NETWORK_ERROR" },
          }),
        ).toBe(true);
      });
    });

    describe("failure", () => {
      test.each([
        [
          "bad payload (invalid message type)",
          {
            kind: MessageKind.UNSUPPORTED_NETWORK_ERROR,
            payload: { message: false },
          },
        ],
        [
          "bad payload (empty message)",
          {
            kind: MessageKind.UNSUPPORTED_NETWORK_ERROR,
            payload: { message: "" },
          },
        ],
        [
          "bad payload (missing message)",
          { kind: MessageKind.UNSUPPORTED_NETWORK_ERROR, payload: {} },
        ],
        ["missing kind", { payload: { message: "an error" } }],
      ])("%s", (_, message) => {
        // @ts-expect-error: Bypass type system to simulate runtime behavior
        expect(validateMessage(message)).toBe(false);
      });
    });
  });

  describe("UNSUPPORTED_ASSET_ERROR", () => {
    describe("success", () => {
      test("is valid", () => {
        expect(
          validateMessage({
            kind: MessageKind.UNSUPPORTED_ASSET_ERROR,
            payload: { message: "an UNSUPPORTED_ASSET_ERROR" },
          }),
        ).toBe(true);
      });
    });

    describe("failure", () => {
      test.each([
        [
          "bad payload (invalid message type)",
          {
            kind: MessageKind.UNSUPPORTED_ASSET_ERROR,
            payload: { message: false },
          },
        ],
        [
          "bad payload (empty message)",
          {
            kind: MessageKind.UNSUPPORTED_ASSET_ERROR,
            payload: { message: "" },
          },
        ],
        [
          "bad payload (missing message)",
          { kind: MessageKind.UNSUPPORTED_ASSET_ERROR, payload: {} },
        ],
        ["missing kind", { payload: { message: "an error" } }],
      ])("%s", (_, message) => {
        // @ts-expect-error: Bypass type system to simulate runtime behavior
        expect(validateMessage(message)).toBe(false);
      });
    });
  });

  describe("validateHandlerFunction()", () => {
    describe("success", () => {
      test("for valid handler", () => {
        const handlerFn: PostMessageHandlerFn = (_, __) => {};
        expect(validateHandlerFunction(handlerFn)).toBe(true);
      });

      test("on empty function", () => {
        expect(validateHandlerFunction(vi.fn())).toBe(true);
      });
    });
    describe("failure", () => {
      test("missing", () => {
        // @ts-expect-error: Bypass type system to simulate runtime behavior
        expect(validateHandlerFunction()).toBe(false);
      });

      test("on wrong type", () => {
        expect(validateHandlerFunction({})).toBe(false);
      });
    });
  });
});
