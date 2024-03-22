import {
  Asset,
  CashInConfiguration,
  CashOutConfiguration,
  Environment,
  Network,
  TransferConfiguration,
} from "../src/types";
import { Mock } from "vitest";
import { transfer } from "../src";
import { DEFAULT_LAYOUT } from "../src/transfer";
import { version } from "../package.json";

var validateTransferConfigurationMock: Mock;
vi.mock("../src/validateTransferConfiguration", async () => {
  validateTransferConfigurationMock = vi.fn();
  return { validateTransferConfiguration: validateTransferConfigurationMock };
});

var setupBusMock: Mock;
vi.mock("../src/bus", async () => {
  setupBusMock = vi.fn();
  return { setupBus: setupBusMock };
});

var setupFrameMock: Mock;
vi.mock("../src/frame", async () => {
  setupFrameMock = vi.fn();
  return { setupFrame: setupFrameMock };
});

describe("transfer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const configuration: Partial<TransferConfiguration> = {
    sourceAmount: "100",
    network: Network.ETHEREUM_MAINNET,
    walletAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    environment: Environment.SANDBOX,
    partnerId: "partnerId",
    layout: DEFAULT_LAYOUT,
    onSignMessageRequest: vi.fn(),
    onEvent: vi.fn(),
  };

  test("invalid configuration returns without setting up frame or bus", () => {
    validateTransferConfigurationMock.mockImplementationOnce(() => false);
    transfer(configuration as TransferConfiguration);

    expect(setupFrameMock).not.toHaveBeenCalled();
    expect(setupBusMock).not.toHaveBeenCalled();
  });

  test("valid cash-in configuration sets up frame, bus, and returns destroy method to clean up both", () => {
    validateTransferConfigurationMock.mockImplementationOnce(() => true);
    const frameRemoveMock = vi.fn();
    setupFrameMock.mockImplementationOnce(() => ({ remove: frameRemoveMock }));
    const busDestroyMock = vi.fn();
    setupBusMock.mockImplementationOnce(() => ({ destroy: busDestroyMock }));

    const { destroy } = transfer({
      ...configuration,
      destinationAsset: Asset.ETH,
    } as CashInConfiguration);
    expect(setupFrameMock).toHaveBeenCalledOnce();
    expect(setupFrameMock.mock.lastCall[0]).toMatchInlineSnapshot(
      '"https://api.sandbox.meso.network"',
    );
    expect(setupFrameMock.mock.lastCall[1]).toMatchInlineSnapshot(
      { version: expect.any(String) },
      `
      {
        "authenticationStrategy": "wallet_verification",
        "destinationAsset": "ETH",
        "layoutOffset": "0",
        "layoutPosition": "top-right",
        "mode": "embedded",
        "network": "eip155:1",
        "partnerId": "partnerId",
        "sourceAmount": "100",
        "sourceAsset": "USD",
        "version": Any<String>,
        "walletAddress": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      }
    `,
    );
    expect(setupFrameMock.mock.lastCall[1].version).toEqual(version);
    expect(setupBusMock).toHaveBeenCalledOnce();
    expect(setupBusMock.mock.lastCall).toMatchInlineSnapshot(`
      [
        "https://api.sandbox.meso.network",
        {
          "remove": [MockFunction spy],
        },
        [MockFunction spy],
        [MockFunction spy],
        undefined,
      ]
    `);

    destroy();
    expect(frameRemoveMock).toHaveBeenCalledOnce();
    expect(busDestroyMock).toHaveBeenCalledOnce();
  });

  test("valid cash-out configuration sets up frame, bus, and returns destroy method to clean up both", () => {
    validateTransferConfigurationMock.mockImplementationOnce(() => true);
    const frameRemoveMock = vi.fn();
    setupFrameMock.mockImplementationOnce(() => ({ remove: frameRemoveMock }));
    const busDestroyMock = vi.fn();
    setupBusMock.mockImplementationOnce(() => ({ destroy: busDestroyMock }));

    const { destroy } = transfer({
      ...configuration,
      sourceAsset: Asset.ETH,
      destinationAsset: Asset.USD,
      onSendTransactionRequest: vi.fn(),
    } as CashOutConfiguration);
    expect(setupFrameMock).toHaveBeenCalledOnce();
    expect(setupFrameMock.mock.lastCall[0]).toMatchInlineSnapshot(
      '"https://api.sandbox.meso.network"',
    );
    expect(setupFrameMock.mock.lastCall[1]).toMatchInlineSnapshot(
      { version: expect.any(String) },
      `
      {
        "authenticationStrategy": "wallet_verification",
        "destinationAsset": "USD",
        "layoutOffset": "0",
        "layoutPosition": "top-right",
        "mode": "embedded",
        "network": "eip155:1",
        "partnerId": "partnerId",
        "sourceAmount": "100",
        "sourceAsset": "ETH",
        "version": Any<String>,
        "walletAddress": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      }
    `,
    );
    expect(setupFrameMock.mock.lastCall[1].version).toEqual(version);
    expect(setupBusMock).toHaveBeenCalledOnce();
    expect(setupBusMock.mock.lastCall).toMatchInlineSnapshot(`
      [
        "https://api.sandbox.meso.network",
        {
          "remove": [MockFunction spy],
        },
        [MockFunction spy],
        [MockFunction spy],
        [MockFunction spy],
      ]
    `);

    destroy();
    expect(frameRemoveMock).toHaveBeenCalledOnce();
    expect(busDestroyMock).toHaveBeenCalledOnce();
  });
});
