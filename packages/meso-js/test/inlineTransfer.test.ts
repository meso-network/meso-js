import {
  Asset,
  AuthenticationStrategy,
  Environment,
  InlineTransferConfiguration,
  MessageKind,
  Network,
} from "../src/types";
import { Mock } from "vitest";
import { inlineTransfer } from "../src";
import { version } from "../package.json";

var validateInlineTransferConfigurationMock: Mock;
vi.mock("../src/validateConfiguration", async () => {
  validateInlineTransferConfigurationMock = vi.fn();
  return {
    validateInlineTransferConfiguration:
      validateInlineTransferConfigurationMock,
  };
});

var setupFrameMock: Mock;
var frameRemoveMock: Mock;
vi.mock("../src/frame", async () => {
  frameRemoveMock = vi.fn();

  setupFrameMock = vi.fn().mockImplementation(() => {
    return {
      remove: frameRemoveMock,
    };
  });
  return { setupFrame: setupFrameMock };
});

var setupBusMock: Mock;
var busDestroyMock: Mock;
var busOnMock: Mock;
vi.mock("../src/bus", async () => {
  busDestroyMock = vi.fn();
  busOnMock = vi.fn();

  setupBusMock = vi.fn().mockImplementation(() => ({
    destroy: busDestroyMock,
    on: busOnMock,
  }));
  return { setupBus: setupBusMock };
});

describe("inlineTransfer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const configuration: Partial<InlineTransferConfiguration> = {
    sourceAmount: "100",
    network: Network.ETHEREUM_MAINNET,
    walletAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    environment: Environment.SANDBOX,
    partnerId: "partnerId",
    onSignMessageRequest: vi.fn(),
    onEvent: vi.fn(),
    container: "#outlet",
  };

  describe("invalid", () => {
    test("returns without setting up frame or bus (bad configuration)", () => {
      validateInlineTransferConfigurationMock.mockImplementationOnce(
        () => false,
      );
      inlineTransfer(configuration as InlineTransferConfiguration);

      expect(setupFrameMock).not.toHaveBeenCalled();
      expect(setupBusMock).not.toHaveBeenCalled();
    });

    test("returns without setting up frame or bus (bad container)", () => {
      validateInlineTransferConfigurationMock.mockImplementationOnce(
        () => true,
      );
      vi.spyOn(document, "querySelector").mockReturnValue(null);

      expect(() => {
        inlineTransfer(configuration as InlineTransferConfiguration);
      }).toThrowError(
        "Invalid container: No element found for selector #outlet",
      );

      expect(setupFrameMock).not.toHaveBeenCalled();
      expect(setupBusMock).not.toHaveBeenCalled();
    });
  });

  describe("valid", () => {
    test("applies defaults", () => {
      validateInlineTransferConfigurationMock.mockImplementationOnce(
        () => true,
      );
      vi.spyOn(document, "querySelector").mockReturnValue({} as Element);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { sourceAsset, authenticationStrategy, ...rest } = configuration;

      inlineTransfer(rest as InlineTransferConfiguration);
      expect(setupFrameMock).toHaveBeenCalledOnce();
      expect(setupFrameMock.mock.lastCall[1].sourceAsset).toBe(Asset.USD);
      expect(setupFrameMock.mock.lastCall[1].authenticationStrategy).toBe(
        AuthenticationStrategy.WALLET_VERIFICATION,
      );
    });

    test("cash-in configuration sets up frame, bus, and returns destroy method to clean up both", async () => {
      validateInlineTransferConfigurationMock.mockImplementationOnce(
        () => true,
      );
      vi.spyOn(document, "querySelector").mockReturnValue({} as Element);

      const { destroy } = inlineTransfer({
        ...configuration,
        destinationAsset: Asset.ETH,
      } as InlineTransferConfiguration);
      expect(setupFrameMock).toHaveBeenCalledOnce();
      expect(setupFrameMock.mock.lastCall[0]).toMatchInlineSnapshot(
        '"https://api.sandbox.meso.network"',
      );
      expect(setupFrameMock.mock.lastCall[1]).toMatchInlineSnapshot(
        { version: expect.any(String) },
        `
        {
          "authenticationStrategy": "wallet_verification",
          "destinationAmount": undefined,
          "destinationAsset": "ETH",
          "mode": "inline",
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
        {
          "apiHost": "https://api.sandbox.meso.network",
          "frame": {
            "remove": [MockFunction spy],
          },
          "onEvent": [MockFunction spy],
          "onSendTransactionRequest": undefined,
          "onSignMessageRequest": [MockFunction spy],
        },
      ]
    `);

      expect(busOnMock).toHaveBeenCalledWith(
        MessageKind.INITIATE_MODAL_ONBOARDING,
        expect.any(Function),
      );

      expect(busOnMock).toHaveBeenCalledWith(
        MessageKind.RESUME_INLINE_FRAME,
        expect.any(Function),
      );

      destroy();
      expect(frameRemoveMock).toHaveBeenCalledOnce();
      expect(busDestroyMock).toHaveBeenCalledOnce();
    });

    test("cash-out configuration sets up frame, bus, and returns destroy method to clean up both", () => {
      validateInlineTransferConfigurationMock.mockImplementationOnce(
        () => true,
      );
      vi.spyOn(document, "querySelector").mockReturnValue({} as Element);

      const { destroy } = inlineTransfer({
        ...configuration,
        sourceAsset: Asset.ETH,
        destinationAsset: Asset.USD,
        onSendTransactionRequest: vi.fn(),
      } as InlineTransferConfiguration);
      expect(setupFrameMock).toHaveBeenCalledOnce();
      expect(setupFrameMock.mock.lastCall[0]).toMatchInlineSnapshot(
        '"https://api.sandbox.meso.network"',
      );
      expect(setupFrameMock.mock.lastCall[1]).toMatchInlineSnapshot(
        { version: expect.any(String) },
        `
        {
          "authenticationStrategy": "wallet_verification",
          "destinationAmount": undefined,
          "destinationAsset": "USD",
          "mode": "inline",
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
        {
          "apiHost": "https://api.sandbox.meso.network",
          "frame": {
            "remove": [MockFunction spy],
          },
          "onEvent": [MockFunction spy],
          "onSendTransactionRequest": [MockFunction spy],
          "onSignMessageRequest": [MockFunction spy],
        },
      ]
    `);

      expect(busOnMock).toHaveBeenCalledWith(
        MessageKind.INITIATE_MODAL_ONBOARDING,
        expect.any(Function),
      );

      expect(busOnMock).toHaveBeenCalledWith(
        MessageKind.RESUME_INLINE_FRAME,
        expect.any(Function),
      );

      destroy();
      expect(frameRemoveMock).toHaveBeenCalledOnce();
      expect(busDestroyMock).toHaveBeenCalledOnce();
    });
  });
});
