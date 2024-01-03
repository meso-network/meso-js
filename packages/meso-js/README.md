# @meso-network/meso-js

`meso-js` is a browser SDK that allows you to integrate Meso's fiat-to-crypto
on-ramp directly into your decentralized application (dApp).
[Meso](https://meso.network) handles user onboarding, including KYC checks and
identity verification. It also debits funds from users' bank accounts and then
purchases and transfers crypto to the specified wallet address.

⚡️ Looking for a quickstart? [Jump to usage](#vanilla-javascripttypescript). ⚡️

The SDK is written in TypeScript and ships with type definitions, but can be
used in a vanilla JavaScript application as well.

> 📓 Currently, the SDK is in private beta. To request access, contact
> [support@meso.network](mailto:support@meso.network).

<details>
  <summary><strong>Contents</strong></summary>

- [@meso-network/meso-js](#meso-networkmeso-js)
  - [Requirements](#requirements)
    - [Account setup](#account-setup)
    - [Integration setup](#integration-setup)
      - [Content Security Policy](#content-security-policy)
  - [Usage](#usage)
    - [Installation](#installation)
  - [Initialize a transfer](#initialize-a-transfer)
    - [Vanilla JavaScript/TypeScript](#vanilla-javascripttypescript)
    - [React](#react)
  - [Integration lifecycle](#integration-lifecycle)
  - [Reference](#reference)
    - [`transfer`](#transfer)
    - [Headless Signature](#headless-signature)
    - [Customizing the layout](#customizing-the-layout)
      - [Position](#position)
      - [Offset](#offset)
    - [Handling errors](#handling-errors)
      - [Configuration errors](#configuration-errors)
      - [Other errors](#other-errors)
    - [Events](#events)
      - [`TRANSFER_APPROVED`](#transfer_approved)
      - [`TRANSFER_COMPLETE`](#transfer_complete)
      - [`ERROR`](#error)
      - [`CONFIGURATION_ERROR`](#configuration_error)
      - [`CLOSE`](#close)
  - [Environments](#environments)
  - [Testing](#testing)
  - [Supported browsers/runtimes](#supported-browsersruntimes)
  - [Caveats](#caveats)

</details>

---

## Requirements

### Account setup

To use the `meso-js` SDK, you must have a partner account with
[Meso](https://meso.network). To sign up, reach out to
[support@meso.network](mailto:support@meso.network). During the onboarding
process, you will need to specify the
[origin/domain](https://developer.mozilla.org/en-US/docs/Glossary/Origin) of
your dApp or web application to ensure`meso-js` operates seamlessly on your
site. Meso will then provide you with a `partnerId` and an npm token for SDK
installation and configuration.

### Integration setup

Once you have been onboarded as a partner and you have your credentials, you
will need to do at least the following:

- Configure your application's
  [Content-Security-Policy](#content-security-policy)
- Be able to connect to a user's wallet from your application
- (recommended) Have a pre-production instance of your application where you can
  test against the Meso [sandbox](#environments)

#### Content Security Policy

`meso-js` can be used in most web browsers and application stacks. However, you
will need to ensure you configure a [Content Security Policy (CSP)](#content-security-policy)
to allow Meso's iframe and network calls from your page.

The `meso-js` SDK renders an iframe onto your page. You will need to make sure
your [Content Security Policy
(CSP)](https://developer.mozilla.org/en-US/docs/Glossary/CSP) contains the
following rules and allows the correct origins.

- [frame-src](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-src)
- [connect-src](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/connect-src)

**Sandbox:**

```sh
Content-Security-Policy: frame-src https://api.sandbox.meso.network/; connect-src https://api.sandbox.meso.network/;
```

**Production:**

```sh
Content-Security-Policy: frame-src https://api.meso.network/; connect-src https://api.meso.network/;
```

## Usage

⚠️ Currently, the SDK is in private beta. To request access, contact [support@meso.network](mailto:support@meso.network).

### Installation

`meso-js` is available via npm and ships with TypeScript definitions.

```sh
# npm
npm i @meso-network/meso-js

# yarn
yarn add @meso-network/meso-js

# pnpm
pnpm i @meso-network/meso-js
```

## Initialize a transfer

To initiate a transfer for a user, use the [`transfer`](#transfer) function from
the SDK. Upon activation, Meso will display an iframe covering the entire
screen, guiding the user through the onboarding and crypto transfer process.

> 📙 View the [reference](#reference) to learn
> more about how to set up your integration.

`meso-js` can be used in vanilla JavaScript or TypeScript applications as well
as within popular frameworks such a [React](#react).

### Vanilla JavaScript/TypeScript

You can launch the Meso experience at any time, but usually it is in response to
a user action such as clicking a button. The following example assumes you have
a page with a `Buy Crypto` button.

```ts
import { transfer, Environment } from "@meso-network/meso-js";
import type {
  EventKind,
  MesoEvent,
  SigningMessage,
} from "@meso-network/meso-js";

const buyCrypto = document.querySelector("button#buy-crypto");

buyCrypto.addEventListener("click", () => {
  transfer({
    partnerId: "<PARTNER_ID>", // Your unique Meso partner ID
    environment: Environment.SANDBOX, // SANDBOX | PRODUCTION
    sourceAmount: "100", // The amount (in USD) the user will spend
    destinationAsset: Asset.ETH, // The token the user will receive ("ETH" | "SOL" | "USDC")
    network: Network.ETHEREUM_MAINNET, // The network to use for the transfer
    walletAddress: "<WALLET_ADDRESS>", // The user's wallet address obtained at runtime by your application

    // A callback to handle events throughout the integration lifecycle
    onEvent({ kind, payload }: MesoEvent) {
      switch (kind) {
        // The transfer has been approved and will go through, however funds have not yet moved.
        case EventKind.TRANSFER_APPROVED:

        // The transfer has been finalized and the assets have been transferred.
        case EventKind.TRANSFER_COMPLETE:
          console.log(payload.transfer);
          break;

        // There was an issue with the provided configuration
        case EventKind.CONFIGURATION_ERROR:
          console.error(payload.error.message);
          break;

        // A general error has occurred
        case EventKind.ERROR:
          console.error(payload.error.message);
          break;

        case EventKind.CLOSE:
          console.log("Meso experience closed.");
      }
    },

    // A callback to handle having the user verify their wallet ownership by signing a message
    async onSignMessageRequest(message: SigningMessage) {
      // Have the user sign a message via their wallet and return the result.
      return await signMessage(message);
    },
  });
});
```

### React

You can also use `meso-js` in a React application out of the box.

```ts
import { useCallback, useState, useEffect } from "react";
import { transfer, Environment } from "@meso-network/meso-js";
import type {
  EventKind,
  Event,
  SigningMessage,
  TransferInstance,
} from "@meso-network/meso-js";

export const BuyCrypto = () => {
  const [mesoTransfer, setMesoTransfer] = useState<TransferInstance>();

  // Make sure to clean up the integration when your component unmounts
  useEffect(() => {
    return () => {
      mesoTransfer.destroy();
    };
  }, [mesoTransfer]);

  const launchMeso = useCallback(() => {
    const transfer = transfer({
      partnerId: "<PARTNER_ID>", // Your unique Meso partner ID
      environment: Environment.SANDBOX, // SANDBOX | PRODUCTION
      sourceAmount: "100", // The amount (in USD) the user will spend
      destinationAsset: Asset.ETH, // The token the user will receive ("ETH" | "SOL" | "USDC")
      network: Network.ETHEREUM_MAINNET, // The network to use for the transfer
      walletAddress: "<WALLET_ADDRESS>", // The user's wallet address obtained at runtime by your application

      // A callback to handle events throughout the integration lifecycle
      onEvent({ kind, payload }: MesoEvent) {
        switch (kind) {
          // The transfer has been approved and will go through, however funds have not yet moved.
          case EventKind.TRANSFER_APPROVED:

          // The transfer has been finalized and the assets have been transferred.
          case EventKind.TRANSFER_COMPLETE:
            console.log(payload.transfer);
            break;

          // There was an issue with the provided configuration
          case EventKind.CONFIGURATION_ERROR:
            console.error(payload.error.message);
            break;

          // A general error has occurred
          case EventKind.ERROR:
            console.error(payload.error.message);
            break;

          case EventKind.CLOSE:
            console.log("Meso experience closed.");
        }
      },

      // A callback to handle having the user verify their wallet ownership by signing a message
      async onSignMessageRequest(message: SigningMessage) {
        // Have the user sign a message via their wallet and return the result.
        return await signMessage(message);
      },
    });

    setMesoTransfer(transfer);
  }, []);

  return (
    <div>
      <button onClick={launchMeso}>Buy Crypto</button>
    </div>
  );
};
```

## Integration lifecycle

| Lifecycle                                                                                                                  |
| -------------------------------------------------------------------------------------------------------------------------- |
| ![Meso integration lifecycle](https://github.com/meso-network/meso-js/assets/1217116/b0afb4a4-8c59-49b0-ab7d-d279250094d0) |

When your user is ready, initiate the on-ramp by calling
[`transfer()`](#transfer). During setup, subscribe to the [`onEvent`](#events)
callback to receive updates on transfer statuses, errors, and user interactions.

When the Meso interface appears, your [`onSignMessageRequest`](#transfer)
callback will prompt a message signing request. You'll then retrieve a signed
message from the user's wallet and pass it to the SDK.

After the transfer receives an `APPROVED`` status, await its progression to
`COMPLETE`. The Meso UI will be removed, leaving the iframe in place. You'll
receive a notification in your onEvent callback once the transfer finalizes.

> ℹ **Note:** Funds _are not moved_ until the transfer is `COMPLETE`.

While awaiting transfer completion, you can display a loading state for the
user. Upon completion, the SDK will provide the transfer details for display to
the user.

Please note,if the Meso experience is closed (via [`destroy`](#transfer)),
there's no way to check the transfer's status. It's best to wait for the
`COMPLETE` event.

Once the transfer is complete, the `onEvent` callback will notify you, and the
Meso iframe will be unmounted. You can then navigate the user to another view.

Meso will also send the user an email detailing the transfer.

## Reference

### `transfer`

To initialize the `transfer` experience, provide the following configuration.

```ts
type TransferConfiguration = {
  partnerId: string; // Your unique Meso partner ID
  environment: Environment; // SANDBOX | PRODUCTION
  sourceAmount: string; // The amount (in USD) the user will spend
  destinationAsset: Asset; // The token the user will receive ("ETH" | "SOL" | "USDC")
  network: Network; // The network to use for the transfer
  walletAddress: string; // The user's wallet address obtained at runtime by your application
  layout?: Layout; // Configuration to customize how the Meso experience is launched and presented
  headlessSignature?: boolean; // Perform message signing in the background without prompting the user. This is useful for embedded wallets
  onSignMessageRequest: (message: string) => Promise<SignedMessageResult>; // A callback that is fired when you need to collect the user's signature via their wallet
  onEvent?: (event: MesoEvent) => void; // An optional handler to notify you when an event or error occurs. This is useful for tracking the state of the user through the experience
};

enum Network {
  ETHEREUM_MAINNET = "eip155:1"
  SOLANA_MAINNET = "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp"
}

enum DestinationAsset {
  ETH = "ETH"
  SOL = "SOL"
  USDC = "USDC"
}

enum Environment {
  SANDBOX = "SANDBOX"
  // Uses mainnet(s) and transfers fiat currency.
  PRODUCTION = "PRODUCTION"
} as const

enum Position {
  TOP_RIGHT = "top-right",
  BOTTOM_RIGHT = "bottom-right",
  BOTTOM_LEFT = "bottom-left",
  TOP_LEFT = "top-left",
  CENTER = "center",
}

/**
 * A stringified positive integer (excluding units) representing a number of pixels.
 */
export type PixelValue = `${number}`;

type Layout = {
  position?: Position;
  offset?:
    | PixelValue
    | { horizontal: PixelValue, vertical?: PixelValue}
    | { horizontal?: PixelValue, vertical: PixelValue};
};
```

The `transfer` call returns a `TransferInstance` with a `destroy()` method. You
can use this to tear down the integration at any time. Calling this will clean
up the Meso iframe and you can safely re-initialize if needed.

**Type:**

```ts
type TransferInstance = {
  destroy: () => void;
};
```

**Example:**

```ts
const { destroy } = transfer({ ... });

destroy(); // The meso iframe is unmounted. No more events/callbacks will fire.
```

### Headless Signature

In some cases (such as embedded wallets), message signing may be transparent to
the end user. You can launch the Meso experience with `headlessSignature: true`
which will invoke the `onSignMessageRequest` callback immediately allowing you
to return a signed message back to the Meso SDK using the embedded wallet and
keeping this step completely transparent to the user.

### Customizing the layout

The Meso experience renders as a full-viewport modal. However, you can provide
configuration to set the positioning of the rendered UI. This is helpful in
cases where you want the application to render in a more precise location.

You can customize the `Position` of the rendered UI and the offset (from the
edge of the viewport).

#### Position

When initializing the Meso experience, you can provide a `position` value of:

- `TOP_RIGHT` (default)
- `BOTTOM_RIGHT`
- `BOTTOM_LEFT`
- `TOP_LEFT`
- `CENTER`

Example:

```typescript
transfer({
  // ... other params
  layout: {
    position: Position.BOTTOM_RIGHT,
  },
});
```

#### Offset

You can provide a horizontal and vertical offset to the rendered UI to add more
padding from the edge of the viewport. These values are provided as stringified
non-negative integers. You _do not_ need to provide units.

Example:

```typescript
transfer({
  // ... other params
  layout: {
    position: Position.TOP_RIGHT,
    offset: {
      horizontal: "50", // An extra 50px of right-padding will be applied
      vertical: "100", // An extra 100px of top-padding will be applied
    },
  },
});
```

The horizontal and vertical offsets will be applied based on the
[`layout.position`](#position) value you provided.

| Position       | Horizontal offset     | Vertical offset       |
| -------------- | --------------------- | --------------------- |
| `TOP_RIGHT`    | Right padding         | Top padding           |
| `BOTTOM_RIGHT` | Right padding         | Bottom padding        |
| `BOTTOM_LEFT`  | Left padding          | Bottom padding        |
| `TOP_LEFT`     | Left padding          | Top padding           |
| `CENTER`       | No padding is applied | No padding is applied |

If you would like to use the same value for horizontal and vertical offset, you
can provide a string value:

```typescript
transfer({
  // ... other params
  layout: {
    position: Position.TOP_RIGHT,
    offset: "50", // An extra 50px of right-padding and 50px of top-padding will be applied
  },
});
```

### Handling errors

#### Configuration errors

If there is an error in the configuration provided to [`transfer`](#transfer), a
`CONFIGURATION_ERROR` will be provided to your [`onEvent`](#transfer) callback.
This error may occur if you provide an invalid wallet address or mismatched
networks and assets.

**Type:**

```ts
// An error surfaced from the `meso-js` integration.
type MesoError = {
  // A client-friendly error message.
  message: string;
};

type ConfigurationErrorPayload = { error: MesoError };
```

**Example:**

```ts
transfer({
  // ...
  onEvent: (event: MesoEvent) => {
    if (event.kind === EventKind.CONFIGURATION_ERROR) {
      // handle configuration error
      console.log(event.payload.error.message); // "some error message"
    }
  },
});
```

If you do not provide the `onEvent` callback, `meso-js` will `throw` an exception.

#### Other errors

Other errors dispatched during the integration will also be surfaced via the
`onEvent` callback.

**Type:**

```ts
// An error surfaced from the `meso-js` integration.
type MesoError = {
  // A client-friendly error message.
  message: string;
};
```

**Example:**

```ts
transfer({
  // ...
  onEvent: (event: MesoEvent) => {
    if (event.kind === EventKind.ERROR) {
      // handle general error
      console.log(event.payload.error.message); // "some error message"
    }
  },
});

export type ErrorPayload = { error: MesoError };
```

### Events

The `onEvent` callback you provide during [initialization](#transfer) will be
called with structured events that are dispatched throughout the integration
lifecycle.

Each event has a `kind` and a `payload` (which may be `null` in some cases).

**Example usage:**

```ts
onEvent({kind, payload}: MesoEvent) {
  switch (kind) {
  case EventKind.TRANSFER_APPROVED:
    console.log(payload); // { transfer: { ... }}
    break;
  case EventKind.TRANSFER_COMPLETE:
    console.log(payload); // { transfer: { ... }}
    break;
  case EventKind.CONFIGURATION_ERROR:
    console.log(payload); // { message: "an error message" }
    break;
  case EventKind.ERROR:
    console.log(payload); // { message: "an error message" }
    break;
  case EventKind.CLOSE:
    console.log(payload); // null
    break;
  }
}
```

#### `TRANSFER_APPROVED`

This event is fired when the user successfully completes a transfer and it has
been approved. At this point, the transfer is not yet _complete_ and funds have
not been moved.

Internally, MesoJS uses the `transfer.id` in this payload to poll for the status
of the transfer and emit further events as it changes.

**Example payload:**

```ts
{
  kind: "TRANSFER_APPROVED",
  payload: {
    transfer: {
      id: "a_meso_transfer_id",
      status: "APPROVED",
      updatedAt: "2023-10-24T15:59:29.562Z",
      networkTransactionId: "a_network_transaction_id" // If available
    }
  }
}
```

#### `TRANSFER_COMPLETE`

This event is dispatched when the user's transfer is complete and funds have
been moved.

**Example payload:**

```ts
{
  kind: "TRANSFER_COMPLETE",
  payload: {
    transfer: {
      id: "a_meso_transfer_id",
      status: "COMPLETED",
      updatedAt: "2023-10-24T15:59:29.562Z",
      networkTransactionId: "a_network_transaction_id" // If available
    }
  }
}
```

#### `ERROR`

This event is fired when an error occurs in the Meso experience.

**Example payload:**

```ts
{
  kind: "ERROR",
  payload: {
    message: "Unable to complete transfer."
  }
}
```

#### `CONFIGURATION_ERROR`

This event is fired when there is a validation error when calling `transfer`.

See [configuration errors](#configuration-errors) for more.

**Example payload:**

```ts
{
  kind: "CONFIGURATION_ERROR",
  payload: {
    message: "Invalid ETH wallet address."
  }
}
```

#### `CLOSE`

This event is called when the Meso experience is closed and the iframe is removed.

This event will fire in the following scenarios:

- The transfer is `COMPLETE`
- The user dismisses the iframe manually
- You call `destroy` on the Meso instance

**Example payload:**

```ts
{
  kind: "CLOSE";
  payload: null;
}
```

## Environments

Meso provides two environments:

- `SANDBOX` – In this environment, no crypto assets are transferred and no fiat
  assets are moved.
- `PRODUCTION` – In this environment, production networks will be used to
  transfer real crypto assets. Fiat assets are moved.

You can specify the network when calling [transfer](#transfer).

## Testing

In sandbox, you can use the following values for testing:

- [`transfer`](#transfer) configuration
  - [`sourceAmount`](#transfer)
    - `"666.66"` will cause onboarding to fail due to risk checks and the user
      will be frozen
    - `"666.06"` will fail the transfer with the payment being declined
- 2FA (SMS)
  - `000000` will succeed
- Onboarding values
  - Debit Card
    - Number: `5305484748800098`
    - CVV: `435`
    - Expiration Date: `12/2025`
  - Taxpayer ID (last 4 digits of SSN)
    - `0000` will require the user enter a fully valid SSN (you can use `123345432`).
    - Any other 4-digit combination will pass

## Supported browsers/runtimes

The Meso experience will work in first-party web applications. Currently, mobile
support (such as webviews) is limited and not supported.

Meso supports the latest versions of:

- Chrome (Desktop, iOS, Android)
- Safari (macOS)
- Safari (iOS)
- Brave, Arc, and other Chrome-like browsers
- Firefox

If you have issues with specific browsers/environments, contact [support@meso.network](mailto:support@meso.network).

## Caveats

- Next.js and SSR – `meso-js` will not work in a server-side environment. Ensure
  you are deferring initialization until your client-side code is ready in the
  browser.
