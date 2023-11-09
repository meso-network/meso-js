import { createPostMessageBus } from "../src";
import { MESO_IFRAME_ORIGIN, PARTNER_APP_ORIGIN } from "./setupTests";

const injectIframe = (src: string) => {
  const frame = document.createElement("iframe");
  frame.src = src;
  document.body.appendChild(frame);
};

describe("createPostMessageBus", () => {
  describe("in iframe", () => {
    test("returns a post message bus instance for valid target origin", () => {
      expect(createPostMessageBus(PARTNER_APP_ORIGIN)).toMatchInlineSnapshot(`
      {
        "destroy": [Function],
        "emit": [Function],
        "on": [Function],
      }
    `);
    });

    test("returns a structured error for * origin", () => {
      expect(createPostMessageBus("*")).toMatchInlineSnapshot(`
      {
        "message": "Wildcard (*) target origin is not allowed.",
      }
    `);
    });

    test("returns a structured error for valid origin that cannot be found", () => {
      expect(createPostMessageBus("http://foo.com")).toMatchInlineSnapshot(`
      {
        "message": "No iframe found with origin http://foo.com",
      }
    `);
    });
  });

  describe("in parent frame", () => {
    afterEach(() => {
      [...document.querySelectorAll("iframe")].forEach((frame) => {
        document.body.removeChild(frame);
      });
    });

    test("returns post message bus instance if frame with matching origin is found", () => {
      injectIframe(MESO_IFRAME_ORIGIN);

      expect(createPostMessageBus(MESO_IFRAME_ORIGIN)).toMatchInlineSnapshot(`
        {
          "destroy": [Function],
          "emit": [Function],
          "on": [Function],
        }
      `);
    });

    test("returns post message bus instance if frame with matching origin is found (multiple iframes)", () => {
      injectIframe("http://meso.foo");
      injectIframe(MESO_IFRAME_ORIGIN);
      injectIframe("http://meso.bar");

      expect(createPostMessageBus(MESO_IFRAME_ORIGIN)).toMatchInlineSnapshot(`
        {
          "destroy": [Function],
          "emit": [Function],
          "on": [Function],
        }
      `);
    });

    test("returns error if no frame with matching origin is found (multiple iframes)", () => {
      injectIframe("http://meso.bar");

      expect(createPostMessageBus(MESO_IFRAME_ORIGIN)).toMatchInlineSnapshot(`
        {
          "message": "No iframe found with origin http://meso.iframe",
        }
      `);
    });
  });
});
