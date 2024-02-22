import { MessageKind } from "../src";
import { parseMessage } from "../src/parseMessage";

describe("parseMessage", () => {
  describe("success", () => {
    test("returns message when properly structured", () => {
      const result = parseMessage({
        kind: MessageKind.ERROR,
        payload: { message: "err" },
      });

      if (!result.ok) {
        throw new Error("Fail");
      }

      expect(result.value).toMatchInlineSnapshot(`
        {
          "kind": "ERROR",
          "payload": {
            "message": "err",
          },
        }
      `);
    });

    test("returns message when properly structured (stringified)", () => {
      const result = parseMessage(
        JSON.stringify({
          kind: MessageKind.ERROR,
          payload: { message: "err" },
        }),
      );

      if (!result.ok) {
        throw new Error("Fail");
      }

      expect(result.value).toMatchInlineSnapshot(`
        {
          "kind": "ERROR",
          "payload": {
            "message": "err",
          },
        }
      `);
    });
  });

  describe("failure", () => {
    test("returns error for invalid structure", () => {
      const result = parseMessage({ foo: "bar" });

      if (result.ok) {
        throw new Error("Test failed");
      }

      expect(result.error).toMatchInlineSnapshot('"Invalid message."');
    });

    test("returns error for invalid structure (stringified)", () => {
      const result = parseMessage(JSON.stringify({ foo: "bar" }));

      if (result.ok) {
        throw new Error("Test failed");
      }

      expect(result.error).toMatchInlineSnapshot('"Invalid message."');
    });

    test.each([
      ["number", 22],
      ["boolean", false],
      ["string", "foo"],
      ["invalid object", "}{foo: 22}"],
    ])("returns error for stringified data (%s)", (_, message) => {
      const result = parseMessage(JSON.stringify(message));

      if (result.ok) {
        throw new Error("Test failed");
      }

      expect(result.error).toBe(
        "Unable to deserialize message into JSON (source is not a JSON string).",
      );
    });

    test("returns error for invalid JSON", () => {
      const result = parseMessage("{9}");

      if (result.ok) {
        throw new Error("Test failed");
      }

      expect(result.error).toMatchInlineSnapshot('"Unable to deserialize message into JSON (error occurred during parsing)."');
    });
  });
});
