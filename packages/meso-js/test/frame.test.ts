import { setupFrame } from "../src/frame";
import "@testing-library/jest-dom/vitest";
import { serializedTransferIframeParamsFactory } from "./factories";
import { AuthenticationStrategy } from "../src";

describe("setupFrame", () => {
  const apiHost = "https://api.sandbox.meso.network";

  describe("encodes", () => {
    test("configuration as query params", () => {
      const setupFrameRes = setupFrame(
        apiHost,
        serializedTransferIframeParamsFactory.build(),
      );
      const params = Object.fromEntries(
        new URLSearchParams(new URL(setupFrameRes.element.src).search),
      );
      expect(params).toMatchInlineSnapshot(`
      {
        "authenticationStrategy": "headless_wallet_verification",
        "destinationAsset": "ETH",
        "headlessSignature": "false",
        "layoutOffset": "0",
        "layoutPosition": "top-right",
        "network": "eip155:1",
        "partnerId": "partnerId",
        "sourceAmount": "100",
        "version": "1.0.0",
        "walletAddress": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      }
    `);
    });

    test.each([
      [
        "headless",
        serializedTransferIframeParamsFactory.build(),
        AuthenticationStrategy.HEADLESS_WALLET_VERIFICATION,
      ],
      [
        "wallet verification",
        serializedTransferIframeParamsFactory.build({
          authenticationStrategy: AuthenticationStrategy.WALLET_VERIFICATION,
        }),
        AuthenticationStrategy.WALLET_VERIFICATION,
      ],
      [
        "bypass wallet verification",
        serializedTransferIframeParamsFactory.build({
          authenticationStrategy:
            AuthenticationStrategy.BYPASS_WALLET_VERIFICATION,
        }),
        AuthenticationStrategy.BYPASS_WALLET_VERIFICATION,
      ],
    ])("authentication strategy (%s)", async (_, params, value) => {
      const setupFrameRes = setupFrame(apiHost, params);
      const searchParams = new URLSearchParams(
        new URL(setupFrameRes.element.src).search,
      );

      expect(searchParams.get("authenticationStrategy")).toEqual(value);
    });
  });

  test("creates iframe element in document", () => {
    const setupFrameRes = setupFrame(
      apiHost,
      serializedTransferIframeParamsFactory.build(),
    );
    expect(setupFrameRes.element).toBeInTheDocument();
    expect(setupFrameRes.element.attributes).toMatchInlineSnapshot(`
      NamedNodeMap {
        "allowtransparency": "true",
        "src": "https://api.sandbox.meso.network/app?partnerId=partnerId&network=eip155%3A1&walletAddress=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48&sourceAmount=100&destinationAsset=ETH&headlessSignature=false&layoutPosition=top-right&layoutOffset=0&version=1.0.0&authenticationStrategy=headless_wallet_verification",
        "style": "position: fixed; left: 0px; top: 0px; width: 100%; height: 100%; z-index: 9999; box-sizing: border-box; background-color: transparent;",
      }
    `);
  });

  test("invoking remove callback removes iframe from document", () => {
    const setupFrameRes = setupFrame(
      apiHost,
      serializedTransferIframeParamsFactory.build(),
    );
    expect(setupFrameRes.element).toBeInTheDocument();
    setupFrameRes.remove();
    expect(setupFrameRes.element).not.toBeInTheDocument();
  });

  test("invoking hide callback updates styles to hide element", () => {
    const setupFrameRes = setupFrame(
      apiHost,
      serializedTransferIframeParamsFactory.build(),
    );
    var style = setupFrameRes.element.style;
    expect(style.display).toBe("");
    expect(style.zIndex).toBe("9999");

    setupFrameRes.hide();

    var style = setupFrameRes.element.style;
    expect(style.display).toBe("none");
    expect(style.zIndex).toBe("0");
  });
});
