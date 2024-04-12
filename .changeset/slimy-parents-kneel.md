---
"@meso-network/meso-js": patch
---

🐛 This release fixes a bug introduced in [v0.0.81](https://github.com/meso-network/meso-js/releases/tag/%40meso-network%2Fmeso-js%400.0.81) where the `READY` event would not be surfaced. We now ensure the `READY` event is passed through message validation.
