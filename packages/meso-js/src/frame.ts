import type { SerializedTransferIframeParams } from "./types";

export const setupFrame = (
  apiHost: string,
  params: SerializedTransferIframeParams,
) => {
  const queryString = new URLSearchParams(params).toString();
  const iframe = injectFullScreenIframe(`${apiHost}/app?${queryString}`);

  return {
    element: iframe,
    remove: () => iframe.parentElement?.removeChild(iframe),
    hide: () => {
      iframe.style.display = "none";
      iframe.style.zIndex = "0";
    },
  };
};

const injectFullScreenIframe = (src: string) => {
  const iframe = document.createElement("iframe");
  iframe.src = src;
  iframe.setAttribute("allowtransparency", "true");
  iframe.style.position = "fixed";
  iframe.style.left = "0";
  iframe.style.top = "0";
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.zIndex = "9999";
  iframe.style.border = "none";
  iframe.style.boxSizing = "border-box";
  iframe.style.backgroundColor = "transparent";
  iframe.style.colorScheme = "auto";

  document.body.appendChild(iframe);

  return iframe;
};
