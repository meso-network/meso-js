import { Result, err, ok } from "./result";
import { Message } from "./types";
import { validateMessage } from "./validators";

/**
 * Convert a received message into an object (if necessary) and validate it's structure.
 *
 * Messages received in some environments such as mobile applications with webviews will be stringified.
 */
export const parseMessage = (
  data: string | object,
): Result<Message, string> => {
  let parsedMessage = data;

  if (typeof data === "string") {
    if (data.trim().startsWith("{")) {
      try {
        parsedMessage = JSON.parse(data);
      } catch (error: unknown) {
        return err(
          "Unable to deserialize message into JSON (error occurred during parsing).",
        );
      }
    } else {
      return err(
        "Unable to deserialize message into JSON (source is not a JSON string).",
      );
    }
  }

  if (!validateMessage(parsedMessage as Message)) {
    return err("Invalid message.");
  }

  return ok(parsedMessage as Message);
};
