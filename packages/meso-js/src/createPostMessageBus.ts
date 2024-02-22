import { parseMessage } from "./parseMessage";
import type {
  Message,
  PostMessageBus,
  PostMessageBusInitializationError,
} from "./types";
import { MessageKind } from "./types";
import {
  validateHandlerFunction,
  validateMessage,
  validateMessageKind,
} from "./validators";

type HandlerFn = Parameters<PostMessageBus["on"]>[1];

/** Build a namespaced string to identify Meso specific errors/logs. */
const generateLogMessage = (message: string): string =>
  `(@meso-network/meso-js): ${message}`;

const logError = (message: string) => {
  // eslint-disable-next-line no-console
  console.error(generateLogMessage(message));
};

export const getParentWindowOrigin = () => {
  if ("ancestorOrigins" in location) {
    return location.ancestorOrigins[0];
  } else if (document.referrer) {
    return new URL(document.referrer).origin;
  }
};

/**
 * Create a post message bus instance from a parent frame/native app or from within the Meso experience app/iframe.
 *
 * @param targetOrigin A qualified [origin](https://developer.mozilla.org/en-US/docs/Web/API/Location/origin) value
 * @param syntheticWindowMessageHandle An optional reference to a `window` for sending/receiving messages. If provided, the bus will not attempt to crawl `iframe` elements on the page and instead hook into this window handler's `postMessage` functionality.
 *
 * This value is typically a custom message handler created in mobile apps for use with webviews.
 *
 * - On iOS, this is created via a [WKScriptMessageHandler](https://developer.apple.com/documentation/webkit/wkscriptmessagehandler)
 * - On Android, this is created via a [WebMessagePort](https://developer.android.com/reference/android/webkit/WebMessagePort)
 *
 * @returns {(PostMessageBus | undefined)} A `PostMessageBus` or `undefined`.
 */
export const createPostMessageBus = (
  targetOrigin: string,
  syntheticWindowMessageHandle?:
    | Window
    | Extract<HTMLIFrameElement["contentWindow"], Window>,
): PostMessageBus | PostMessageBusInitializationError => {
  if (targetOrigin === "*") {
    const message = "Wildcard (*) target origin is not allowed.";

    logError(message);
    return { message };
  }

  let postMessageWindow: Window;
  if (syntheticWindowMessageHandle) {
    // If we are given a custom window handler (for mobile webviews), use that.
    postMessageWindow = syntheticWindowMessageHandle;
  } else if (getParentWindowOrigin() === targetOrigin) {
    // target is parent, currently in iframe
    postMessageWindow = window.parent;
  } else {
    // otherwise, find child iframe with matching origin
    const frames = Array.from(document.querySelectorAll("iframe"));
    const frameWindow = frames.find((frame) => {
      try {
        const url = new URL(frame.src);
        return url.origin === targetOrigin;
      } catch (err: unknown) {
        return false;
      }
    });

    if (!frameWindow) {
      const message = `No iframe found with origin ${targetOrigin}`;

      logError(message);
      return { message };
    }

    if (frameWindow.contentWindow === null) {
      const message = `Unable to establish messaging with ${targetOrigin}`;

      logError(message);
      return { message };
    }

    postMessageWindow = frameWindow.contentWindow;
  }

  const handlers = new Map<MessageKind, HandlerFn[]>();
  const postMessageHandler = (event: MessageEvent<Message>) => {
    // Check if our event is from a known or trusted source
    if (targetOrigin !== "*" && targetOrigin !== event.origin) {
      return;
    }

    const parsedMessageResult = parseMessage(event.data);

    if (!parsedMessageResult.ok) {
      return;
    }

    // If there is no handler registered, abort.
    if (
      !handlers.has(parsedMessageResult.value.kind) ||
      // Prevent message structs we have identified as extraneous.
      "target" in parsedMessageResult.value
    ) {
      return;
    }

    handlers.get(parsedMessageResult.value.kind)?.forEach((handlerFn) => {
      handlerFn(parsedMessageResult.value, (message: Message) => {
        postMessageWindow.postMessage(message, event.origin);
      });
    });
  };

  window.addEventListener("message", postMessageHandler);

  const bus: PostMessageBus = {
    on(eventKind: MessageKind, handler: HandlerFn) {
      const isValidMessageKind = validateMessageKind(eventKind);

      if (!isValidMessageKind) {
        throw new Error(
          generateLogMessage(
            `Invalid event (${eventKind}). The subscription will not be added.`,
          ),
        );
      }

      const isValidHandlerFunction = validateHandlerFunction(handler);

      if (!isValidHandlerFunction) {
        throw new Error(
          generateLogMessage(
            `Invalid event handler. The subscription will not be added.`,
          ),
        );
      }

      const fns = handlers.get(eventKind) ?? [];
      handlers.set(eventKind, fns.concat([handler]));

      return this;
    },

    emit(message: Message) {
      const isValidMessage = validateMessage(message);

      if (!isValidMessage) {
        throw new Error(
          generateLogMessage("Invalid message. Check the value and try again."),
        );
      }

      postMessageWindow.postMessage(message, targetOrigin);

      return this;
    },

    destroy() {
      window.removeEventListener("message", postMessageHandler);
      handlers.clear();
    },
  };
  return bus;
};

export { MessageKind, Message, PostMessageBus };
