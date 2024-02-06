---
"@meso-network/meso-js": patch
"@meso-network/types": patch
"@meso-network/post-message-bus": patch
---

Deprecate `headlessSignature` in favor of `authenticationStrategy` which introduces:

- `WALLET_VERIFICATION` – Requires the user to sign a message with their wallet
  before engaging in a transfer
- `HEADLESS_WALLET_VERIFICATION` – Requires an app (such as an embedded wallet)
  to sign a message on behalf of the user
- `NO_WALLET_VERIFICATION` – Requires no wallet signing for the transfer. This
  is typically used for pre-deployed smart contract wallets
