# `@meso-network/post-message-bus`

`post-message-bus` is a Meso-specific library for sending strongly typed
messages across frames (iframes and parent windows) using
[postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage).

It is currently unavailable for standalone use.

> View the [CHANGELOG](./CHANGELOG.md) or read the [`meso-js` docs](../meso-js//README.md).

<details>
  <summary><strong>Contents</strong></summary>

- [`@meso-network/post-message-bus`](#meso-devpost-message-bus)
  - [Usage](#usage)
    - [From a parent frame (window)](#from-a-parent-frame-window)
    - [From inside an iframe](#from-inside-an-iframe)
  - [Reference](#reference)
    - [`createPostMessageBus`](#createpostmessagebus)
      - [`PostMessageBus`](#postmessagebus)
    - [`PostMessageBusInitializationError`](#postmessagebusinitializationerror)
    - [Subscribe to events](#subscribe-to-events)
    - [Emit events](#emit-events)

</details>

## Usage

### From a parent frame (window)

```ts
import { createPostMessageBus } from "@meso-network/post-message-bus";

// Initialize the bus by providing an origin of the iframe to communicate with.
const bus = createPostMessageBus("https://iframe.origin");

// Listen for events
bus.on("CLOSE", () => {
  console.log("close event called");
});
```

### From inside an iframe

```ts
import { createPostMessageBus } from "@meso-network/post-message-bus";

// Initialize the bus by providing an origin of the parent frame to communicate with.
const bus = createPostMessageBus(window.location.ancestorOrigins[0]);

// Listen for events
bus.on("RETURN_SIGNED_MESSAGE_RESULT", (message) => {
  console.log(message); // { payload: { signedMessage: "some-string" }}
});

// Emit events
bus.emit("REQUEST_SIGNED_MESSAGE", {
  payload: {
    messageToSign: "a message to be signed",
  },
});
```

## Reference

You can view the full type definitions [here](./src/index.ts).

### `createPostMessageBus`

The `createPostMessageBus` function accepts target
[origin](https://developer.mozilla.org/en-US/docs/Glossary/Origin) to establish
[postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)
communication.

The origin must be valid (`<protocol>://<domain>`) and cannot be `*`.

The function returns either `postMessageBus` object or an initialization error.

#### `PostMessageBus`

```ts
type PostMessageBus = {
  /**
   * Subscribe to an event using the message kind (name).
   *
   * The attached handler will be invoked each time this event is seen until the event handler is detached.
   */
  on: (eventKind: MessageKind, handler: PostMessageHandlerFn) => PostMessageBus;

  /**
   * Send a message to a specific [origin](https://developer.mozilla.org/en-US/docs/Web/API/Location/origin). If the `targetOrigin` is omitted, the message will be broadcast to all origins (`*`).
   */
  emit: (message: Message, targetOrigin?: string) => PostMessageBus;

  /**
   * Detach event handlers and end post message communications.
   */
  destroy: () => void;
};
```

### `PostMessageBusInitializationError`

```ts
type PostMessageBusInitializationError = {
  /**
   * A _developer_ friendly message containing details of the error.
   */
  message: string;
};
```

### Subscribe to events

You can subscribe to message events by using the `.on` method from the [returned
instance](#createpostmessagebus).

The method takes two arguments:

- `eventKind: MessageKind` – which message you'd like to subscribe to
  - `REQUEST_SIGNED_MESSAGE`: Request from Meso experience to parent window to
    initiate signing.
  - `RETURN_SIGNED_MESSAGE_RESULT`: Dispatch the result of a signature request
    from the parent window to the Meso experience.
  - `CLOSE`: Dispatch a message from the Meso experience to the parent window to
    close the experience.
  - `TRANSFER_UPDATE`: Dispatch a message from the Meso experience to the Partner
    Window when the transfer has been updated.
  - `ERROR`: Dispatch an error message from the Meso experience to the parent window.
- `handler: PostMessageHandlerFn` – a callback that accepts two arguments:
  - `message: Message` – a strongly typed message (see [types](./src/types.ts))
  - `reply: (message: Message) => void` – an optional reply callback to that the
    handler in the other frame can call with a structured message (see
    [types](./src/types.ts)).

### Emit events

You can emit message events by using the `.emit` method from the [returned
instance](#createpostmessagebus).

The method takes two arguments:

- `message: Message` – a strongly typed message (see [types](./src/types.ts))
- `targetOrigin?: string` – an optional, valid origin to send the
  [postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)
  to.
