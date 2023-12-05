import { Asset, Environment, Network, Position } from "@meso-network/types";
import { validateConfiguration } from "../src/validation";

const onEvent = vi.fn();

describe("validateConfiguration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("onEvent is not a function throws", () => {
    expect(() =>
      // @ts-expect-error: Bypass type system to simulate runtime behavior
      validateConfiguration({ onEvent: undefined }),
    ).toThrowErrorMatchingInlineSnapshot(
      '"[meso-js] An onEvent callback is required."',
    );
  });

  test("sourceAmount not matching USDAmount template literal emits", () => {
    // @ts-expect-error: Bypass type system to simulate runtime behavior
    expect(validateConfiguration({ onEvent, sourceAmount: "1." })).toBe(false);
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
      validateConfiguration({
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
          "kind": "CONFIGURATION_ERROR",
          "payload": {
            "error": {
              "message": "\\"network\\" must be a supported network: eip155:1,eip155:5,solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp,solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1,solana:4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z.",
            },
          },
        },
      ]
    `);
  });

  test("falsy walletAddress emits", () => {
    expect(
      validateConfiguration({
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
      validateConfiguration({
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
      validateConfiguration({
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

  test("non-Asset emits", () => {
    expect(
      validateConfiguration({
        onEvent,
        sourceAmount: "1",
        network: Network.ETHEREUM_MAINNET,
        walletAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        // @ts-expect-error: Bypass type system to simulate runtime behavior
        destinationAsset: "C2O",
      }),
    ).toBe(false);
    expect(onEvent).toHaveBeenCalledOnce();
    expect(onEvent.mock.lastCall).toMatchInlineSnapshot(`
      [
        {
          "kind": "CONFIGURATION_ERROR",
          "payload": {
            "error": {
              "message": "\\"destinationAsset\\" must be a supported asset: ETH,SOL,USDC.",
            },
          },
        },
      ]
    `);
  });

  test("non-Environment emits", () => {
    expect(
      validateConfiguration({
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
      validateConfiguration({
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
      validateConfiguration({
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
      validateConfiguration({
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

  test("non-Position emits", () => {
    expect(
      validateConfiguration({
        onEvent,
        sourceAmount: "1",
        network: Network.ETHEREUM_MAINNET,
        walletAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        destinationAsset: Asset.ETH,
        environment: Environment.SANDBOX,
        partnerId: "meso-js-test",
        // @ts-expect-error: Bypass type system to simulate runtime behavior
        position: "bottom-center",
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

  test("non-number string offset emits", () => {
    expect(
      // @ts-expect-error: Bypass type system to simulate runtime behavior
      validateConfiguration({
        onEvent,
        sourceAmount: "1",
        network: Network.ETHEREUM_MAINNET,
        walletAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        destinationAsset: Asset.ETH,
        environment: Environment.SANDBOX,
        partnerId: "meso-js-test",
        position: Position.TOP_RIGHT,
        offset: "0px",
      }),
    ).toBe(false);
    expect(onEvent).toHaveBeenCalledOnce();
    expect(onEvent.mock.lastCall).toMatchInlineSnapshot(`
      [
        {
          "kind": "CONFIGURATION_ERROR",
          "payload": {
            "error": {
              "message": "\\"offset\\" must be a non-negative integer.",
            },
          },
        },
      ]
    `);
  });

  test("negative number string offset emits", () => {
    expect(
      // @ts-expect-error: Bypass type system to simulate runtime behavior
      validateConfiguration({
        onEvent,
        sourceAmount: "1",
        network: Network.ETHEREUM_MAINNET,
        walletAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        destinationAsset: Asset.ETH,
        environment: Environment.SANDBOX,
        partnerId: "meso-js-test",
        position: Position.TOP_RIGHT,
        offset: "-10",
      }),
    ).toBe(false);
    expect(onEvent).toHaveBeenCalledOnce();
    expect(onEvent.mock.lastCall).toMatchInlineSnapshot(`
      [
        {
          "kind": "CONFIGURATION_ERROR",
          "payload": {
            "error": {
              "message": "\\"offset\\" must be a non-negative integer.",
            },
          },
        },
      ]
    `);
  });

  test("non-function onSignMessageRequest emits", () => {
    expect(
      validateConfiguration({
        onEvent,
        sourceAmount: "1",
        network: Network.ETHEREUM_MAINNET,
        walletAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        destinationAsset: Asset.ETH,
        environment: Environment.SANDBOX,
        partnerId: "meso-js-test",
        position: Position.TOP_RIGHT,
        offset: "0",
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

  test("valid configuration returns true", () => {
    const valid = validateConfiguration({
      onEvent,
      sourceAmount: "1",
      network: Network.ETHEREUM_MAINNET,
      walletAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      destinationAsset: Asset.ETH,
      environment: Environment.SANDBOX,
      partnerId: "meso-js-test",
      position: Position.TOP_RIGHT,
      offset: "0",
      onSignMessageRequest: vi.fn(),
    });
    expect(onEvent).not.toHaveBeenCalled();
    expect(valid).toBe(true);
  });
});
