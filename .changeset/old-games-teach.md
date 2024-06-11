---
"@meso-network/meso-js": patch
---

Explicitly set [referrerPolicy](https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement/referrerPolicy) on Meso iframes. This prevents a bug in Firefox browsers where frames cannot establish their parent's origin using `document.referrer` if the parent has a no-referrer policy set.
