import {
  Asset,
  Environment,
  Network,
  Position,
  TransferConfiguration,
} from "../src/types";
import { validateTransferConfiguration } from "../src/validateTransferConfiguration";

const onEvent = vi.fn();

describe("validateTransferConfiguration", () => {
  beforeEach(() => {
    onEvent.mockClear();
  });

  test("onEvent is not a function throws", () => {
    expect(() =>
      // @ts-expect-error: Bypass type system to simulate runtime behavior
      validateTransferConfiguration({ onEvent: undefined }),
    ).toThrowErrorMatchingInlineSnapshot(
      '"[meso-js] An onEvent callback is required."',
    );
  });

  test("sourceAmount not matching AssetAmount template literal emits", () => {
    // @ts-expect-error: Bypass type system to simulate runtime behavior
    expect(validateTransferConfiguration({ onEvent, sourceAmount: "1." })).toBe(
      false,
    );
    expect(onEvent).toHaveBeenCalledOnce();
    expect(onEvent.mock.lastCall).toMatchInlineSnapshot(`
      [
        {
          "kind": "CONFIGURATION_ERROR",
          "payload": {
            "error": {
              "message": "\\"sourceAmount\\" must be a valid stringified number including optional decimals.",
            },
          },
        },
      ]
    `);
  });

  test("non-Network value emits", () => {
    expect(
      validateTransferConfiguration({
        onEvent,
        sourceAmount: "1",
        // @ts-expect-error: Bypass type system to simulate runtime behavior
        network: "eip155:-1",
      }),
    ).toBe(false);
    expect(onEvent).toHaveBeenCalledOnce();
    expect(onEvent.mock.lastCall).toMatchInlineSnapshot(`
      [
        {
          "kind": "UNSUPPORTED_NETWORK_ERROR",
          "payload": {
            "error": {
              "message": "\\"network\\" must be a supported network: eip155:1,solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp,eip155:137,eip155:10.",
            },
          },
        },
      ]
    `);
  });

  test("falsy walletAddress emits", () => {
    expect(
      validateTransferConfiguration({
        onEvent,
        sourceAmount: "1",
        network: Network.ETHEREUM_MAINNET,
        // @ts-expect-error: Bypass type system to simulate runtime behavior
        walletAddress: undefined,
      }),
    ).toBe(false);
    expect(onEvent).toHaveBeenCalledOnce();
    expect(onEvent.mock.lastCall).toMatchInlineSnapshot(`
      [
        {
          "kind": "CONFIGURATION_ERROR",
          "payload": {
            "error": {
              "message": "\\"walletAddress\\" must be provided.",
            },
          },
        },
      ]
    `);
  });

  test("non-string walletAddress emits", () => {
    expect(
      validateTransferConfiguration({
        onEvent,
        sourceAmount: "1",
        network: Network.ETHEREUM_MAINNET,
        // @ts-expect-error: Bypass type system to simulate runtime behavior
        walletAddress: 1,
      }),
    ).toBe(false);
    expect(onEvent).toHaveBeenCalledOnce();
    expect(onEvent.mock.lastCall).toMatchInlineSnapshot(`
      [
        {
          "kind": "CONFIGURATION_ERROR",
          "payload": {
            "error": {
              "message": "\\"walletAddress\\" must be provided.",
            },
          },
        },
      ]
    `);
  });

  test("empty string walletAddress emits", () => {
    expect(
      // @ts-expect-error: Bypass type system to simulate runtime behavior
      validateTransferConfiguration({
        onEvent,
        sourceAmount: "1",
        network: Network.ETHEREUM_MAINNET,
        walletAddress: "",
      }),
    ).toBe(false);
    expect(onEvent).toHaveBeenCalledOnce();
    expect(onEvent.mock.lastCall).toMatchInlineSnapshot(`
      [
        {
          "kind": "CONFIGURATION_ERROR",
          "payload": {
            "error": {
              "message": "\\"walletAddress\\" must be provided.",
            },
          },
        },
      ]
    `);
  });

  test("non-Environment emits", () => {
    expect(
      validateTransferConfiguration({
        onEvent,
        sourceAmount: "1",
        network: Network.ETHEREUM_MAINNET,
        walletAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        destinationAsset: Asset.ETH,
        // @ts-expect-error: Bypass type system to simulate runtime behavior
        environment: "NON_DEV",
      }),
    ).toBe(false);
    expect(onEvent).toHaveBeenCalledOnce();
    expect(onEvent.mock.lastCall).toMatchInlineSnapshot(`
      [
        {
          "kind": "CONFIGURATION_ERROR",
          "payload": {
            "error": {
              "message": "\\"environment\\" must be a supported environment: LOCAL,LOCAL_PROXY,DEV,PREVIEW,SANDBOX,PRODUCTION.",
            },
          },
        },
      ]
    `);
  });

  test("falsy partnerId emits", () => {
    expect(
      validateTransferConfiguration({
        onEvent,
        sourceAmount: "1",
        network: Network.ETHEREUM_MAINNET,
        walletAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        destinationAsset: Asset.ETH,
        environment: Environment.SANDBOX,
        // @ts-expect-error: Bypass type system to simulate runtime behavior
        partnerId: undefined,
      }),
    ).toBe(false);
    expect(onEvent).toHaveBeenCalledOnce();
    expect(onEvent.mock.lastCall).toMatchInlineSnapshot(`
      [
        {
          "kind": "CONFIGURATION_ERROR",
          "payload": {
            "error": {
              "message": "\\"partnerId\\" must be provided.",
            },
          },
        },
      ]
    `);
  });

  test("non-string partnerId emits", () => {
    expect(
      validateTransferConfiguration({
        onEvent,
        sourceAmount: "1",
        network: Network.ETHEREUM_MAINNET,
        walletAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        destinationAsset: Asset.ETH,
        environment: Environment.SANDBOX,
        // @ts-expect-error: Bypass type system to simulate runtime behavior
        partnerId: 1,
      }),
    ).toBe(false);
    expect(onEvent).toHaveBeenCalledOnce();
    expect(onEvent.mock.lastCall).toMatchInlineSnapshot(`
      [
        {
          "kind": "CONFIGURATION_ERROR",
          "payload": {
            "error": {
              "message": "\\"partnerId\\" must be provided.",
            },
          },
        },
      ]
    `);
  });

  test("empty string partnerId emits", () => {
    expect(
      // @ts-expect-error: Bypass type system to simulate runtime behavior
      validateTransferConfiguration({
        onEvent,
        sourceAmount: "1",
        network: Network.ETHEREUM_MAINNET,
        walletAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        destinationAsset: Asset.ETH,
        environment: Environment.SANDBOX,
        partnerId: "",
      }),
    ).toBe(false);
    expect(onEvent).toHaveBeenCalledOnce();
    expect(onEvent.mock.lastCall).toMatchInlineSnapshot(`
      [
        {
          "kind": "CONFIGURATION_ERROR",
          "payload": {
            "error": {
              "message": "\\"partnerId\\" must be provided.",
            },
          },
        },
      ]
    `);
  });

  test("invalid authenticationStrategy emits", () => {
    expect(
      validateTransferConfiguration({
        onEvent,
        sourceAmount: "1",
        network: Network.ETHEREUM_MAINNET,
        walletAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        destinationAsset: Asset.ETH,
        environment: Environment.SANDBOX,
        partnerId: "meso-js-test",
        onSignMessageRequest: vi.fn(),
        // @ts-expect-error: Bypassing types for testing
        authenticationStrategy: "foo",
      }),
    ).toBe(false);
    expect(onEvent).toHaveBeenCalledOnce();
    expect(onEvent.mock.lastCall).toMatchInlineSnapshot(`
      [
        {
          "kind": "CONFIGURATION_ERROR",
          "payload": {
            "error": {
              "message": "\`authenticationStrategy\` must be one of wallet_verification, headless_wallet_verification, bypass_wallet_verification",
            },
          },
        },
      ]
    `);
  });

  test("empty authenticationStrategy emits", () => {
    expect(
      validateTransferConfiguration({
        onEvent,
        sourceAmount: "1",
        network: Network.ETHEREUM_MAINNET,
        walletAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        destinationAsset: Asset.ETH,
        environment: Environment.SANDBOX,
        partnerId: "meso-js-test",
        onSignMessageRequest: vi.fn(),
        // @ts-expect-error: Bypassing types for testing
        authenticationStrategy: " ",
      }),
    ).toBe(false);
    expect(onEvent).toHaveBeenCalledOnce();
    expect(onEvent.mock.lastCall).toMatchInlineSnapshot(`
      [
        {
          "kind": "CONFIGURATION_ERROR",
          "payload": {
            "error": {
              "message": "\`authenticationStrategy\` must be one of wallet_verification, headless_wallet_verification, bypass_wallet_verification",
            },
          },
        },
      ]
    `);
  });

  test("non-function onSignMessageRequest emits", () => {
    expect(
      validateTransferConfiguration({
        onEvent,
        sourceAmount: "1",
        network: Network.ETHEREUM_MAINNET,
        walletAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        destinationAsset: Asset.ETH,
        environment: Environment.SANDBOX,
        partnerId: "meso-js-test",
        // @ts-expect-error: Bypass type system to simulate runtime behavior
        onSignMessageRequest: "signedMessage",
      }),
    ).toBe(false);
    expect(onEvent).toHaveBeenCalledOnce();
    expect(onEvent.mock.lastCall).toMatchInlineSnapshot(`
      [
        {
          "kind": "CONFIGURATION_ERROR",
          "payload": {
            "error": {
              "message": "\\"onSignMessageRequest\\" must be a valid function.",
            },
          },
        },
      ]
    `);
  });

  describe("layout", () => {
    test("invalid `position` emits an error", () => {
      expect(
        validateTransferConfiguration({
          onEvent,
          onSignMessageRequest: vi.fn(),
          sourceAmount: "1",
          network: Network.ETHEREUM_MAINNET,
          walletAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
          destinationAsset: Asset.ETH,
          environment: Environment.SANDBOX,
          partnerId: "meso-js-test",
          // @ts-expect-error: Bypass type system to simulate runtime behavior
          layout: { position: "bottom-center" },
        }),
      ).toBe(false);
      expect(onEvent).toHaveBeenCalledOnce();
      expect(onEvent.mock.lastCall).toMatchInlineSnapshot(`
      [
        {
          "kind": "CONFIGURATION_ERROR",
          "payload": {
            "error": {
              "message": "\\"position\\" must be a supported Position: top-right,bottom-right,bottom-left,top-left,center.",
            },
          },
        },
      ]
    `);
    });

    describe("offset", () => {
      let configuration: Omit<TransferConfiguration, "layout">;

      beforeEach(() => {
        configuration = {
          onEvent,
          onSignMessageRequest: vi.fn(),
          sourceAmount: "1",
          network: Network.ETHEREUM_MAINNET,
          walletAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
          destinationAsset: Asset.ETH,
          environment: Environment.SANDBOX,
          partnerId: "meso-js-test",
        };
      });

      describe("single value", () => {
        test("invalid offset (stringified number with units) emits an error", () => {
          expect(
            validateTransferConfiguration({
              ...configuration,
              // @ts-expect-error: Bypass type system to simulate runtime behavior
              layout: { position: Position.TOP_RIGHT, offset: "0px" },
            }),
          ).toBe(false);
          expect(onEvent).toHaveBeenCalledOnce();
          expect(onEvent.mock.lastCall).toMatchInlineSnapshot(`
            [
              {
                "kind": "CONFIGURATION_ERROR",
                "payload": {
                  "error": {
                    "message": "\\"offset\\" must be a non-negative integer (without units).",
                  },
                },
              },
            ]
          `);
        });

        test("negative value emits an error", () => {
          expect(
            validateTransferConfiguration({
              ...configuration,
              layout: { position: Position.TOP_RIGHT, offset: "-10" },
            } as TransferConfiguration),
          ).toBe(false);
          expect(onEvent).toHaveBeenCalledOnce();
          expect(onEvent.mock.lastCall).toMatchInlineSnapshot(`
            [
              {
                "kind": "CONFIGURATION_ERROR",
                "payload": {
                  "error": {
                    "message": "\\"offset\\" must be a non-negative integer (without units).",
                  },
                },
              },
            ]
          `);
        });
      });

      describe("object", () => {
        test("empty object emits an error", () => {
          expect(
            validateTransferConfiguration({
              ...configuration,
              // @ts-expect-error: Bypass type system to simulate runtime behavior
              layout: { position: Position.TOP_RIGHT, offset: {} },
            }),
          ).toBe(false);
          expect(onEvent).toHaveBeenCalledOnce();
          expect(onEvent.mock.lastCall).toMatchInlineSnapshot(`
            [
              {
                "kind": "CONFIGURATION_ERROR",
                "payload": {
                  "error": {
                    "message": "A valid value must be provided for \\"offset.horizontal\\" and/or \\"offset.vertical\\".",
                  },
                },
              },
            ]
          `);
        });

        test("invalid horizontal value (w/units) emits an error", () => {
          expect(
            validateTransferConfiguration({
              ...configuration,
              layout: {
                position: Position.TOP_RIGHT,
                // @ts-expect-error: Bypass type system to simulate runtime behavior
                offset: { horizontal: "10px" },
              },
            }),
          ).toBe(false);
          expect(onEvent).toHaveBeenCalledOnce();
          expect(onEvent.mock.lastCall).toMatchInlineSnapshot(`
            [
              {
                "kind": "CONFIGURATION_ERROR",
                "payload": {
                  "error": {
                    "message": "\\"offset.horizontal\\" must be a non-negative integer (without units).",
                  },
                },
              },
            ]
          `);
        });

        test("invalid vertical value (w/units) emits an error", () => {
          expect(
            validateTransferConfiguration({
              ...configuration,
              layout: {
                position: Position.TOP_RIGHT,
                // @ts-expect-error: Bypass type system to simulate runtime behavior
                offset: { vertical: "10px" },
              },
            }),
          ).toBe(false);
          expect(onEvent).toHaveBeenCalledOnce();
          expect(onEvent.mock.lastCall).toMatchInlineSnapshot(`
            [
              {
                "kind": "CONFIGURATION_ERROR",
                "payload": {
                  "error": {
                    "message": "\\"offset.vertical\\" must be a non-negative integer (without units).",
                  },
                },
              },
            ]
          `);
        });

        test("invalid horizontal value (negative number) emits an error", () => {
          expect(
            validateTransferConfiguration({
              ...configuration,
              layout: {
                position: Position.TOP_RIGHT,
                offset: { horizontal: "-10" },
              },
            } as TransferConfiguration),
          ).toBe(false);
          expect(onEvent).toHaveBeenCalledOnce();
          expect(onEvent.mock.lastCall).toMatchInlineSnapshot(`
            [
              {
                "kind": "CONFIGURATION_ERROR",
                "payload": {
                  "error": {
                    "message": "\\"offset.horizontal\\" must be a non-negative integer (without units).",
                  },
                },
              },
            ]
          `);
        });

        test("invalid vertical value (negative number) emits an error", () => {
          expect(
            validateTransferConfiguration({
              ...configuration,
              layout: {
                position: Position.TOP_RIGHT,
                offset: { vertical: "-10" },
              },
            } as TransferConfiguration),
          ).toBe(false);
          expect(onEvent).toHaveBeenCalledOnce();
          expect(onEvent.mock.lastCall).toMatchInlineSnapshot(`
            [
              {
                "kind": "CONFIGURATION_ERROR",
                "payload": {
                  "error": {
                    "message": "\\"offset.vertical\\" must be a non-negative integer (without units).",
                  },
                },
              },
            ]
          `);
        });

        test("invalid horizontal and vertical values emit an error", () => {
          expect(
            validateTransferConfiguration({
              ...configuration,
              layout: {
                position: Position.TOP_RIGHT,
                offset: { horizontal: "-1", vertical: "-10" },
              },
            } as TransferConfiguration),
          ).toBe(false);
          expect(onEvent).toHaveBeenCalledOnce();
          expect(onEvent.mock.lastCall).toMatchInlineSnapshot(`
            [
              {
                "kind": "CONFIGURATION_ERROR",
                "payload": {
                  "error": {
                    "message": "\\"offset.horizontal\\" must be a non-negative integer (without units).",
                  },
                },
              },
            ]
          `);
        });
      });
    });

    describe("valid configuration", () => {
      test("returns true (no layout)", () => {
        const valid = validateTransferConfiguration({
          onEvent,
          sourceAmount: "1",
          network: Network.ETHEREUM_MAINNET,
          walletAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
          destinationAsset: Asset.ETH,
          environment: Environment.SANDBOX,
          partnerId: "meso-js-test",
          onSignMessageRequest: vi.fn(),
        });
        expect(onEvent).not.toHaveBeenCalled();
        expect(valid).toBe(true);
      });

      test("returns true (no position)", () => {
        const valid = validateTransferConfiguration({
          onEvent,
          sourceAmount: "1",
          network: Network.ETHEREUM_MAINNET,
          walletAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
          destinationAsset: Asset.ETH,
          environment: Environment.SANDBOX,
          partnerId: "meso-js-test",
          layout: { offset: "0" },
          onSignMessageRequest: vi.fn(),
        });
        expect(onEvent).not.toHaveBeenCalled();
        expect(valid).toBe(true);
      });

      test("returns true (no offset)", () => {
        const valid = validateTransferConfiguration({
          onEvent,
          sourceAmount: "1",
          network: Network.ETHEREUM_MAINNET,
          walletAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
          destinationAsset: Asset.ETH,
          environment: Environment.SANDBOX,
          partnerId: "meso-js-test",
          layout: { position: Position.TOP_RIGHT, offset: "0" },
          onSignMessageRequest: vi.fn(),
        });
        expect(onEvent).not.toHaveBeenCalled();
        expect(valid).toBe(true);
      });

      test("returns true (single value offset)", () => {
        const valid = validateTransferConfiguration({
          onEvent,
          sourceAmount: "1",
          network: Network.ETHEREUM_MAINNET,
          walletAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
          destinationAsset: Asset.ETH,
          environment: Environment.SANDBOX,
          partnerId: "meso-js-test",
          layout: { position: Position.TOP_RIGHT, offset: "0" },
          onSignMessageRequest: vi.fn(),
        });
        expect(onEvent).not.toHaveBeenCalled();
        expect(valid).toBe(true);
      });

      test("returns true (x-only offset)", () => {
        const valid = validateTransferConfiguration({
          onEvent,
          sourceAmount: "1",
          network: Network.ETHEREUM_MAINNET,
          walletAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
          destinationAsset: Asset.ETH,
          environment: Environment.SANDBOX,
          partnerId: "meso-js-test",
          layout: {
            position: Position.TOP_RIGHT,
            offset: { horizontal: "10" },
          },
          onSignMessageRequest: vi.fn(),
        });
        expect(onEvent).not.toHaveBeenCalled();
        expect(valid).toBe(true);
      });

      test("returns true (x/y offset)", () => {
        const valid = validateTransferConfiguration({
          onEvent,
          sourceAmount: "1",
          network: Network.ETHEREUM_MAINNET,
          walletAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
          destinationAsset: Asset.ETH,
          environment: Environment.SANDBOX,
          partnerId: "meso-js-test",
          layout: {
            position: Position.TOP_RIGHT,
            offset: { horizontal: "10", vertical: "22" },
          },
          onSignMessageRequest: vi.fn(),
        });
        expect(onEvent).not.toHaveBeenCalled();
        expect(valid).toBe(true);
      });
    });
  });

  test("non-Asset destinationAsset emits", () => {
    expect(
      validateTransferConfiguration({
        onEvent,
        sourceAmount: "1",
        network: Network.ETHEREUM_MAINNET,
        walletAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        // @ts-expect-error: Bypassing types for testing
        destinationAsset: "$",
        environment: Environment.SANDBOX,
        partnerId: "meso-js-test",
        onSignMessageRequest: vi.fn(),
      }),
    ).toBe(false);
    expect(onEvent).toHaveBeenCalledOnce();
    expect(onEvent.mock.lastCall).toMatchInlineSnapshot(`
      [
        {
          "kind": "UNSUPPORTED_ASSET_ERROR",
          "payload": {
            "error": {
              "message": "\\"destinationAsset\\" must be a supported Asset: ETH,SOL,USDC,MATIC,USD.",
            },
          },
        },
      ]
    `);
  });

  test("non-CryptoAsset sourceAsset when destinationAsset is FiatAsset emits", () => {
    expect(
      // @ts-expect-error: Bypassing types for testing
      validateTransferConfiguration({
        onEvent,
        sourceAmount: "1",
        network: Network.ETHEREUM_MAINNET,
        walletAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        sourceAsset: Asset.USD,
        destinationAsset: Asset.USD,
        environment: Environment.SANDBOX,
        partnerId: "meso-js-test",
        onSignMessageRequest: vi.fn(),
        onSendTransactionRequest: vi.fn(),
      }),
    ).toBe(false);
    expect(onEvent).toHaveBeenCalledOnce();
    expect(onEvent.mock.lastCall).toMatchInlineSnapshot(`
      [
        {
          "kind": "UNSUPPORTED_ASSET_ERROR",
          "payload": {
            "error": {
              "message": "\\"sourceAsset\\" must be a supported CryptoAsset for Cash-out: ETH,SOL,USDC,MATIC.",
            },
          },
        },
      ]
    `);
  });

  test("non-FiatAsset sourceAsset when destinationAsset is CryptoAsset emits", () => {
    expect(
      // @ts-expect-error: Bypassing types for testing
      validateTransferConfiguration({
        onEvent,
        sourceAmount: "1",
        network: Network.ETHEREUM_MAINNET,
        walletAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        sourceAsset: Asset.ETH,
        destinationAsset: Asset.ETH,
        environment: Environment.SANDBOX,
        partnerId: "meso-js-test",
        onSignMessageRequest: vi.fn(),
      }),
    ).toBe(false);
    expect(onEvent).toHaveBeenCalledOnce();
    expect(onEvent.mock.lastCall).toMatchInlineSnapshot(`
      [
        {
          "kind": "UNSUPPORTED_ASSET_ERROR",
          "payload": {
            "error": {
              "message": "\\"sourceAsset\\" must be a supported FiatAsset for Cash-in: USD.",
            },
          },
        },
      ]
    `);
  });

  describe("onSendTransaction", () => {
    test("undefined is valid when destinationAsset is CryptoAsset", () => {
      expect(
        validateTransferConfiguration({
          onEvent,
          sourceAmount: "1",
          network: Network.ETHEREUM_MAINNET,
          walletAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
          destinationAsset: Asset.USDC,
          environment: Environment.SANDBOX,
          partnerId: "meso-js-test",
          onSignMessageRequest: vi.fn(),
        }),
      ).toBe(true);
    });

    test("non-function onSendTransaction emits when destinationAsset is FiatAsset", () => {
      expect(
        validateTransferConfiguration({
          onEvent,
          sourceAmount: "1",
          network: Network.ETHEREUM_MAINNET,
          walletAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
          sourceAsset: Asset.ETH,
          destinationAsset: Asset.USD,
          environment: Environment.SANDBOX,
          partnerId: "meso-js-test",
          onSignMessageRequest: vi.fn(),
          // @ts-expect-error: Bypass type system to simulate runtime behavior
          onSendTransactionRequest: "sentTransaction",
        }),
      ).toBe(false);
      expect(onEvent).toHaveBeenCalledOnce();
      expect(onEvent.mock.lastCall).toMatchInlineSnapshot(`
      [
        {
          "kind": "CONFIGURATION_ERROR",
          "payload": {
            "error": {
              "message": "\\"onSendTransactionRequest\\" must be a valid function.",
            },
          },
        },
      ]
    `);
    });

    test("missing onSendTransaction emits when destinationAsset is FiatAsset", () => {
      expect(
        // @ts-expect-error: Bypass type system to simulate runtime behavior
        validateTransferConfiguration({
          onEvent,
          sourceAmount: "1",
          network: Network.ETHEREUM_MAINNET,
          walletAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
          sourceAsset: Asset.ETH,
          destinationAsset: Asset.USD,
          environment: Environment.SANDBOX,
          partnerId: "meso-js-test",
          onSignMessageRequest: vi.fn(),
        }),
      ).toBe(false);
      expect(onEvent).toHaveBeenCalledOnce();
      expect(onEvent.mock.lastCall).toMatchInlineSnapshot(`
      [
        {
          "kind": "CONFIGURATION_ERROR",
          "payload": {
            "error": {
              "message": "\\"onSendTransactionRequest\\" must be a valid function.",
            },
          },
        },
      ]
    `);
    });
  });
});
