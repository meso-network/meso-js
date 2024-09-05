# @meso-network/meso-js

## 0.2.0

### Minor Changes

- [#86](https://github.com/meso-network/meso-js/pull/86) [`d6f88d3`](https://github.com/meso-network/meso-js/commit/d6f88d328700ada2f6e5f8006ae8869a610d6f52) Thanks [@kyledetella](https://github.com/kyledetella)! - Deprecate `MATIC` in favor of `POL`. As of September 4, 2024, the `MATIC` token is now `POL` ([read more](https://polygon.technology/blog/save-the-date-matic-pol-migration-coming-september-4th-everything-you-need-to-know)).

  This release deprecates `Asset.MATIC` which will be removed in a future version. Instead, `Asset.POL` should be used.

## 0.1.10

### Patch Changes

- [#83](https://github.com/meso-network/meso-js/pull/83) [`add10c0`](https://github.com/meso-network/meso-js/commit/add10c0f9e5ece6b6b99b547122028f592d78d5b) Thanks [@dseeto](https://github.com/dseeto)! - Add support for Apple Pay

## 0.1.9

### Patch Changes

- [#81](https://github.com/meso-network/meso-js/pull/81) [`9a440cf`](https://github.com/meso-network/meso-js/commit/9a440cfaaef51150bb76d9260c6e28b0e1ccf9f5) Thanks [@dseeto](https://github.com/dseeto)! - Add support for passing `destinationAmount`, when initiating a transfer.

## 0.1.8

### Patch Changes

- [#79](https://github.com/meso-network/meso-js/pull/79) [`c84bd58`](https://github.com/meso-network/meso-js/commit/c84bd58f69d40b051a3f06d7c9759bfa577c2d36) Thanks [@kyledetella](https://github.com/kyledetella)! - Ensure modal iframes are rendered at the highest allowed `z-index` (`2147483647`). This forces the Meso UI to live above all other elements in the [stacking context](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_positioned_layout/Understanding_z-index/Stacking_context).

## 0.1.7

### Patch Changes

- [#77](https://github.com/meso-network/meso-js/pull/77) [`69036e7`](https://github.com/meso-network/meso-js/commit/69036e7318b5934ac37916a8201ad377ee8f2297) Thanks [@dseeto](https://github.com/dseeto)! - Explicitly set [referrerPolicy](https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement/referrerPolicy) on Meso iframes. This prevents a bug in Firefox browsers where frames cannot establish their parent's origin using `document.referrer` if the parent has a no-referrer policy set.

## 0.1.6

### Patch Changes

- [#75](https://github.com/meso-network/meso-js/pull/75) [`2e8d94a`](https://github.com/meso-network/meso-js/commit/2e8d94a4ba00a719bdbc5cc51e24c103936d1a61) Thanks [@kyledetella](https://github.com/kyledetella)! - Allow passing query params to modal onboarding frame for `inlineTransfer` integrations.

## 0.1.5

### Patch Changes

- [#73](https://github.com/meso-network/meso-js/pull/73) [`5b83847`](https://github.com/meso-network/meso-js/commit/5b838478b049f883c7bc341b4ac277f1f2a99590) Thanks [@mikepilat](https://github.com/mikepilat)! - Add support for the Base blockchain

## 0.1.4

### Patch Changes

- [#70](https://github.com/meso-network/meso-js/pull/70) [`7679a06`](https://github.com/meso-network/meso-js/commit/7679a06fe96e5aeb4ef87492fbe2bb35a65f0da5) Thanks [@kyledetella](https://github.com/kyledetella)! - Adds the `TRANSFER_INCOMPLETE` event to the [`onEvent`](https://developers.meso.network/javascript-sdk/reference#on-event) callback.

  This event is dispatched only for the `inlineTransfer` integration and signals the user was unable to complete onboarding due to additional risk and compliance checks being required. It is not the same as the user canceling the flow.

## 0.1.3

### Patch Changes

- [#68](https://github.com/meso-network/meso-js/pull/68) [`9f4a88c`](https://github.com/meso-network/meso-js/commit/9f4a88cc79002870e830d16cf293bdd89bde3e9f) Thanks [@kyledetella](https://github.com/kyledetella)! - Provides default values for `sourceAsset` and `authenticationStrategy` when calling `inlineTransfer`.

  - `sourceAsset`: Will default to `Asset.USD` ("USD")
  - `authenticationStrategy`; Will default to `AuthenticationStrategy.WALLET_VERIFICATION` ([wallet verification](https://developers.meso.network/javascript-sdk/reference#authentication-strategy))

## 0.1.2

### Patch Changes

- [#66](https://github.com/meso-network/meso-js/pull/66) [`36ada91`](https://github.com/meso-network/meso-js/commit/36ada91f4d0255276f23a93c8a3fbbf39c1b8c60) Thanks [@kyledetella](https://github.com/kyledetella)! - Adds `ONBOARDING_TERMINATED` to frame request events. This allows us to have another signal when dismissing modal onboarding in the inline integration.

## 0.1.1

### Patch Changes

- [#63](https://github.com/meso-network/meso-js/pull/63) [`5fe098b`](https://github.com/meso-network/meso-js/commit/5fe098ba4e9d10c408c1f5f8d48d467de3871f9c) Thanks [@kyledetella](https://github.com/kyledetella)! - 🥅 Fixes a bug in the inline integration where if a developer called `destroy()` and the reference to the modal onboarding frame was lost, our logic would throw an undue exception. We now guard against missing frames when amounting.

## 0.1.0

### Minor Changes

- [#61](https://github.com/meso-network/meso-js/pull/61) [`4e299ba`](https://github.com/meso-network/meso-js/commit/4e299babcd96701398a0435ba86d7164893db2a3) Thanks [@kyledetella](https://github.com/kyledetella)! - Introduce `inlineTransfer` integration. With this release, developers can now embed the Meso transfer experience into a specified element within their page instead of a full-viewport modal.

## 0.0.86

### Patch Changes

- [#59](https://github.com/meso-network/meso-js/pull/59) [`81dc4e9`](https://github.com/meso-network/meso-js/commit/81dc4e98c86593a625b5b8b199b2ceb0b1cda009) Thanks [@dseeto](https://github.com/dseeto)! - Automatically hide the Meso iframe when a cash out transfer has been sent.

## 0.0.85

### Patch Changes

- [#57](https://github.com/meso-network/meso-js/pull/57) [`30817b6`](https://github.com/meso-network/meso-js/commit/30817b63489d7b16932cef0923ad5ec8cac9517a) Thanks [@dseeto](https://github.com/dseeto)! - Publish without git checks to avoid unclean git errors during publish action

## 0.0.84

### Patch Changes

- [#55](https://github.com/meso-network/meso-js/pull/55) [`3c3a043`](https://github.com/meso-network/meso-js/commit/3c3a0435094bdae7abf56e949cc666f46bc64c27) Thanks [@kyledetella](https://github.com/kyledetella)! - Reconcile lockfile. This release does not introduce any new functionality, but is bumping the version to reconcile our build process.

## 0.0.83

### Patch Changes

- [#46](https://github.com/meso-network/meso-js/pull/46) [`c794274`](https://github.com/meso-network/meso-js/commit/c7942745ea6673310a29f53551b36910fca0bffe) Thanks [@dseeto](https://github.com/dseeto)! - Add initial (limited access) support for cash out transfers.

## 0.0.82

### Patch Changes

- [#51](https://github.com/meso-network/meso-js/pull/51) [`89ba6d2`](https://github.com/meso-network/meso-js/commit/89ba6d227856cd581f5bff40340729ba600890eb) Thanks [@kyledetella](https://github.com/kyledetella)! - 🐛 This release fixes a bug introduced in [v0.0.81](https://github.com/meso-network/meso-js/releases/tag/%40meso-network%2Fmeso-js%400.0.81) where the `READY` event would not be surfaced. We now ensure the `READY` event is passed through message validation.

## 0.0.81

### Patch Changes

- [#49](https://github.com/meso-network/meso-js/pull/49) [`ba49aa0`](https://github.com/meso-network/meso-js/commit/ba49aa0eea9aecdd85bf6c430a22bfb66e30bb4b) Thanks [@kyledetella](https://github.com/kyledetella)! - Introduce `READY` event for when iframe is loaded.

## 0.0.80

### Patch Changes

- [#47](https://github.com/meso-network/meso-js/pull/47) [`3e384da`](https://github.com/meso-network/meso-js/commit/3e384da0b05da7ef0c064190e32ae8b88b987011) Thanks [@kyledetella](https://github.com/kyledetella)! - Introduce [Arbitrum](https://arbitrum.io/) support via the `Network` type.

## 0.0.79

### Patch Changes

- [#44](https://github.com/meso-network/meso-js/pull/44) [`b891836`](https://github.com/meso-network/meso-js/commit/b8918367207656bdcc53cdfbecf800fe6fc07d7a) Thanks [@kyledetella](https://github.com/kyledetella)! - Enable post messaging in React Native WebViews.

## 0.0.78

### Patch Changes

- [#41](https://github.com/meso-network/meso-js/pull/41) [`b2a3a64`](https://github.com/meso-network/meso-js/commit/b2a3a640e7c66a5097ef93d77be36fcaed29beb1) Thanks [@kyledetella](https://github.com/kyledetella)! - Introduce `mode` to transfer configuration to support operating in webviews within native mobile apps.

## 0.0.77

### Patch Changes

- [#39](https://github.com/meso-network/meso-js/pull/39) [`4afbd45`](https://github.com/meso-network/meso-js/commit/4afbd4542cdba82a3866902be150bff43c7c8463) Thanks [@kyledetella](https://github.com/kyledetella)! - Set
  [`color-scheme`](https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme)
  to `auto` by default on rendered iframe to ensure the Meso experience respects
  embedding application color overrides.

## 0.0.76

### Patch Changes

- [#37](https://github.com/meso-network/meso-js/pull/37) [`162757e`](https://github.com/meso-network/meso-js/commit/162757e850b0d9041ab80e282d03db6b46182be7) Thanks [@dseeto](https://github.com/dseeto)! - add OP Mainnet to network list

## 0.0.75

### Patch Changes

- [#35](https://github.com/meso-network/meso-js/pull/35) [`fc7a05a`](https://github.com/meso-network/meso-js/commit/fc7a05a0d907dc3cdc815ba2cf64efb612de069f) Thanks [@kyledetella](https://github.com/kyledetella)! - Remove `headlessSignature` from configuration options. This had been deprecated
  in
  [v0.0.71](https://github.com/meso-network/meso-js/releases/tag/%40meso-network%2Fmeso-js%400.0.71)
  and is now being fully removed

## 0.0.74

### Patch Changes

- [#33](https://github.com/meso-network/meso-js/pull/33) [`e340fea`](https://github.com/meso-network/meso-js/commit/e340feaf262bc8c8b6afc6c5e5e48d3e0393fda8) Thanks [@kyledetella](https://github.com/kyledetella)! - Guard against unreadable iframe `src` attributes

## 0.0.73

### Patch Changes

- [#31](https://github.com/meso-network/meso-js/pull/31) [`673dc09`](https://github.com/meso-network/meso-js/commit/673dc09aa6260d937e8fa5f906c1e2b5beed727a) Thanks [@kyledetella](https://github.com/kyledetella)! - Expose `createPostMessageBus`

## 0.0.72

### Patch Changes

- [#29](https://github.com/meso-network/meso-js/pull/29) [`871ba50`](https://github.com/meso-network/meso-js/commit/871ba50ac51e05794edfa10741a483a101240427) Thanks [@kyledetella](https://github.com/kyledetella)! - Collapse `@meso-network/types` and `@meso-network/post-message-bus` into `@meso-network/meso-js`.

  This EOLs `@meso-network/post-message-bus` which will no longer be published to npm.

## 0.0.71

### Patch Changes

- [#25](https://github.com/meso-network/meso-js/pull/25) [`2f9f9e2`](https://github.com/meso-network/meso-js/commit/2f9f9e23aaeb8ed83a56d85dfa99e08a658aba7f) Thanks [@kyledetella](https://github.com/kyledetella)! - Deprecate `headlessSignature` in favor of `authenticationStrategy` which introduces:

  - `WALLET_VERIFICATION` – Requires the user to sign a message with their wallet
    before engaging in a transfer
  - `HEADLESS_WALLET_VERIFICATION` – Requires an app (such as an embedded wallet)
    to sign a message on behalf of the user
  - `BYPASS_WALLET_VERIFICATION` – Requires no wallet signing for the transfer. This
    is typically used for pre-deployed smart contract wallets

- Updated dependencies [[`2f9f9e2`](https://github.com/meso-network/meso-js/commit/2f9f9e23aaeb8ed83a56d85dfa99e08a658aba7f)]:
  - @meso-network/post-message-bus@0.0.71

## 0.0.70

### Patch Changes

- [#23](https://github.com/meso-network/meso-js/pull/23) [`476f262`](https://github.com/meso-network/meso-js/commit/476f262b177d98b0a18774fe419ab1d4d550736b) Thanks [@kyledetella](https://github.com/kyledetella)! - Gracefully handle missing `document.referrer`

- Updated dependencies [[`476f262`](https://github.com/meso-network/meso-js/commit/476f262b177d98b0a18774fe419ab1d4d550736b)]:
  - @meso-network/post-message-bus@0.0.70

## 0.0.69

### Patch Changes

- [#21](https://github.com/meso-network/meso-js/pull/21) [`4a2935c`](https://github.com/meso-network/meso-js/commit/4a2935c692c381634bd725625cabd285806c9edf) Thanks [@kyledetella](https://github.com/kyledetella)! - Safely lookup parent origins across browsers when initializing post message bus.

- Updated dependencies [[`4a2935c`](https://github.com/meso-network/meso-js/commit/4a2935c692c381634bd725625cabd285806c9edf)]:
  - @meso-network/post-message-bus@0.0.69

## 0.0.68

### Patch Changes

- [#18](https://github.com/meso-network/meso-js/pull/18) [`c24c479`](https://github.com/meso-network/meso-js/commit/c24c479d1f56e24826c8b0d2d468ff48e16ee78c) Thanks [@dseeto](https://github.com/dseeto)! - add polygon network and matic asset support

- Updated dependencies [[`c24c479`](https://github.com/meso-network/meso-js/commit/c24c479d1f56e24826c8b0d2d468ff48e16ee78c)]:
  - @meso-network/post-message-bus@0.0.68

## 0.0.67

### Patch Changes

- [#17](https://github.com/meso-network/meso-js/pull/17) [`aaf3d63`](https://github.com/meso-network/meso-js/commit/aaf3d6394db5ee03029d410228b23eae31ff3f04) Thanks [@dseeto](https://github.com/dseeto)! - add unsupported network/asset errors

- Updated dependencies [[`aaf3d63`](https://github.com/meso-network/meso-js/commit/aaf3d6394db5ee03029d410228b23eae31ff3f04)]:
  - @meso-network/post-message-bus@0.0.67

## 0.0.66

### Patch Changes

- [#15](https://github.com/meso-network/meso-js/pull/15) [`843647b`](https://github.com/meso-network/meso-js/commit/843647b36e2db1a8d0364d3f69c9ad7025a89c1f) Thanks [@dseeto](https://github.com/dseeto)! - fix instead of link changesets for all modules

- Updated dependencies [[`843647b`](https://github.com/meso-network/meso-js/commit/843647b36e2db1a8d0364d3f69c9ad7025a89c1f)]:
  - @meso-network/post-message-bus@0.0.66

## 0.0.65

### Patch Changes

- [#13](https://github.com/meso-network/meso-js/pull/13) [`948b35c`](https://github.com/meso-network/meso-js/commit/948b35c60d6367d9725ca99eb535ff934c87dc24) Thanks [@dseeto](https://github.com/dseeto)! - add support for headless message signing

## 0.0.64

### Patch Changes

- [#11](https://github.com/meso-network/meso-js/pull/11) [`5646396`](https://github.com/meso-network/meso-js/commit/5646396c721304a3cb73f91032f20dab1af39a46) Thanks [@kyledetella](https://github.com/kyledetella)! - Remove testnets from `transfer` configuration.

- Updated dependencies [[`5646396`](https://github.com/meso-network/meso-js/commit/5646396c721304a3cb73f91032f20dab1af39a46)]:
  - @meso-network/post-message-bus@0.0.64

## 0.0.63

### Patch Changes

- [#9](https://github.com/meso-network/meso-js/pull/9) [`ac19749`](https://github.com/meso-network/meso-js/commit/ac1974988a443071d6d7fc4c5d4d5591c0fe7cb1) Thanks [@kyledetella](https://github.com/kyledetella)! - (Internal code only): Use relative paths to reference types in `post-message-bus`.

- Updated dependencies [[`ac19749`](https://github.com/meso-network/meso-js/commit/ac1974988a443071d6d7fc4c5d4d5591c0fe7cb1)]:
  - @meso-network/post-message-bus@0.0.63

## 0.0.62

### Patch Changes

- [#7](https://github.com/meso-network/meso-js/pull/7) [`d504c65`](https://github.com/meso-network/meso-js/commit/d504c651ca1b4b45ccf9071cf25e810b40ec5fab) Thanks [@kyledetella](https://github.com/kyledetella)! - Ensure `meso-js` and `post-message-bus` are public packages.

- Updated dependencies [[`d504c65`](https://github.com/meso-network/meso-js/commit/d504c651ca1b4b45ccf9071cf25e810b40ec5fab)]:
  - @meso-network/post-message-bus@0.0.62

## 0.0.61

### Patch Changes

- [#5](https://github.com/meso-network/meso-js/pull/5) [`959f37b`](https://github.com/meso-network/meso-js/commit/959f37ba7410e03d0d37c70bd374d269fe10c826) Thanks [@kyledetella](https://github.com/kyledetella)! - Allow passing in `layout.offset.horizontal` and `layout.offset.vertical` ad configuration to `transfer()`.

- Updated dependencies []:
  - @meso-network/post-message-bus@0.0.61

## 0.0.60

### Patch Changes

- [#3](https://github.com/meso-network/meso-js/pull/3) [`567d2ef`](https://github.com/meso-network/meso-js/commit/567d2efc1c750f5d44491e445fed63a966ee0bf0) Thanks [@dseeto](https://github.com/dseeto)! - Introduce layout options for customization of positioning.

- Updated dependencies []:
  - @meso-network/post-message-bus@0.0.60

## 0.0.59

### Patch Changes

- [#1](https://github.com/meso-network/meso-js/pull/1) [`b6a2deb`](https://github.com/meso-network/meso-js/commit/b6a2deb83e78871e5f7e7ae9422d666deeded374) Thanks [@kyledetella](https://github.com/kyledetella)! - Initial release!

- Updated dependencies [[`b6a2deb`](https://github.com/meso-network/meso-js/commit/b6a2deb83e78871e5f7e7ae9422d666deeded374)]:
  - @meso-network/post-message-bus@0.0.59
