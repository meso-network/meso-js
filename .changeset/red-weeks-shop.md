---
"@meso-network/meso-js": patch
---

Provides default values for `sourceAsset` and `authenticationStrategy` when calling `inlineTransfer`.

- `sourceAsset`: Will default to `Asset.USD` ("USD")
- `authenticationStrategy`; Will default to `AuthenticationStrategy.WALLET_VERIFICATION` ([wallet verification](https://developers.meso.network/javascript-sdk/reference#authentication-strategy))
