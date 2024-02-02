import {
  Asset,
  AuthenticationStrategy,
  Network,
  Position,
  SerializedTransferIframeParams,
} from "@meso-network/types";
import { setupFrame } from "../src/frame";
import "@testing-library/jest-dom/vitest";

describe("setupFrame", () => {
  const apiHost = "https://api.sandbox.meso.network";
  const params: SerializedTransferIframeParams = {
    partnerId: "partnerId",
    network: Network.ETHEREUM_MAINNET,
    walletAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    sourceAmount: "100",
    destinationAsset: Asset.ETH,
    headlessSignature: "false",
    layoutPosition: Position.TOP_RIGHT,
    layoutOffset: "0",
    version: "1.0.0",
    authenticationStrategy: AuthenticationStrategy.HEADLESS_WALLET_SIGNATURE,
  };

  var setupFrameRes: ReturnType<typeof setupFrame>;
  beforeEach(() => {
    setupFrameRes = setupFrame(apiHost, params);
  });

  test("creates iframe element in document", () => {
    expect(setupFrameRes.element).toBeInTheDocument();
    expect(setupFrameRes.element.attributes).toMatchInlineSnapshot(`
      NamedNodeMap {
        "allowtransparency": "true",
        "src": "https://api.sandbox.meso.network/app?partnerId=partnerId&network=eip155%3A1&walletAddress=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48&sourceAmount=100&destinationAsset=ETH&headlessSignature=false&layoutPosition=top-right&layoutOffset=0&version=1.0.0",
        "style": "position: fixed; left: 0px; top: 0px; width: 100%; height: 100%; z-index: 9999; box-sizing: border-box; background-color: transparent;",
      }
    `);
  });

  test("invoking remove callback removes iframe from document", () => {
    expect(setupFrameRes.element).toBeInTheDocument();
    setupFrameRes.remove();
    expect(setupFrameRes.element).not.toBeInTheDocument();
  });

  test("invoking hide callback updates styles to hide element", () => {
    var style = setupFrameRes.element.style;
    expect(style.display).toBe("");
    expect(style.zIndex).toBe("9999");

    setupFrameRes.hide();

    var style = setupFrameRes.element.style;
    expect(style.display).toBe("none");
    expect(style.zIndex).toBe("0");
  });
});
