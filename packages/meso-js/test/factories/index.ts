import {
  Asset,
  AuthenticationStrategy,
  Network,
  Position,
  SerializedTransferIframeParams,
} from "@meso-network/types";

export const serializedTransferIframeParamsFactory: {
  build: (
    overrides?: Partial<SerializedTransferIframeParams>,
  ) => SerializedTransferIframeParams;
} = {
  build(overrides = {}) {
    return {
      partnerId: "partnerId",
      network: Network.ETHEREUM_MAINNET,
      walletAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      sourceAmount: "100",
      destinationAsset: Asset.ETH,
      headlessSignature: "false",
      layoutPosition: Position.TOP_RIGHT,
      layoutOffset: "0",
      version: "1.0.0",
      authenticationStrategy:
        AuthenticationStrategy.HEADLESS_WALLET_VERIFICATION,
      ...overrides,
    };
  },
};
