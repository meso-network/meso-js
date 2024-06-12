---
"@meso-network/meso-js": patch
---

Ensure modal iframes are rendered at the highest allowed `z-index` (`2147483647`). This forces the Meso UI to live above all other elements in the [stacking context](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_positioned_layout/Understanding_z-index/Stacking_context).
