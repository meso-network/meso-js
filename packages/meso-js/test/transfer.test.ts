import {
  TransferConfiguration,
  Network,
  Asset,
  Environment,
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

  const configuration: TransferConfiguration = {
    sourceAmount: "100",
    network: Network.ETHEREUM_MAINNET,
    walletAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    destinationAsset: Asset.ETH,
    environment: Environment.SANDBOX,
    partnerId: "partnerId",
    layout: DEFAULT_LAYOUT,
    onSignMessageRequest: vi.fn(),
    onEvent: vi.fn(),
  };

  test("invalid configuration returns without setting up frame or bus", () => {
    validateTransferConfigurationMock.mockImplementationOnce(() => false);
    transfer(configuration);

    expect(setupFrameMock).not.toHaveBeenCalled();
    expect(setupBusMock).not.toHaveBeenCalled();
  });

  test("valid configuration sets up frame, bus, and returns destroy method to clean up both", () => {
    validateTransferConfigurationMock.mockImplementationOnce(() => true);
    const frameRemoveMock = vi.fn();
    setupFrameMock.mockImplementationOnce(() => ({ remove: frameRemoveMock }));
    const busDestroyMock = vi.fn();
    setupBusMock.mockImplementationOnce(() => ({ destroy: busDestroyMock }));

    const { destroy } = transfer(configuration);
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
        "network": "eip155:1",
        "partnerId": "partnerId",
        "sourceAmount": "100",
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
      ]
    `);

    destroy();
    expect(frameRemoveMock).toHaveBeenCalledOnce();
    expect(busDestroyMock).toHaveBeenCalledOnce();
  });
});
