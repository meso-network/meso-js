---
"@meso-network/meso-js": patch
---

Adds the `TRANSFER_INCOMPLETE` event to the [`onEvent`](https://developers.meso.network/javascript-sdk/reference#on-event) callback.

This event is dispatched only for the `inlineTransfer` integration and signals the user was unable to complete onboarding due to KYC failures/restrictions. It is not the same as the user canceling the flow.
