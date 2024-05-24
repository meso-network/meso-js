---
"@meso-network/meso-js": patch
---

🥅 Fixes a bug in the inline integration where if a developer called `destroy()` and the reference to the modal onboarding frame was lost, our logic would throw an undue exception. We now guard against missing frames when amounting.
