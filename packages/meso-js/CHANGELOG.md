# @meso-network/meso-js

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
