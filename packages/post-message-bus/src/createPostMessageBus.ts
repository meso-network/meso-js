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
  `(@meso-network/post-message-bus): ${message}`;

const logError = (message: string) => {
  // eslint-disable-next-line no-console
  console.error(generateLogMessage(message));
};

export const createPostMessageBus = (
  targetOrigin: string,
): PostMessageBus | PostMessageBusInitializationError => {
  if (targetOrigin === "*") {
    const message = "Wildcard (*) target origin is not allowed.";

    logError(message);
    return { message };
  }

  let postMessageWindow: Window;
  if (
    window.location.ancestorOrigins &&
    window.location.ancestorOrigins[0] === targetOrigin
  ) {
    // target is parent, currently in iframe
    postMessageWindow = window.parent;
  } else {
    // otherwise, find child iframe with matching origin
    const frames = Array.from(document.querySelectorAll("iframe"));
    const frameWindow = frames.find(
      (frame) => new URL(frame.src).origin === targetOrigin,
    );

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
    if (event.data && typeof event.data === "object" && "target" in event.data)
      return;

    if (
      (targetOrigin !== "*" && targetOrigin !== event.origin) ||
      !handlers.has(event.data.kind)
    ) {
      return;
    }

    handlers.get(event.data.kind)?.forEach((handlerFn) => {
      handlerFn(event.data, (message: Message) => {
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
